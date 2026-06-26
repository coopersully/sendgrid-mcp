import { getToolDefinitions } from './definitions.js';
import { JsonSchema } from './types.js';

const getToolDefinition = (name: string) => getToolDefinitions().find((tool) => tool.name === name);

const validateType = (name: string, value: unknown, schema: JsonSchema) => {
  if (schema.enum && !schema.enum.includes(value)) {
    throw new Error(`Invalid value for argument ${name}. Expected one of: ${schema.enum.join(', ')}`);
  }

  switch (schema.type) {
    case 'string':
      if (typeof value !== 'string' || value.trim() === '') {
        throw new Error(`Invalid argument ${name}: expected non-empty string`);
      }
      return;
    case 'number':
      if (typeof value !== 'number' || !Number.isFinite(value)) {
        throw new Error(`Invalid argument ${name}: expected number`);
      }
      return;
    case 'boolean':
      if (typeof value !== 'boolean') {
        throw new Error(`Invalid argument ${name}: expected boolean`);
      }
      return;
    case 'array':
      if (!Array.isArray(value)) {
        throw new Error(`Invalid argument ${name}: expected array`);
      }
      if (value.length === 0) {
        throw new Error(`Invalid argument ${name}: expected at least one item`);
      }
      if (schema.items) {
        value.forEach((item, index) => validateType(`${name}[${index}]`, item, schema.items!));
      }
      return;
    case 'object':
      if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        throw new Error(`Invalid argument ${name}: expected object`);
      }
      return;
    default:
      return;
  }
};

export const validateArgs = (name: string, args: any): Record<string, any> => {
  const tool = getToolDefinition(name);
  if (!tool) {
    throw new Error(`Unknown tool: ${name}`);
  }

  const normalizedArgs = args ?? {};
  if (typeof normalizedArgs !== 'object' || Array.isArray(normalizedArgs)) {
    throw new Error('Tool arguments must be an object');
  }

  const schema = tool.inputSchema;
  const properties = schema.properties ?? {};

  for (const requiredName of schema.required ?? []) {
    if (normalizedArgs[requiredName] === undefined) {
      throw new Error(`Missing required argument: ${requiredName}`);
    }
  }

  for (const argName of Object.keys(normalizedArgs)) {
    const propertySchema = properties[argName];
    if (!propertySchema) {
      throw new Error(`Unexpected argument: ${argName}`);
    }
    validateType(argName, normalizedArgs[argName], propertySchema);
  }

  return normalizedArgs;
};
