import { SendGridService } from '../../services/sendgrid.js';
import { ToolHandler } from '../types.js';
import {
  compactObject,
  requireAtLeastOneArgument,
  requireDestructiveConfirmation,
  requireNonEmptyObject
} from '../utils.js';

export const marketingToolHandlers: Record<string, ToolHandler> = {
  list_custom_fields: async (service: SendGridService, _args: Record<string, any>) => {
    const customFields = await service.listCustomFields();
    return { content: [{ type: 'text', text: JSON.stringify(customFields, null, 2) }] };
  },
  create_custom_field: async (service: SendGridService, args: Record<string, any>) => {
    const createdCustomField = await service.createCustomField({
      name: args.name,
      field_type: args.field_type
    });
    return { content: [{ type: 'text', text: JSON.stringify(createdCustomField, null, 2) }] };
  },
  update_custom_field: async (service: SendGridService, args: Record<string, any>) => {
    const updatedCustomField = await service.updateCustomField(args.field_id, {
      name: args.name
    });
    return { content: [{ type: 'text', text: JSON.stringify(updatedCustomField, null, 2) }] };
  },
  delete_custom_field: async (service: SendGridService, args: Record<string, any>) => {
    requireDestructiveConfirmation(args.confirm_delete, `Deleting custom field ${args.field_id}`);
    await service.deleteCustomField(args.field_id);
    return { content: [{ type: 'text', text: `Custom field ${args.field_id} deleted successfully` }] };
  },
  list_segments: async (service: SendGridService, args: Record<string, any>) => {
    const segments = await service.listSegments(
      compactObject({
        ids: args.ids?.join(','),
        parent_list_ids: args.parent_list_ids?.join(','),
        no_parent_list_id: args.no_parent_list_id
      })
    );
    return { content: [{ type: 'text', text: JSON.stringify(segments, null, 2) }] };
  },
  create_segment: async (service: SendGridService, args: Record<string, any>) => {
    const createdSegment = await service.createSegment({
      name: args.name,
      query_dsl: args.query_dsl
    });
    return { content: [{ type: 'text', text: JSON.stringify(createdSegment, null, 2) }] };
  },
  get_segment: async (service: SendGridService, args: Record<string, any>) => {
    const segment = await service.getSegment(args.segment_id);
    return { content: [{ type: 'text', text: JSON.stringify(segment, null, 2) }] };
  },
  update_segment: async (service: SendGridService, args: Record<string, any>) => {
    requireAtLeastOneArgument(args, ['name', 'query_dsl'], 'update_segment');
    const updatedSegment = await service.updateSegment(args.segment_id, {
      name: args.name,
      query_dsl: args.query_dsl
    });
    return { content: [{ type: 'text', text: JSON.stringify(updatedSegment, null, 2) }] };
  },
  refresh_segment: async (service: SendGridService, args: Record<string, any>) => {
    const refreshedSegment = await service.refreshSegment(args.segment_id);
    return { content: [{ type: 'text', text: JSON.stringify(refreshedSegment, null, 2) }] };
  },
  delete_segment: async (service: SendGridService, args: Record<string, any>) => {
    requireDestructiveConfirmation(args.confirm_delete, `Deleting segment ${args.segment_id}`);
    await service.deleteSegment(args.segment_id);
    return { content: [{ type: 'text', text: `Segment ${args.segment_id} deleted successfully` }] };
  },
  list_verified_senders: async (service: SendGridService, _args: Record<string, any>) => {
    const senders = await service.getVerifiedSenders();
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(senders, null, 2)
        }
      ]
    };
  },
  list_marketing_senders: async (service: SendGridService, _args: Record<string, any>) => {
    const marketingSenders = await service.listMarketingSenders();
    return { content: [{ type: 'text', text: JSON.stringify(marketingSenders, null, 2) }] };
  },
  get_marketing_sender: async (service: SendGridService, args: Record<string, any>) => {
    const marketingSender = await service.getMarketingSender(args.sender_id);
    return { content: [{ type: 'text', text: JSON.stringify(marketingSender, null, 2) }] };
  },
  create_marketing_sender: async (service: SendGridService, args: Record<string, any>) => {
    requireNonEmptyObject(args.sender, 'create_marketing_sender');
    const createdMarketingSender = await service.createMarketingSender(args.sender);
    return { content: [{ type: 'text', text: JSON.stringify(createdMarketingSender, null, 2) }] };
  },
  update_marketing_sender: async (service: SendGridService, args: Record<string, any>) => {
    requireNonEmptyObject(args.sender, 'update_marketing_sender');
    const updatedMarketingSender = await service.updateMarketingSender(args.sender_id, args.sender);
    return { content: [{ type: 'text', text: JSON.stringify(updatedMarketingSender, null, 2) }] };
  },
  delete_marketing_sender: async (service: SendGridService, args: Record<string, any>) => {
    requireDestructiveConfirmation(args.confirm_delete, `Deleting marketing sender ${args.sender_id}`);
    await service.deleteMarketingSender(args.sender_id);
    return { content: [{ type: 'text', text: `Marketing sender ${args.sender_id} deleted successfully` }] };
  },
  resend_marketing_sender_verification: async (service: SendGridService, args: Record<string, any>) => {
    const resentMarketingSenderVerification = await service.resendMarketingSenderVerification(args.sender_id);
    return { content: [{ type: 'text', text: JSON.stringify(resentMarketingSenderVerification, null, 2) }] };
  }
};
