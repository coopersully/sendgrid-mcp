import { ToolDefinition } from '../types.js';

export const templatesToolDefinitions: ToolDefinition[] = [
  {
    name: 'create_template',
    description: 'Create a new email template in SendGrid',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the template'
        },
        subject: {
          type: 'string',
          description: 'Default subject line for the template'
        },
        html_content: {
          type: 'string',
          description: 'HTML content of the template'
        },
        plain_content: {
          type: 'string',
          description: 'Plain text content of the template'
        }
      },
      required: ['name', 'subject', 'html_content', 'plain_content']
    }
  },
  {
    name: 'get_template',
    description: 'Retrieve a SendGrid template by ID',
    inputSchema: {
      type: 'object',
      properties: {
        template_id: {
          type: 'string',
          description: 'ID of the template to retrieve'
        }
      },
      required: ['template_id']
    }
  },
  {
    name: 'delete_template',
    description: 'Destructive: permanently delete a dynamic template from SendGrid. Requires confirm_delete: true.',
    inputSchema: {
      type: 'object',
      properties: {
        template_id: {
          type: 'string',
          description: 'ID of the template to delete'
        },
        confirm_delete: {
          type: 'boolean',
          description: 'Must be true to confirm permanent deletion'
        }
      },
      required: ['template_id', 'confirm_delete']
    }
  },
  {
    name: 'update_template_name',
    description: 'Mutating: rename a dynamic template without changing its versions or active content',
    inputSchema: {
      type: 'object',
      properties: {
        template_id: {
          type: 'string',
          description: 'ID of the template to rename'
        },
        name: {
          type: 'string',
          description: 'New template name'
        }
      },
      required: ['template_id', 'name']
    }
  },
  {
    name: 'duplicate_template',
    description: 'Mutating: copy a dynamic template into a new dynamic template using SendGrid native duplication',
    inputSchema: {
      type: 'object',
      properties: {
        template_id: {
          type: 'string',
          description: 'ID of the source dynamic template'
        },
        name: {
          type: 'string',
          description: 'Name for the copied template'
        }
      },
      required: ['template_id', 'name']
    }
  },
  {
    name: 'get_template_version',
    description:
      'Read-only: retrieve one dynamic template version including subject, HTML, plain text, and active state',
    inputSchema: {
      type: 'object',
      properties: {
        template_id: {
          type: 'string',
          description: 'ID of the dynamic template'
        },
        version_id: {
          type: 'string',
          description: 'ID of the template version'
        }
      },
      required: ['template_id', 'version_id']
    }
  },
  {
    name: 'create_template_version',
    description:
      'Mutating but safe-by-default: create a new dynamic template version from edited content. The new version is inactive unless active is set to 1.',
    inputSchema: {
      type: 'object',
      properties: {
        template_id: {
          type: 'string',
          description: 'ID of the dynamic template'
        },
        name: {
          type: 'string',
          description: 'Name for the new version'
        },
        subject: {
          type: 'string',
          description: 'Subject line for the new version'
        },
        html_content: {
          type: 'string',
          description: 'HTML content for the new version'
        },
        plain_content: {
          type: 'string',
          description: 'Plain text content for the new version'
        },
        active: {
          type: 'number',
          enum: [0, 1],
          description: 'Optional active flag. Defaults to 0 so edits do not immediately affect production sends.'
        }
      },
      required: ['template_id', 'name', 'subject', 'html_content', 'plain_content']
    }
  },
  {
    name: 'activate_template_version',
    description:
      'Mutating: activate an existing dynamic template version. This changes which version is used for future sends.',
    inputSchema: {
      type: 'object',
      properties: {
        template_id: {
          type: 'string',
          description: 'ID of the dynamic template'
        },
        version_id: {
          type: 'string',
          description: 'ID of the version to activate'
        }
      },
      required: ['template_id', 'version_id']
    }
  },
  {
    name: 'update_template_version',
    description:
      'Advanced mutating operation: directly patch an existing template version. Prefer create_template_version for safer edits.',
    inputSchema: {
      type: 'object',
      properties: {
        template_id: {
          type: 'string',
          description: 'ID of the dynamic template'
        },
        version_id: {
          type: 'string',
          description: 'ID of the version to patch'
        },
        name: {
          type: 'string',
          description: 'Updated version name'
        },
        subject: {
          type: 'string',
          description: 'Updated subject line'
        },
        html_content: {
          type: 'string',
          description: 'Updated HTML content'
        },
        plain_content: {
          type: 'string',
          description: 'Updated plain text content'
        },
        active: {
          type: 'number',
          enum: [0, 1],
          description: 'Updated active flag'
        }
      },
      required: ['template_id', 'version_id']
    }
  },
  {
    name: 'delete_template_version',
    description: 'Destructive: permanently delete a dynamic template version. Requires confirm_delete: true.',
    inputSchema: {
      type: 'object',
      properties: {
        template_id: {
          type: 'string',
          description: 'ID of the dynamic template'
        },
        version_id: {
          type: 'string',
          description: 'ID of the version to delete'
        },
        confirm_delete: {
          type: 'boolean',
          description: 'Must be true to confirm permanent deletion'
        }
      },
      required: ['template_id', 'version_id', 'confirm_delete']
    }
  },
  {
    name: 'list_templates',
    description: 'List all email templates in your SendGrid account',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  }
];
