import { ToolDefinition } from '../types.js';

export const suppressionsToolDefinitions: ToolDefinition[] = [
  {
    name: 'list_suppression_groups',
    description: 'List all unsubscribe groups in your SendGrid account',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'list_group_suppressions',
    description: 'Read-only: list suppressed email addresses in a suppression group',
    inputSchema: {
      type: 'object',
      properties: {
        group_id: {
          type: 'number',
          description: 'Suppression group ID'
        },
        start_time: {
          type: 'number',
          description: 'Optional Unix start time'
        },
        end_time: {
          type: 'number',
          description: 'Optional Unix end time'
        }
      },
      required: ['group_id']
    }
  },
  {
    name: 'add_group_suppressions',
    description: 'Mutating: add email addresses to a suppression group',
    inputSchema: {
      type: 'object',
      properties: {
        group_id: {
          type: 'number',
          description: 'Suppression group ID'
        },
        emails: {
          type: 'array',
          items: { type: 'string' },
          description: 'Email addresses to suppress'
        }
      },
      required: ['group_id', 'emails']
    }
  },
  {
    name: 'delete_group_suppression',
    description:
      'Mutating and sensitive: remove one email address from a suppression group. Requires confirm_delete: true.',
    inputSchema: {
      type: 'object',
      properties: {
        group_id: {
          type: 'number',
          description: 'Suppression group ID'
        },
        email: {
          type: 'string',
          description: 'Email address to remove from suppression'
        },
        confirm_delete: {
          type: 'boolean',
          description: 'Must be true to confirm removal'
        }
      },
      required: ['group_id', 'email', 'confirm_delete']
    }
  },
  {
    name: 'list_global_suppressions',
    description: 'Read-only: list global suppressions',
    inputSchema: {
      type: 'object',
      properties: {
        start_time: {
          type: 'number',
          description: 'Optional Unix start time'
        },
        end_time: {
          type: 'number',
          description: 'Optional Unix end time'
        }
      },
      required: []
    }
  },
  {
    name: 'add_global_suppressions',
    description: 'Mutating: add email addresses to global suppressions',
    inputSchema: {
      type: 'object',
      properties: {
        emails: {
          type: 'array',
          items: { type: 'string' },
          description: 'Email addresses to suppress globally'
        }
      },
      required: ['emails']
    }
  },
  {
    name: 'delete_global_suppression',
    description:
      'Mutating and sensitive: remove one email address from global suppressions. Requires confirm_delete: true.',
    inputSchema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          description: 'Email address to remove from global suppression'
        },
        confirm_delete: {
          type: 'boolean',
          description: 'Must be true to confirm removal'
        }
      },
      required: ['email', 'confirm_delete']
    }
  },
  {
    name: 'list_bounces',
    description: 'Read-only: list bounce suppressions',
    inputSchema: {
      type: 'object',
      properties: {
        start_time: { type: 'number', description: 'Optional Unix start time' },
        end_time: { type: 'number', description: 'Optional Unix end time' },
        limit: { type: 'number', description: 'Maximum records to return. Defaults to 50.' },
        offset: { type: 'number', description: 'Record offset for pagination' },
        email: { type: 'string', description: 'Optional email filter. Wildcards are supported by SendGrid.' },
        include_emails: { type: 'boolean', description: 'Set true to include email addresses. Defaults to false.' }
      },
      required: []
    }
  },
  {
    name: 'list_blocks',
    description: 'Read-only: list block suppressions',
    inputSchema: {
      type: 'object',
      properties: {
        start_time: { type: 'number', description: 'Optional Unix start time' },
        end_time: { type: 'number', description: 'Optional Unix end time' },
        limit: { type: 'number', description: 'Maximum records to return. Defaults to 50.' },
        offset: { type: 'number', description: 'Record offset for pagination' },
        email: { type: 'string', description: 'Optional email filter. Wildcards are supported by SendGrid.' },
        include_emails: { type: 'boolean', description: 'Set true to include email addresses. Defaults to false.' }
      },
      required: []
    }
  },
  {
    name: 'list_invalid_emails',
    description: 'Read-only: list invalid email suppressions',
    inputSchema: {
      type: 'object',
      properties: {
        start_time: { type: 'number', description: 'Optional Unix start time' },
        end_time: { type: 'number', description: 'Optional Unix end time' },
        limit: { type: 'number', description: 'Maximum records to return. Defaults to 50.' },
        offset: { type: 'number', description: 'Record offset for pagination' },
        email: { type: 'string', description: 'Optional email filter. Wildcards are supported by SendGrid.' },
        include_emails: { type: 'boolean', description: 'Set true to include email addresses. Defaults to false.' }
      },
      required: []
    }
  },
  {
    name: 'list_spam_reports',
    description: 'Read-only: list spam report suppressions',
    inputSchema: {
      type: 'object',
      properties: {
        start_time: { type: 'number', description: 'Optional Unix start time' },
        end_time: { type: 'number', description: 'Optional Unix end time' },
        limit: { type: 'number', description: 'Maximum records to return. Defaults to 50.' },
        offset: { type: 'number', description: 'Record offset for pagination' },
        email: { type: 'string', description: 'Optional email filter. Wildcards are supported by SendGrid.' },
        include_emails: { type: 'boolean', description: 'Set true to include email addresses. Defaults to false.' }
      },
      required: []
    }
  }
];
