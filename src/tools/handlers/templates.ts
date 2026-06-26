import { SendGridService } from '../../services/sendgrid.js';
import { ToolHandler } from '../types.js';
import { requireAtLeastOneArgument, requireDestructiveConfirmation } from '../utils.js';

export const templatesToolHandlers: Record<string, ToolHandler> = {
  create_template: async (service: SendGridService, args: Record<string, any>) => {
    const template = await service.createTemplate(args as any);
    return { content: [{ type: 'text', text: `Template "${args.name}" created with ID: ${template.id}` }] };
  },
  get_template: async (service: SendGridService, args: Record<string, any>) => {
    const retrievedTemplate = await service.getTemplate(args.template_id);
    return { content: [{ type: 'text', text: JSON.stringify(retrievedTemplate, null, 2) }] };
  },
  delete_template: async (service: SendGridService, args: Record<string, any>) => {
    requireDestructiveConfirmation(args.confirm_delete, `Deleting template ${args.template_id}`);
    await service.deleteTemplate(args.template_id);
    return { content: [{ type: 'text', text: `Template ${args.template_id} deleted successfully` }] };
  },
  update_template_name: async (service: SendGridService, args: Record<string, any>) => {
    const renamedTemplate = await service.updateTemplateName(args.template_id, args.name);
    return { content: [{ type: 'text', text: JSON.stringify(renamedTemplate, null, 2) }] };
  },
  duplicate_template: async (service: SendGridService, args: Record<string, any>) => {
    const copiedTemplate = await service.duplicateTemplate(args.template_id, args.name);
    return { content: [{ type: 'text', text: JSON.stringify(copiedTemplate, null, 2) }] };
  },
  get_template_version: async (service: SendGridService, args: Record<string, any>) => {
    const templateVersion = await service.getTemplateVersion(args.template_id, args.version_id);
    return { content: [{ type: 'text', text: JSON.stringify(templateVersion, null, 2) }] };
  },
  create_template_version: async (service: SendGridService, args: Record<string, any>) => {
    const createdVersion = await service.createTemplateVersion(args.template_id, {
      name: args.name,
      subject: args.subject,
      html_content: args.html_content,
      plain_content: args.plain_content,
      active: args.active
    });
    return { content: [{ type: 'text', text: JSON.stringify(createdVersion, null, 2) }] };
  },
  activate_template_version: async (service: SendGridService, args: Record<string, any>) => {
    const activatedVersion = await service.activateTemplateVersion(args.template_id, args.version_id);
    return { content: [{ type: 'text', text: JSON.stringify(activatedVersion, null, 2) }] };
  },
  update_template_version: async (service: SendGridService, args: Record<string, any>) => {
    requireAtLeastOneArgument(
      args,
      ['name', 'subject', 'html_content', 'plain_content', 'active'],
      'update_template_version'
    );
    const patchedVersion = await service.updateTemplateVersion(args.template_id, args.version_id, {
      name: args.name,
      subject: args.subject,
      html_content: args.html_content,
      plain_content: args.plain_content,
      active: args.active
    });
    return { content: [{ type: 'text', text: JSON.stringify(patchedVersion, null, 2) }] };
  },
  delete_template_version: async (service: SendGridService, args: Record<string, any>) => {
    requireDestructiveConfirmation(args.confirm_delete, `Deleting template version ${args.version_id}`);
    await service.deleteTemplateVersion(args.template_id, args.version_id);
    return { content: [{ type: 'text', text: `Template version ${args.version_id} deleted successfully` }] };
  },
  list_templates: async (service: SendGridService, _args: Record<string, any>) => {
    const templates = await service.listTemplates();
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            templates.map((t) => ({
              id: t.id,
              name: t.name,
              generation: t.generation,
              updated_at: t.updated_at,
              versions: t.versions.length
            })),
            null,
            2
          )
        }
      ]
    };
  }
};
