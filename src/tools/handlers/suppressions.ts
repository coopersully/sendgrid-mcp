import { SendGridService } from '../../services/sendgrid.js';
import { ToolHandler } from '../types.js';
import { compactObject, redactEmailFields, requireDestructiveConfirmation } from '../utils.js';

const suppressionListParams = (args: Record<string, any>) =>
  compactObject({
    start_time: args.start_time,
    end_time: args.end_time,
    limit: args.limit ?? 50,
    offset: args.offset,
    email: args.email
  });

const suppressionListResponse = (items: unknown, args: Record<string, any>) => {
  const includeEmails = args.include_emails === true;
  const result = Array.isArray(items) ? items : [];
  return {
    result: redactEmailFields(result, includeEmails),
    _metadata: compactObject({
      limit: args.limit ?? 50,
      offset: args.offset,
      emails_redacted: !includeEmails
    })
  };
};

export const suppressionsToolHandlers: Record<string, ToolHandler> = {
  list_suppression_groups: async (service: SendGridService, _args: Record<string, any>) => {
    const groups = await service.getSuppressionGroups();
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(groups, null, 2)
        }
      ]
    };
  },
  list_group_suppressions: async (service: SendGridService, args: Record<string, any>) => {
    const groupSuppressions = await service.listGroupSuppressions(
      args.group_id,
      compactObject({
        start_time: args.start_time,
        end_time: args.end_time
      })
    );
    return { content: [{ type: 'text', text: JSON.stringify(groupSuppressions, null, 2) }] };
  },
  add_group_suppressions: async (service: SendGridService, args: Record<string, any>) => {
    const addedGroupSuppressions = await service.addGroupSuppressions(args.group_id, args.emails);
    return { content: [{ type: 'text', text: JSON.stringify(addedGroupSuppressions, null, 2) }] };
  },
  delete_group_suppression: async (service: SendGridService, args: Record<string, any>) => {
    requireDestructiveConfirmation(
      args.confirm_delete,
      `Removing ${args.email} from suppression group ${args.group_id}`
    );
    await service.deleteGroupSuppression(args.group_id, args.email);
    return { content: [{ type: 'text', text: `Removed ${args.email} from suppression group ${args.group_id}` }] };
  },
  list_global_suppressions: async (service: SendGridService, args: Record<string, any>) => {
    const globalSuppressions = await service.listGlobalSuppressions(
      compactObject({
        start_time: args.start_time,
        end_time: args.end_time
      })
    );
    return { content: [{ type: 'text', text: JSON.stringify(globalSuppressions, null, 2) }] };
  },
  add_global_suppressions: async (service: SendGridService, args: Record<string, any>) => {
    const addedGlobalSuppressions = await service.addGlobalSuppressions(args.emails);
    return { content: [{ type: 'text', text: JSON.stringify(addedGlobalSuppressions, null, 2) }] };
  },
  delete_global_suppression: async (service: SendGridService, args: Record<string, any>) => {
    requireDestructiveConfirmation(args.confirm_delete, `Removing ${args.email} from global suppressions`);
    await service.deleteGlobalSuppression(args.email);
    return { content: [{ type: 'text', text: `Removed ${args.email} from global suppressions` }] };
  },
  list_bounces: async (service: SendGridService, args: Record<string, any>) => {
    const bounces = await service.listBounces(suppressionListParams(args));
    return { content: [{ type: 'text', text: JSON.stringify(suppressionListResponse(bounces, args), null, 2) }] };
  },
  list_blocks: async (service: SendGridService, args: Record<string, any>) => {
    const blocks = await service.listBlocks(suppressionListParams(args));
    return { content: [{ type: 'text', text: JSON.stringify(suppressionListResponse(blocks, args), null, 2) }] };
  },
  list_invalid_emails: async (service: SendGridService, args: Record<string, any>) => {
    const invalidEmails = await service.listInvalidEmails(suppressionListParams(args));
    return { content: [{ type: 'text', text: JSON.stringify(suppressionListResponse(invalidEmails, args), null, 2) }] };
  },
  list_spam_reports: async (service: SendGridService, args: Record<string, any>) => {
    const spamReports = await service.listSpamReports(suppressionListParams(args));
    return { content: [{ type: 'text', text: JSON.stringify(suppressionListResponse(spamReports, args), null, 2) }] };
  }
};
