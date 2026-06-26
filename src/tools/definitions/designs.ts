import { ToolDefinition } from '../types.js';

export const designsToolDefinitions: ToolDefinition[] = [
  {
    name: 'list_designs',
    description: 'Read-only: list SendGrid Design Library designs',
    inputSchema: {
      type: 'object',
      properties: {
        page_size: {
          type: 'number',
          description: 'Optional page size'
        },
        page_token: {
          type: 'string',
          description: 'Optional page token from a previous response'
        },
        summary: {
          type: 'boolean',
          description: 'Optional summary mode for lighter responses'
        }
      },
      required: []
    }
  },
  {
    name: 'get_design',
    description: 'Read-only: retrieve a SendGrid Design Library design including editable content fields',
    inputSchema: {
      type: 'object',
      properties: {
        design_id: {
          type: 'string',
          description: 'ID of the design to retrieve'
        }
      },
      required: ['design_id']
    }
  },
  {
    name: 'create_design',
    description: 'Mutating: create a new SendGrid Design Library design',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Design name'
        },
        subject: {
          type: 'string',
          description: 'Optional email subject'
        },
        html_content: {
          type: 'string',
          description: 'Optional design HTML content'
        },
        plain_content: {
          type: 'string',
          description: 'Optional plain text content'
        },
        generate_plain_content: {
          type: 'boolean',
          description: 'Optional flag for SendGrid to generate plain text from HTML'
        },
        editor: {
          type: 'string',
          description: 'Optional editor type supported by SendGrid'
        },
        categories: {
          type: 'array',
          items: { type: 'string' },
          description: 'Optional categories'
        }
      },
      required: ['name']
    }
  },
  {
    name: 'update_design',
    description: 'Mutating: patch an existing SendGrid Design Library design',
    inputSchema: {
      type: 'object',
      properties: {
        design_id: {
          type: 'string',
          description: 'ID of the design to update'
        },
        name: {
          type: 'string',
          description: 'Updated design name'
        },
        subject: {
          type: 'string',
          description: 'Updated email subject'
        },
        html_content: {
          type: 'string',
          description: 'Updated design HTML content'
        },
        plain_content: {
          type: 'string',
          description: 'Updated plain text content'
        },
        generate_plain_content: {
          type: 'boolean',
          description: 'Whether SendGrid should generate plain text from HTML'
        },
        editor: {
          type: 'string',
          description: 'Editor type supported by SendGrid'
        },
        categories: {
          type: 'array',
          items: { type: 'string' },
          description: 'Updated categories'
        }
      },
      required: ['design_id']
    }
  },
  {
    name: 'duplicate_design',
    description: 'Mutating: copy an existing SendGrid Design Library design',
    inputSchema: {
      type: 'object',
      properties: {
        design_id: {
          type: 'string',
          description: 'ID of the design to copy'
        },
        name: {
          type: 'string',
          description: 'Optional name for the copied design'
        }
      },
      required: ['design_id']
    }
  },
  {
    name: 'delete_design',
    description: 'Destructive: permanently delete a SendGrid Design Library design. Requires confirm_delete: true.',
    inputSchema: {
      type: 'object',
      properties: {
        design_id: {
          type: 'string',
          description: 'ID of the design to delete'
        },
        confirm_delete: {
          type: 'boolean',
          description: 'Must be true to confirm permanent deletion'
        }
      },
      required: ['design_id', 'confirm_delete']
    }
  },
  {
    name: 'list_pre_built_designs',
    description: 'Read-only: list SendGrid pre-built Design Library designs that can be copied into your account',
    inputSchema: {
      type: 'object',
      properties: {
        page_size: {
          type: 'number',
          description: 'Optional page size'
        },
        page_token: {
          type: 'string',
          description: 'Optional page token from a previous response'
        },
        summary: {
          type: 'boolean',
          description: 'Optional summary mode for lighter responses'
        }
      },
      required: []
    }
  },
  {
    name: 'get_pre_built_design',
    description: 'Read-only: retrieve a SendGrid pre-built design',
    inputSchema: {
      type: 'object',
      properties: {
        design_id: {
          type: 'string',
          description: 'ID of the pre-built design to retrieve'
        }
      },
      required: ['design_id']
    }
  },
  {
    name: 'duplicate_pre_built_design',
    description: 'Mutating: copy a SendGrid pre-built design into your account',
    inputSchema: {
      type: 'object',
      properties: {
        design_id: {
          type: 'string',
          description: 'ID of the pre-built design to copy'
        },
        name: {
          type: 'string',
          description: 'Optional name for the copied design'
        }
      },
      required: ['design_id']
    }
  }
];
