import { ToolDefinition } from './types.js';
import { contactsToolDefinitions } from './definitions/contacts.js';
import { templatesToolDefinitions } from './definitions/templates.js';
import { designsToolDefinitions } from './definitions/designs.js';
import { marketingToolDefinitions } from './definitions/marketing.js';
import { suppressionsToolDefinitions } from './definitions/suppressions.js';
import { sendingToolDefinitions } from './definitions/sending.js';
import { validationStatsToolDefinitions } from './definitions/validationStats.js';

const closeInputSchemas = (tools: ToolDefinition[]): ToolDefinition[] =>
  tools.map((tool) => ({
    ...tool,
    inputSchema: {
      additionalProperties: false,
      ...tool.inputSchema
    }
  }));

export const getToolDefinitions = (_service?: unknown) =>
  closeInputSchemas([
    ...contactsToolDefinitions,
    ...sendingToolDefinitions,
    ...templatesToolDefinitions,
    ...designsToolDefinitions,
    ...marketingToolDefinitions,
    ...validationStatsToolDefinitions,
    ...suppressionsToolDefinitions
  ]);
