import { ToolDefinition } from '../types.js';

export const marketingToolDefinitions: ToolDefinition[] = [
  {
    name: 'list_custom_fields',
    description: 'Read-only: list SendGrid marketing contact custom field definitions',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'create_custom_field',
    description: 'Mutating: create a SendGrid marketing contact custom field definition',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Custom field name'
        },
        field_type: {
          type: 'string',
          description: 'SendGrid field type, such as Text, Number, or Date'
        }
      },
      required: ['name', 'field_type']
    }
  },
  {
    name: 'update_custom_field',
    description: 'Mutating: update a SendGrid marketing contact custom field definition',
    inputSchema: {
      type: 'object',
      properties: {
        field_id: {
          type: 'string',
          description: 'Custom field definition ID'
        },
        name: {
          type: 'string',
          description: 'Updated custom field name'
        }
      },
      required: ['field_id', 'name']
    }
  },
  {
    name: 'delete_custom_field',
    description:
      'Destructive: delete a SendGrid marketing contact custom field definition. Requires confirm_delete: true.',
    inputSchema: {
      type: 'object',
      properties: {
        field_id: {
          type: 'string',
          description: 'Custom field definition ID'
        },
        confirm_delete: {
          type: 'boolean',
          description: 'Must be true to confirm deletion'
        }
      },
      required: ['field_id', 'confirm_delete']
    }
  },
  {
    name: 'list_segments',
    description: 'Read-only: list SendGrid Segments v2 segments',
    inputSchema: {
      type: 'object',
      properties: {
        page_size: {
          type: 'number',
          description: 'Optional page size'
        },
        page_token: {
          type: 'string',
          description: 'Optional page token'
        }
      },
      required: []
    }
  },
  {
    name: 'create_segment',
    description: 'Mutating: create a SendGrid Segments v2 segment',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Segment name'
        },
        query_dsl: {
          type: 'string',
          description: 'SendGrid segment query DSL'
        }
      },
      required: ['name', 'query_dsl']
    }
  },
  {
    name: 'get_segment',
    description: 'Read-only: retrieve one SendGrid Segments v2 segment',
    inputSchema: {
      type: 'object',
      properties: {
        segment_id: {
          type: 'string',
          description: 'Segment ID'
        }
      },
      required: ['segment_id']
    }
  },
  {
    name: 'update_segment',
    description: 'Mutating: update a SendGrid Segments v2 segment',
    inputSchema: {
      type: 'object',
      properties: {
        segment_id: {
          type: 'string',
          description: 'Segment ID'
        },
        name: {
          type: 'string',
          description: 'Updated segment name'
        },
        query_dsl: {
          type: 'string',
          description: 'Updated SendGrid segment query DSL'
        }
      },
      required: ['segment_id']
    }
  },
  {
    name: 'refresh_segment',
    description: 'Mutating: refresh a SendGrid Segments v2 segment',
    inputSchema: {
      type: 'object',
      properties: {
        segment_id: {
          type: 'string',
          description: 'Segment ID'
        }
      },
      required: ['segment_id']
    }
  },
  {
    name: 'delete_segment',
    description: 'Destructive: delete a SendGrid Segments v2 segment. Requires confirm_delete: true.',
    inputSchema: {
      type: 'object',
      properties: {
        segment_id: {
          type: 'string',
          description: 'Segment ID'
        },
        confirm_delete: {
          type: 'boolean',
          description: 'Must be true to confirm deletion'
        }
      },
      required: ['segment_id', 'confirm_delete']
    }
  },
  {
    name: 'list_verified_senders',
    description: 'List all verified sender identities in your SendGrid account',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'list_marketing_senders',
    description: 'Read-only: list SendGrid Marketing sender identities',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_marketing_sender',
    description: 'Read-only: retrieve one SendGrid Marketing sender identity',
    inputSchema: {
      type: 'object',
      properties: {
        sender_id: {
          type: 'number',
          description: 'Marketing sender ID'
        }
      },
      required: ['sender_id']
    }
  },
  {
    name: 'create_marketing_sender',
    description: 'Mutating: create a SendGrid Marketing sender identity',
    inputSchema: {
      type: 'object',
      properties: {
        sender: {
          type: 'object',
          description: 'Complete SendGrid sender request body'
        }
      },
      required: ['sender']
    }
  },
  {
    name: 'update_marketing_sender',
    description: 'Mutating: update a SendGrid Marketing sender identity',
    inputSchema: {
      type: 'object',
      properties: {
        sender_id: {
          type: 'number',
          description: 'Marketing sender ID'
        },
        sender: {
          type: 'object',
          description: 'Fields to patch on the sender identity'
        }
      },
      required: ['sender_id', 'sender']
    }
  },
  {
    name: 'delete_marketing_sender',
    description: 'Destructive: delete a SendGrid Marketing sender identity. Requires confirm_delete: true.',
    inputSchema: {
      type: 'object',
      properties: {
        sender_id: {
          type: 'number',
          description: 'Marketing sender ID'
        },
        confirm_delete: {
          type: 'boolean',
          description: 'Must be true to confirm deletion'
        }
      },
      required: ['sender_id', 'confirm_delete']
    }
  },
  {
    name: 'resend_marketing_sender_verification',
    description: 'Mutating: resend verification email for a SendGrid Marketing sender identity',
    inputSchema: {
      type: 'object',
      properties: {
        sender_id: {
          type: 'number',
          description: 'Marketing sender ID'
        }
      },
      required: ['sender_id']
    }
  }
];
