export type JsonSchema = {
  [key: string]: any;
  type?: string;
  properties?: Record<string, JsonSchema>;
  required?: string[];
  items?: JsonSchema;
  enum?: unknown[];
};

export type ToolDefinition = {
  name: string;
  description: string;
  inputSchema: JsonSchema;
};

export type ToolResult = {
  content: Array<{
    type: 'text';
    text: string;
  }>;
};

export type ToolHandler = (service: any, args: Record<string, any>) => Promise<ToolResult>;
