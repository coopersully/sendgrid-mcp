import { SendGridService } from '../../services/sendgrid.js';
import { SendGridListResponse, SendGridSingleSend } from '../../types/index.js';
import { ToolHandler } from '../types.js';
import { compactObject, requireDestructiveConfirmation, requireNonEmptyObject } from '../utils.js';

export const sendingToolHandlers: Record<string, ToolHandler> = {
  send_email: async (service: SendGridService, args: Record<string, any>) => {
    await service.sendEmail(args as any);
    return { content: [{ type: 'text', text: `Email sent successfully to ${args.to}` }] };
  },
  send_to_list: async (service: SendGridService, args: Record<string, any>) => {
    if (!args.list_ids && !args.segment_ids) {
      throw new Error('Either list_ids or segment_ids must be provided');
    }

    if (!args.suppression_group_id && !args.custom_unsubscribe_url) {
      throw new Error('Either suppression_group_id or custom_unsubscribe_url must be provided');
    }

    const newSingleSend = await service.createSingleSend({
      name: args.name,
      send_to: compactObject({
        list_ids: args.list_ids,
        segment_ids: args.segment_ids
      }),
      email_config: {
        subject: args.subject,
        html_content: args.html_content,
        plain_content: args.plain_content,
        sender_id: args.sender_id,
        suppression_group_id: args.suppression_group_id,
        custom_unsubscribe_url: args.custom_unsubscribe_url
      }
    });

    await service.scheduleSingleSend(newSingleSend.id, 'now');

    return {
      content: [
        {
          type: 'text',
          text: `Email "${args.name}" has been sent to the specified lists`
        }
      ]
    };
  },
  create_single_send: async (service: SendGridService, args: Record<string, any>) => {
    requireNonEmptyObject(args.single_send, 'create_single_send');
    const createdSingleSend = await service.createSingleSend(args.single_send);
    return { content: [{ type: 'text', text: JSON.stringify(createdSingleSend, null, 2) }] };
  },
  update_single_send: async (service: SendGridService, args: Record<string, any>) => {
    requireNonEmptyObject(args.single_send, 'update_single_send');
    const updatedSingleSend = await service.updateSingleSend(args.single_send_id, args.single_send);
    return { content: [{ type: 'text', text: JSON.stringify(updatedSingleSend, null, 2) }] };
  },
  delete_single_send: async (service: SendGridService, args: Record<string, any>) => {
    requireDestructiveConfirmation(args.confirm_delete, `Deleting single send ${args.single_send_id}`);
    await service.deleteSingleSend(args.single_send_id);
    return { content: [{ type: 'text', text: `Single Send ${args.single_send_id} deleted successfully` }] };
  },
  duplicate_single_send: async (service: SendGridService, args: Record<string, any>) => {
    const duplicatedSingleSend = await service.duplicateSingleSend(args.single_send_id, args.name);
    return { content: [{ type: 'text', text: JSON.stringify(duplicatedSingleSend, null, 2) }] };
  },
  search_single_sends: async (service: SendGridService, args: Record<string, any>) => {
    const searchedSingleSends = await service.searchSingleSends({
      query: args.query,
      page_size: args.page_size,
      page_token: args.page_token
    });
    return { content: [{ type: 'text', text: JSON.stringify(searchedSingleSends, null, 2) }] };
  },
  schedule_single_send: async (service: SendGridService, args: Record<string, any>) => {
    const scheduledSingleSend = await service.scheduleSingleSend(args.single_send_id, args.send_at);
    return { content: [{ type: 'text', text: JSON.stringify(scheduledSingleSend, null, 2) }] };
  },
  get_single_send_schedule: async (service: SendGridService, args: Record<string, any>) => {
    const singleSendSchedule = await service.getSingleSendSchedule(args.single_send_id);
    return { content: [{ type: 'text', text: JSON.stringify(singleSendSchedule, null, 2) }] };
  },
  cancel_single_send_schedule: async (service: SendGridService, args: Record<string, any>) => {
    await service.cancelSingleSendSchedule(args.single_send_id);
    return { content: [{ type: 'text', text: `Schedule canceled for Single Send ${args.single_send_id}` }] };
  },
  list_single_send_categories: async (service: SendGridService, _args: Record<string, any>) => {
    const singleSendCategories = await service.listSingleSendCategories();
    return { content: [{ type: 'text', text: JSON.stringify(singleSendCategories, null, 2) }] };
  },
  list_single_send_stats: async (service: SendGridService, args: Record<string, any>) => {
    const singleSendStats = await service.listSingleSendStats(
      compactObject({
        start_date: args.start_date,
        end_date: args.end_date,
        aggregated_by: args.aggregated_by
      })
    );
    return { content: [{ type: 'text', text: JSON.stringify(singleSendStats, null, 2) }] };
  },
  get_single_send_stats: async (service: SendGridService, args: Record<string, any>) => {
    const retrievedSingleSendStats = await service.getSingleSendStats(
      args.single_send_id,
      compactObject({
        start_date: args.start_date,
        end_date: args.end_date,
        aggregated_by: args.aggregated_by
      })
    );
    return { content: [{ type: 'text', text: JSON.stringify(retrievedSingleSendStats, null, 2) }] };
  },
  get_single_send: async (service: SendGridService, args: Record<string, any>) => {
    const retrievedSingleSend = await service.getSingleSend(args.single_send_id);
    if (args.include_details === true) {
      return { content: [{ type: 'text', text: JSON.stringify(retrievedSingleSend, null, 2) }] };
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              id: retrievedSingleSend.id,
              name: retrievedSingleSend.name,
              status: retrievedSingleSend.status,
              send_at: retrievedSingleSend.send_at,
              list_ids: retrievedSingleSend.send_to?.list_ids,
              segment_ids: retrievedSingleSend.send_to?.segment_ids
            },
            null,
            2
          )
        }
      ]
    };
  },
  list_single_sends: async (service: SendGridService, args: Record<string, any>) => {
    const response = await service.listSingleSends(
      compactObject({
        page_size: args.page_size,
        page_token: args.page_token
      })
    );
    const allSingleSends = Array.isArray(response) ? response : response.result || [];
    const payload = {
      result: allSingleSends.map((s: SendGridSingleSend) => ({
        id: s.id,
        name: s.name,
        status: s.status,
        send_at: s.send_at
      })),
      ...(!Array.isArray(response) && response._metadata ? { _metadata: response._metadata } : {})
    } satisfies SendGridListResponse<Pick<SendGridSingleSend, 'id' | 'name' | 'status' | 'send_at'>>;

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(payload, null, 2)
        }
      ]
    };
  }
};
