import { SendGridService } from '../../services/sendgrid.js';
import { ToolHandler } from '../types.js';

export const validationStatsToolHandlers: Record<string, ToolHandler> = {
  validate_email: async (service: SendGridService, args: Record<string, any>) => {
    const validation = await service.validateEmail(args.email);
    return { content: [{ type: 'text', text: JSON.stringify(validation, null, 2) }] };
  },
  get_stats: async (service: SendGridService, args: Record<string, any>) => {
    const stats = await service.getStats(args as any);
    return { content: [{ type: 'text', text: JSON.stringify(stats, null, 2) }] };
  }
};
