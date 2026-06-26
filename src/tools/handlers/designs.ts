import { SendGridService } from '../../services/sendgrid.js';
import { SendGridDesignInput } from '../../types/index.js';
import { ToolHandler } from '../types.js';
import { compactObject, requireAtLeastOneArgument, requireDestructiveConfirmation } from '../utils.js';

export const designsToolHandlers: Record<string, ToolHandler> = {
  list_designs: async (service: SendGridService, args: Record<string, any>) => {
    const designs = await service.listDesigns(
      compactObject({
        page_size: args.page_size,
        page_token: args.page_token,
        summary: args.summary
      })
    );
    return { content: [{ type: 'text', text: JSON.stringify(designs, null, 2) }] };
  },
  get_design: async (service: SendGridService, args: Record<string, any>) => {
    const design = await service.getDesign(args.design_id);
    return { content: [{ type: 'text', text: JSON.stringify(design, null, 2) }] };
  },
  create_design: async (service: SendGridService, args: Record<string, any>) => {
    const createDesignPayload: SendGridDesignInput = {
      name: args.name,
      ...compactObject({
        subject: args.subject,
        html_content: args.html_content,
        plain_content: args.plain_content,
        generate_plain_content: args.generate_plain_content,
        editor: args.editor,
        categories: args.categories
      })
    };
    const createdDesign = await service.createDesign(createDesignPayload);
    return { content: [{ type: 'text', text: JSON.stringify(createdDesign, null, 2) }] };
  },
  update_design: async (service: SendGridService, args: Record<string, any>) => {
    requireAtLeastOneArgument(
      args,
      ['name', 'subject', 'html_content', 'plain_content', 'generate_plain_content', 'editor', 'categories'],
      'update_design'
    );
    const updatedDesign = await service.updateDesign(
      args.design_id,
      compactObject({
        name: args.name,
        subject: args.subject,
        html_content: args.html_content,
        plain_content: args.plain_content,
        generate_plain_content: args.generate_plain_content,
        editor: args.editor,
        categories: args.categories
      })
    );
    return { content: [{ type: 'text', text: JSON.stringify(updatedDesign, null, 2) }] };
  },
  duplicate_design: async (service: SendGridService, args: Record<string, any>) => {
    const duplicatedDesign = await service.duplicateDesign(args.design_id, args.name);
    return { content: [{ type: 'text', text: JSON.stringify(duplicatedDesign, null, 2) }] };
  },
  delete_design: async (service: SendGridService, args: Record<string, any>) => {
    requireDestructiveConfirmation(args.confirm_delete, `Deleting design ${args.design_id}`);
    await service.deleteDesign(args.design_id);
    return { content: [{ type: 'text', text: `Design ${args.design_id} deleted successfully` }] };
  },
  list_pre_built_designs: async (service: SendGridService, args: Record<string, any>) => {
    const preBuiltDesigns = await service.listPreBuiltDesigns(
      compactObject({
        page_size: args.page_size,
        page_token: args.page_token,
        summary: args.summary
      })
    );
    return { content: [{ type: 'text', text: JSON.stringify(preBuiltDesigns, null, 2) }] };
  },
  get_pre_built_design: async (service: SendGridService, args: Record<string, any>) => {
    const preBuiltDesign = await service.getPreBuiltDesign(args.design_id);
    return { content: [{ type: 'text', text: JSON.stringify(preBuiltDesign, null, 2) }] };
  },
  duplicate_pre_built_design: async (service: SendGridService, args: Record<string, any>) => {
    const duplicatedPreBuiltDesign = await service.duplicatePreBuiltDesign(args.design_id, args.name);
    return { content: [{ type: 'text', text: JSON.stringify(duplicatedPreBuiltDesign, null, 2) }] };
  }
};
