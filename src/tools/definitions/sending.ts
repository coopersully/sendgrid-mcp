import { ToolDefinition } from '../types.js';

export const sendingToolDefinitions: ToolDefinition[] = [
  {
    name: 'send_email',
    description: 'Send an email using SendGrid',
    inputSchema: {
      type: 'object',
      properties: {
        to: {
          type: 'string',
          description: 'Recipient email address'
        },
        subject: {
          type: 'string',
          description: 'Email subject line'
        },
        text: {
          type: 'string',
          description: 'Plain text content of the email'
        },
        html: {
          type: 'string',
          description: 'HTML content of the email (optional)'
        },
        from: {
          type: 'string',
          description: 'Sender email address (must be verified with SendGrid)'
        },
        template_id: {
          type: 'string',
          description: 'SendGrid template ID (optional)'
        },
        dynamic_template_data: {
          type: 'object',
          description: 'Dynamic data for template variables (optional)'
        }
      },
      required: ['to', 'subject', 'text', 'from']
    }
  },
  {
    name: 'send_to_list',
    description: 'Send an email to a contact list using SendGrid Single Sends',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the single send'
        },
        list_ids: {
          type: 'array',
          items: {
            type: 'string'
          },
          description: 'Array of list IDs to send to'
        },
        segment_ids: {
          type: 'array',
          items: {
            type: 'string'
          },
          description: 'Optional array of segment IDs to send to'
        },
        subject: {
          type: 'string',
          description: 'Email subject line'
        },
        html_content: {
          type: 'string',
          description: 'HTML content of the email'
        },
        plain_content: {
          type: 'string',
          description: 'Plain text content of the email'
        },
        sender_id: {
          type: 'number',
          description: 'ID of the verified sender'
        },
        suppression_group_id: {
          type: 'number',
          description: 'ID of the suppression group for unsubscribes (required if custom_unsubscribe_url not provided)'
        },
        custom_unsubscribe_url: {
          type: 'string',
          description: 'Custom URL for unsubscribes (required if suppression_group_id not provided)'
        }
      },
      required: ['name', 'subject', 'html_content', 'plain_content', 'sender_id']
    }
  },
  {
    name: 'create_single_send',
    description: 'Mutating: create a SendGrid Single Send draft without scheduling it',
    inputSchema: {
      type: 'object',
      properties: {
        single_send: {
          type: 'object',
          description: 'Complete SendGrid Single Send request body'
        }
      },
      required: ['single_send']
    }
  },
  {
    name: 'update_single_send',
    description: 'Mutating: update a SendGrid Single Send draft',
    inputSchema: {
      type: 'object',
      properties: {
        single_send_id: {
          type: 'string',
          description: 'Single Send ID'
        },
        single_send: {
          type: 'object',
          description: 'Fields to patch on the Single Send'
        }
      },
      required: ['single_send_id', 'single_send']
    }
  },
  {
    name: 'delete_single_send',
    description: 'Destructive: delete a SendGrid Single Send. Requires confirm_delete: true.',
    inputSchema: {
      type: 'object',
      properties: {
        single_send_id: {
          type: 'string',
          description: 'Single Send ID'
        },
        confirm_delete: {
          type: 'boolean',
          description: 'Must be true to confirm deletion'
        }
      },
      required: ['single_send_id', 'confirm_delete']
    }
  },
  {
    name: 'duplicate_single_send',
    description: 'Mutating: duplicate a SendGrid Single Send',
    inputSchema: {
      type: 'object',
      properties: {
        single_send_id: {
          type: 'string',
          description: 'Source Single Send ID'
        },
        name: {
          type: 'string',
          description: 'Optional name for duplicate'
        }
      },
      required: ['single_send_id']
    }
  },
  {
    name: 'search_single_sends',
    description: 'Read-only: search SendGrid Single Sends with SendGrid query syntax',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'SendGrid Single Sends search query'
        },
        page_size: {
          type: 'number',
          description: 'Optional page size'
        },
        page_token: {
          type: 'string',
          description: 'Optional page token'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'schedule_single_send',
    description: 'Mutating: schedule an existing SendGrid Single Send for now or a future ISO timestamp',
    inputSchema: {
      type: 'object',
      properties: {
        single_send_id: {
          type: 'string',
          description: 'Single Send ID'
        },
        send_at: {
          type: 'string',
          description: 'Use "now" or an ISO 8601 timestamp'
        }
      },
      required: ['single_send_id', 'send_at']
    }
  },
  {
    name: 'get_single_send_schedule',
    description: 'Read-only: retrieve schedule information for a Single Send',
    inputSchema: {
      type: 'object',
      properties: {
        single_send_id: {
          type: 'string',
          description: 'Single Send ID'
        }
      },
      required: ['single_send_id']
    }
  },
  {
    name: 'cancel_single_send_schedule',
    description: 'Mutating: cancel a scheduled Single Send without deleting the draft',
    inputSchema: {
      type: 'object',
      properties: {
        single_send_id: {
          type: 'string',
          description: 'Single Send ID'
        }
      },
      required: ['single_send_id']
    }
  },
  {
    name: 'list_single_send_categories',
    description: 'Read-only: list categories used by SendGrid Single Sends',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'list_single_send_stats',
    description: 'Read-only: retrieve Single Sends stats',
    inputSchema: {
      type: 'object',
      properties: {
        start_date: {
          type: 'string',
          description: 'Optional start date'
        },
        end_date: {
          type: 'string',
          description: 'Optional end date'
        },
        aggregated_by: {
          type: 'string',
          enum: ['day', 'week', 'month'],
          description: 'Optional aggregation'
        }
      },
      required: []
    }
  },
  {
    name: 'get_single_send_stats',
    description: 'Read-only: retrieve stats for one SendGrid Single Send',
    inputSchema: {
      type: 'object',
      properties: {
        single_send_id: {
          type: 'string',
          description: 'Single Send ID'
        },
        start_date: {
          type: 'string',
          description: 'Optional start date'
        },
        end_date: {
          type: 'string',
          description: 'Optional end date'
        },
        aggregated_by: {
          type: 'string',
          enum: ['day', 'week', 'month'],
          description: 'Optional aggregation'
        }
      },
      required: ['single_send_id']
    }
  },
  {
    name: 'get_single_send',
    description: 'Get details of a specific single send',
    inputSchema: {
      type: 'object',
      properties: {
        single_send_id: {
          type: 'string',
          description: 'ID of the single send to retrieve'
        }
      },
      required: ['single_send_id']
    }
  },
  {
    name: 'list_single_sends',
    description: 'List all single sends in your SendGrid account',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  }
];
