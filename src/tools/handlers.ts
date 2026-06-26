import { SendGridService } from '../services/sendgrid.js';
import { ToolHandler } from './types.js';
import { validateArgs } from './validation.js';
import { contactsToolHandlers } from './handlers/contacts.js';
import { templatesToolHandlers } from './handlers/templates.js';
import { designsToolHandlers } from './handlers/designs.js';
import { marketingToolHandlers } from './handlers/marketing.js';
import { suppressionsToolHandlers } from './handlers/suppressions.js';
import { sendingToolHandlers } from './handlers/sending.js';
import { validationStatsToolHandlers } from './handlers/validationStats.js';

const toolHandlers: Record<string, ToolHandler> = {
  ...contactsToolHandlers,
  ...sendingToolHandlers,
  ...templatesToolHandlers,
  ...designsToolHandlers,
  ...marketingToolHandlers,
  ...validationStatsToolHandlers,
  ...suppressionsToolHandlers
};

export const handleToolCall = async (service: SendGridService, name: string, args: any) => {
  const validatedArgs = validateArgs(name, args);
  const handler = toolHandlers[name];

  if (!handler) {
    throw new Error(`Unknown tool: ${name}`);
  }

  return await handler(service, validatedArgs);
};
