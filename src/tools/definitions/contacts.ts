import { ToolDefinition } from '../types.js';

export const contactsToolDefinitions: ToolDefinition[] = [
  {
    name: 'delete_contacts',
    description: 'Destructive: permanently delete contacts from your SendGrid account. Requires confirm_delete: true.',
    inputSchema: {
      type: 'object',
      properties: {
        emails: {
          type: 'array',
          items: {
            type: 'string'
          },
          description: 'Array of email addresses to delete'
        },
        confirm_delete: {
          type: 'boolean',
          description: 'Must be true to confirm permanent deletion'
        }
      },
      required: ['emails', 'confirm_delete']
    }
  },
  {
    name: 'list_contacts',
    description: 'List all contacts in your SendGrid account',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'add_contact',
    description: 'Add a contact to your SendGrid marketing contacts',
    inputSchema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          description: 'Contact email address'
        },
        first_name: {
          type: 'string',
          description: 'Contact first name (optional)'
        },
        last_name: {
          type: 'string',
          description: 'Contact last name (optional)'
        },
        custom_fields: {
          type: 'object',
          description: 'Custom field values (optional)'
        }
      },
      required: ['email']
    }
  },
  {
    name: 'create_contact_list',
    description: 'Create a new contact list in SendGrid',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the contact list'
        }
      },
      required: ['name']
    }
  },
  {
    name: 'add_contacts_to_list',
    description: 'Add contacts to an existing SendGrid list',
    inputSchema: {
      type: 'object',
      properties: {
        list_id: {
          type: 'string',
          description: 'ID of the contact list'
        },
        emails: {
          type: 'array',
          items: {
            type: 'string'
          },
          description: 'Array of email addresses to add to the list'
        }
      },
      required: ['list_id', 'emails']
    }
  },
  {
    name: 'get_contacts_by_emails',
    description: 'Read-only: retrieve marketing contacts by email addresses',
    inputSchema: {
      type: 'object',
      properties: {
        emails: {
          type: 'array',
          items: { type: 'string' },
          description: 'Email addresses to retrieve'
        }
      },
      required: ['emails']
    }
  },
  {
    name: 'get_contact_by_id',
    description: 'Read-only: retrieve one marketing contact by contact ID',
    inputSchema: {
      type: 'object',
      properties: {
        contact_id: {
          type: 'string',
          description: 'SendGrid contact ID'
        }
      },
      required: ['contact_id']
    }
  },
  {
    name: 'get_total_contact_count',
    description: 'Read-only: retrieve total marketing contact count',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_contact_list',
    description: 'Read-only: retrieve one SendGrid contact list by ID',
    inputSchema: {
      type: 'object',
      properties: {
        list_id: {
          type: 'string',
          description: 'Contact list ID'
        }
      },
      required: ['list_id']
    }
  },
  {
    name: 'update_contact_list',
    description: 'Mutating: rename a SendGrid contact list',
    inputSchema: {
      type: 'object',
      properties: {
        list_id: {
          type: 'string',
          description: 'Contact list ID'
        },
        name: {
          type: 'string',
          description: 'New list name'
        }
      },
      required: ['list_id', 'name']
    }
  },
  {
    name: 'get_list_contact_count',
    description: 'Read-only: retrieve contact count for one SendGrid contact list',
    inputSchema: {
      type: 'object',
      properties: {
        list_id: {
          type: 'string',
          description: 'Contact list ID'
        }
      },
      required: ['list_id']
    }
  },
  {
    name: 'delete_list',
    description: 'Destructive: delete a contact list from SendGrid. Requires confirm_delete: true.',
    inputSchema: {
      type: 'object',
      properties: {
        list_id: {
          type: 'string',
          description: 'ID of the contact list to delete'
        },
        confirm_delete: {
          type: 'boolean',
          description: 'Must be true to confirm deletion'
        }
      },
      required: ['list_id', 'confirm_delete']
    }
  },
  {
    name: 'list_contact_lists',
    description: 'List all contact lists in your SendGrid account',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_contacts_by_list',
    description: 'Get all contacts in a SendGrid list',
    inputSchema: {
      type: 'object',
      properties: {
        list_id: {
          type: 'string',
          description: 'ID of the contact list'
        }
      },
      required: ['list_id']
    }
  },
  {
    name: 'remove_contacts_from_list',
    description: 'Remove contacts from a SendGrid list without deleting them',
    inputSchema: {
      type: 'object',
      properties: {
        list_id: {
          type: 'string',
          description: 'ID of the contact list'
        },
        emails: {
          type: 'array',
          items: {
            type: 'string'
          },
          description: 'Array of email addresses to remove from the list'
        }
      },
      required: ['list_id', 'emails']
    }
  }
];
