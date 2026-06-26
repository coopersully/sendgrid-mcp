#!/usr/bin/env node

import dotenv from 'dotenv';
dotenv.config();

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { SendGridService } from './services/sendgrid.js';
import { getToolDefinitions, handleToolCall } from './tools/index.js';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
if (!SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY environment variable is required');
}

const sendGridService = new SendGridService(SENDGRID_API_KEY);

const server = new Server(
  {
    name: 'sendgrid-mcp-server',
    version: '0.2.0'
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: getToolDefinitions(sendGridService)
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    return await handleToolCall(sendGridService, request.params.name, request.params.arguments);
  } catch (error: any) {
    console.error('SendGrid tool error:', error instanceof Error ? error.message : 'Unexpected error');

    if (error.response?.body?.errors) {
      throw new McpError(
        ErrorCode.InternalError,
        `SendGrid API Error: ${error.response.body.errors.map((e: { message: string }) => e.message).join(', ')}`
      );
    }

    if (error instanceof Error) {
      throw new McpError(ErrorCode.InternalError, error.message);
    }

    throw new McpError(ErrorCode.InternalError, 'An unexpected error occurred');
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('SendGrid MCP server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
