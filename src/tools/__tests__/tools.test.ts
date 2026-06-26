import { describe, expect, it, vi } from 'vitest';
import { requireAtLeastOneArgument, requireNonEmptyObject } from '../utils.js';
import { getToolDefinitions, handleToolCall } from '../index.js';

const makeService = (overrides: Record<string, any> = {}) => overrides as any;

const parseText = (result: any) => JSON.parse(result.content[0].text);

const makeFullService = () => {
  const defaults: Record<string, any> = {
    listAllContacts: vi.fn().mockResolvedValue([{ email: 'a@example.com' }]),
    createList: vi.fn().mockResolvedValue({ id: 'list-1' }),
    createTemplate: vi.fn().mockResolvedValue({ id: 'template-1' }),
    listTemplates: vi
      .fn()
      .mockResolvedValue([
        { id: 'template-1', name: 'Template', generation: 'dynamic', updated_at: '2026-01-01', versions: [] }
      ]),
    listContactLists: vi.fn().mockResolvedValue([{ id: 'list-1', name: 'List', contact_count: 1 }]),
    getContactsByList: vi.fn().mockResolvedValue([{ email: 'a@example.com' }]),
    createSingleSend: vi.fn().mockResolvedValue({ id: 'single-1' }),
    getSingleSend: vi
      .fn()
      .mockResolvedValue({ id: 'single-1', name: 'Single', status: 'draft', send_to: { list_ids: ['list-1'] } }),
    listSingleSends: vi.fn().mockResolvedValue([{ id: 'single-1', name: 'Single', status: 'draft' }])
  };

  return new Proxy(defaults, {
    get(target, property) {
      const key = String(property);
      target[key] ??= vi.fn().mockResolvedValue({});
      return target[key];
    }
  }) as any;
};

const sampleArgsByTool: Record<string, Record<string, any>> = {
  delete_contacts: { emails: ['a@example.com'], confirm_delete: true },
  list_contacts: {},
  send_email: { to: 'to@example.com', from: 'from@example.com', subject: 'Hi', text: 'Hello' },
  add_contact: { email: 'a@example.com' },
  create_contact_list: { name: 'List' },
  add_contacts_to_list: { list_id: 'list-1', emails: ['a@example.com'] },
  create_template: { name: 'Template', subject: 'Hi', html_content: '<p>Hi</p>', plain_content: 'Hi' },
  get_template: { template_id: 'template-1' },
  delete_template: { template_id: 'template-1', confirm_delete: true },
  update_template_name: { template_id: 'template-1', name: 'Renamed' },
  duplicate_template: { template_id: 'template-1', name: 'Copy' },
  get_template_version: { template_id: 'template-1', version_id: 'version-1' },
  create_template_version: {
    template_id: 'template-1',
    name: 'Draft',
    subject: 'Hi',
    html_content: '<p>Hi</p>',
    plain_content: 'Hi'
  },
  activate_template_version: { template_id: 'template-1', version_id: 'version-1' },
  update_template_version: { template_id: 'template-1', version_id: 'version-1', subject: 'Updated' },
  delete_template_version: { template_id: 'template-1', version_id: 'version-1', confirm_delete: true },
  list_designs: {},
  get_design: { design_id: 'design-1' },
  create_design: { name: 'Design' },
  update_design: { design_id: 'design-1', subject: 'Updated' },
  duplicate_design: { design_id: 'design-1' },
  delete_design: { design_id: 'design-1', confirm_delete: true },
  list_pre_built_designs: {},
  get_pre_built_design: { design_id: 'prebuilt-1' },
  duplicate_pre_built_design: { design_id: 'prebuilt-1' },
  get_contacts_by_emails: { emails: ['a@example.com'] },
  get_contact_by_id: { contact_id: 'contact-1' },
  get_total_contact_count: {},
  get_contact_list: { list_id: 'list-1' },
  update_contact_list: { list_id: 'list-1', name: 'Renamed' },
  get_list_contact_count: { list_id: 'list-1' },
  list_custom_fields: {},
  create_custom_field: { name: 'Plan', field_type: 'Text' },
  update_custom_field: { field_id: 'field-1', name: 'Plan' },
  delete_custom_field: { field_id: 'field-1', confirm_delete: true },
  list_segments: {},
  create_segment: { name: 'Segment', query_dsl: 'email LIKE "%@example.com"' },
  get_segment: { segment_id: 'segment-1' },
  update_segment: { segment_id: 'segment-1', name: 'Renamed' },
  refresh_segment: { segment_id: 'segment-1' },
  delete_segment: { segment_id: 'segment-1', confirm_delete: true },
  validate_email: { email: 'a@example.com' },
  get_stats: { start_date: '2026-06-01' },
  list_templates: {},
  delete_list: { list_id: 'list-1', confirm_delete: true },
  list_contact_lists: {},
  get_contacts_by_list: { list_id: 'list-1' },
  list_verified_senders: {},
  list_suppression_groups: {},
  list_group_suppressions: { group_id: 1 },
  add_group_suppressions: { group_id: 1, emails: ['a@example.com'] },
  delete_group_suppression: { group_id: 1, email: 'a@example.com', confirm_delete: true },
  list_global_suppressions: {},
  add_global_suppressions: { emails: ['a@example.com'] },
  delete_global_suppression: { email: 'a@example.com', confirm_delete: true },
  list_bounces: {},
  list_blocks: {},
  list_invalid_emails: {},
  list_spam_reports: {},
  list_marketing_senders: {},
  get_marketing_sender: { sender_id: 1 },
  create_marketing_sender: { sender: { nickname: 'Support' } },
  update_marketing_sender: { sender_id: 1, sender: { nickname: 'Support' } },
  delete_marketing_sender: { sender_id: 1, confirm_delete: true },
  resend_marketing_sender_verification: { sender_id: 1 },
  send_to_list: {
    name: 'Send',
    list_ids: ['list-1'],
    subject: 'Hi',
    html_content: '<p>Hi</p>',
    plain_content: 'Hi',
    sender_id: 1,
    suppression_group_id: 1
  },
  create_single_send: { single_send: { name: 'Draft' } },
  update_single_send: { single_send_id: 'single-1', single_send: { name: 'Updated' } },
  delete_single_send: { single_send_id: 'single-1', confirm_delete: true },
  duplicate_single_send: { single_send_id: 'single-1' },
  search_single_sends: { query: 'status="draft"' },
  schedule_single_send: { single_send_id: 'single-1', send_at: 'now' },
  get_single_send_schedule: { single_send_id: 'single-1' },
  cancel_single_send_schedule: { single_send_id: 'single-1' },
  list_single_send_categories: {},
  list_single_send_stats: {},
  get_single_send_stats: { single_send_id: 'single-1' },
  get_single_send: { single_send_id: 'single-1' },
  list_single_sends: {},
  remove_contacts_from_list: { list_id: 'list-1', emails: ['a@example.com'] }
};

