import { ToolDefinition } from '../types.js';

export const validationStatsToolDefinitions: ToolDefinition[] = [
  {
    name: 'validate_email',
    description: 'Validate an email address using SendGrid',
    inputSchema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          description: 'Email address to validate'
        }
      },
      required: ['email']
    }
  },
  {
    name: 'get_stats',
    description: 'Get SendGrid email statistics',
    inputSchema: {
      type: 'object',
      properties: {
        start_date: {
          type: 'string',
          description: 'Start date in YYYY-MM-DD format'
        },
        end_date: {
          type: 'string',
          description: 'End date in YYYY-MM-DD format (optional)'
        },
        aggregated_by: {
          type: 'string',
          enum: ['day', 'week', 'month'],
          description: 'How to aggregate the statistics (optional)'
        }
      },
      required: ['start_date']
    }
  }
];