describe('tools', () => {
  it('declares closed input schemas for every tool', () => {
    const tools = getToolDefinitions(makeService());

    expect(tools.length).toBeGreaterThan(0);
    for (const tool of tools) {
      expect((tool.inputSchema as any).additionalProperties).toBe(false);
    }
  });

  it('rejects missing required arguments before calling SendGrid', async () => {
    const service = makeService({ getDesign: vi.fn() });

    await expect(handleToolCall(service, 'get_design', {})).rejects.toThrow('Missing required argument: design_id');
    expect(service.getDesign).not.toHaveBeenCalled();
  });

  it('rejects unexpected arguments before calling SendGrid', async () => {
    const service = makeService({ listDesigns: vi.fn() });

    await expect(handleToolCall(service, 'list_designs', { unexpected: true })).rejects.toThrow(
      'Unexpected argument: unexpected'
    );
    expect(service.listDesigns).not.toHaveBeenCalled();
  });

  it('requires destructive confirmation for deletes before calling SendGrid', async () => {
    const service = makeService({
      deleteContactsByEmails: vi.fn(),
      deleteDesign: vi.fn(),
      deleteList: vi.fn()
    });

    await expect(handleToolCall(service, 'delete_contacts', { emails: ['a@example.com'] })).rejects.toThrow(
      'confirm_delete'
    );
    await expect(handleToolCall(service, 'delete_design', { design_id: 'design-1' })).rejects.toThrow('confirm_delete');
    await expect(handleToolCall(service, 'delete_list', { list_id: 'list-1' })).rejects.toThrow('confirm_delete');
    expect(service.deleteContactsByEmails).not.toHaveBeenCalled();
    expect(service.deleteDesign).not.toHaveBeenCalled();
    expect(service.deleteList).not.toHaveBeenCalled();
  });

  it('rejects invalid argument types before calling SendGrid', async () => {
    const service = makeService({
      sendEmail: vi.fn(),
      createTemplateVersion: vi.fn(),
      addContactsToList: vi.fn(),
      createMarketingSender: vi.fn()
    });

    await expect(handleToolCall(service, 'send_email', [])).rejects.toThrow('Tool arguments must be an object');
    await expect(
      handleToolCall(service, 'send_email', {
        to: 'to@example.com',
        from: 'from@example.com',
        subject: 'Hi',
        text: ''
      })
    ).rejects.toThrow('expected non-empty string');
    await expect(
      handleToolCall(service, 'create_template_version', {
        template_id: 'template-1',
        name: 'Draft',
        subject: 'Hi',
        html_content: '<p>Hi</p>',
        plain_content: 'Hi',
        active: 2
      })
    ).rejects.toThrow('Expected one of');
    await expect(
      handleToolCall(service, 'add_contacts_to_list', { list_id: 'list-1', emails: 'nope' })
    ).rejects.toThrow('expected array');
    await expect(handleToolCall(service, 'add_contacts_to_list', { list_id: 'list-1', emails: [] })).rejects.toThrow(
      'expected at least one item'
    );
    await expect(handleToolCall(service, 'add_contacts_to_list', { list_id: 'list-1', emails: [1] })).rejects.toThrow(
      'emails[0]'
    );
    await expect(handleToolCall(service, 'create_marketing_sender', { sender: [] })).rejects.toThrow('expected object');

    expect(service.sendEmail).not.toHaveBeenCalled();
    expect(service.createTemplateVersion).not.toHaveBeenCalled();
    expect(service.addContactsToList).not.toHaveBeenCalled();
    expect(service.createMarketingSender).not.toHaveBeenCalled();
  });

  it('enforces local cross-field rules before calling SendGrid', async () => {
    const service = makeService({ createSingleSend: vi.fn() });
    const baseArgs = {
      name: 'Send',
      subject: 'Hi',
      html_content: '<p>Hi</p>',
      plain_content: 'Hi',
      sender_id: 1,
      suppression_group_id: 1
    };

    await expect(handleToolCall(service, 'send_to_list', baseArgs)).rejects.toThrow(
      'Either list_ids or segment_ids must be provided'
    );
    await expect(
      handleToolCall(service, 'send_to_list', {
        name: baseArgs.name,
        subject: baseArgs.subject,
        html_content: baseArgs.html_content,
        plain_content: baseArgs.plain_content,
        sender_id: baseArgs.sender_id,
        list_ids: ['list-1']
      })
    ).rejects.toThrow('Either suppression_group_id or custom_unsubscribe_url must be provided');

    expect(service.createSingleSend).not.toHaveBeenCalled();
  });

  it('keeps shared guard helpers strict', () => {
    expect(() => requireAtLeastOneArgument({}, ['name'], 'update_design')).toThrow(
      'requires at least one editable field'
    );
    expect(() => requireNonEmptyObject({}, 'create_single_send')).toThrow('requires at least one field');
    expect(() => requireAtLeastOneArgument({ name: 'Updated' }, ['name'], 'update_design')).not.toThrow();
    expect(() => requireNonEmptyObject({ name: 'Draft' }, 'create_single_send')).not.toThrow();
  });

  it('returns design list pagination metadata to the MCP caller', async () => {
    const service = makeService({
      listDesigns: (vi.fn() as any).mockResolvedValue({
        result: [{ id: 'design-1', name: 'Welcome' }],
        _metadata: { next: 'next-page' }
      })
    });

    const result = await handleToolCall(service, 'list_designs', { page_size: 10 });

    expect(service.listDesigns).toHaveBeenCalledWith({ page_size: 10 });
    expect(parseText(result)).toEqual({
      result: [{ id: 'design-1', name: 'Welcome' }],
      _metadata: { next: 'next-page' }
    });
  });

  it('handles every advertised tool with valid arguments', async () => {
    const service = makeFullService();
    const tools = getToolDefinitions(service);

    for (const tool of tools) {
      expect(sampleArgsByTool[tool.name], `${tool.name} is missing sample arguments`).toBeDefined();
      const result = await handleToolCall(service, tool.name, sampleArgsByTool[tool.name]);
      expect(result.content[0].type).toBe('text');
    }
  });
});
