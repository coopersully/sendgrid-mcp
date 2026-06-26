import sgMail from '@sendgrid/mail';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SendGridService } from '../sendgrid.js';

type RequestCall = {
  method: string;
  url: string;
  body?: unknown;
  qs?: unknown;
};

describe('SendGridService request coverage', () => {
  let service: SendGridService;
  let request: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    service = new SendGridService('SG.test-api-key');
    request = vi.fn();
    (service as unknown as { client: { request: typeof request } }).client = { request };
    vi.restoreAllMocks();
  });

  const resolveBodies = (...bodies: unknown[]) => {
    for (const body of bodies) {
      request.mockResolvedValueOnce([{ body }]);
    }
    request.mockResolvedValue([{ body: {} }]);
  };

  const expectRequest = (call: RequestCall) => {
    expect(request).toHaveBeenCalledWith(call);
  };

  it('sends direct email through SendGrid mail client', async () => {
    const send = vi.spyOn(sgMail, 'send').mockResolvedValueOnce([{}, {}]);
    const params = {
      to: 'to@example.com',
      from: 'from@example.com',
      subject: 'Hello',
      text: 'Plain'
    };

    await service.sendEmail(params);

    expect(send).toHaveBeenCalledWith(params);
  });

  it('covers contact and list operations', async () => {
    resolveBodies(
      { result: [] },
      { result: [{ id: 'contact-1', email: 'a@example.com' }] },
      {},
      { result: [{ email: 'a@example.com' }] },
      { result: { 'a@example.com': { email: 'a@example.com' } } },
      { id: 'contact-1', email: 'a@example.com' },
      { contact_count: 1 },
      { id: 'list-1', name: 'Customers', contact_count: 1 },
      { result: [{ id: 'list-1', name: 'Customers', contact_count: 1 }] },
      {},
      { id: 'list-1', name: 'Renamed', contact_count: 1 },
      { contact_count: 1 },
      { id: 'list-1', name: 'Customers', contact_count: 0 },
      {},
      { result: [{ id: 'contact-1' }] }
    );

    await service.deleteContactsByEmails(['a@example.com']);
    await service.listAllContacts();
    await service.addContact({ email: 'a@example.com' });
    await service.getContactsByList('list-1');
    await service.getContactsByEmails(['a@example.com']);
    await service.getContactById('contact-1');
    await service.getTotalContactCount();
    await service.getList('list-1');
    await service.listContactLists();
    await service.deleteList('list-1');
    await service.updateList('list-1', 'Renamed');
    await service.getListContactCount('list-1');
    await service.createList('Customers');
    await service.addContactsToList('list-1', ['a@example.com']);
    await service.removeContactsFromList('list-1', ['a@example.com']);

    expect(request).toHaveBeenLastCalledWith({
      method: 'DELETE',
      url: '/v3/marketing/lists/list-1/contacts',
      qs: { contact_ids: 'contact-1' }
    });
  });

  it('covers custom fields and segments', async () => {
    resolveBodies(
      { custom_fields: [] },
      { id: 'field-1' },
      { id: 'field-1', name: 'Tier' },
      {},
      { result: [] },
      { id: 'segment-1' },
      { id: 'segment-1' },
      { id: 'segment-1', name: 'Updated' },
      {},
      { id: 'segment-1', status: 'refreshing' }
    );

    await service.listCustomFields();
    await service.createCustomField({ name: 'Tier', field_type: 'Text' });
    await service.updateCustomField('field-1', { name: 'Plan' });
    await service.deleteCustomField('field-1');
    await service.listSegments({ page_size: 25 });
    await service.createSegment({ name: 'Engaged', query_dsl: 'email LIKE "%@example.com"' });
    await service.getSegment('segment-1');
    await service.updateSegment('segment-1', { name: 'Updated' });
    await service.deleteSegment('segment-1');
    await service.refreshSegment('segment-1');

    expectRequest({
      method: 'POST',
      url: '/v3/marketing/segments/2.0/segment-1/refresh'
    });
  });

  it('covers template and design operations', async () => {
    resolveBodies(
      { id: 'template-1' },
      { id: 'version-1' },
      { templates: [] },
      { id: 'template-1', versions: [] },
      {},
      { id: 'template-1', name: 'Renamed' },
      { id: 'version-1' },
      { id: 'version-2' },
      { id: 'version-2' },
      { id: 'version-2', active: 1 },
      {},
      { id: 'template-copy' },
      { result: [] },
      { id: 'design-1' },
      { id: 'design-1' },
      { id: 'design-1' },
      { id: 'design-copy' },
      {},
      { result: [] },
      { id: 'prebuilt-1' },
      { id: 'design-copy' }
    );

    await service.createTemplate({
      name: 'Welcome',
      subject: 'Hello',
      html_content: '<p>Hello</p>',
      plain_content: 'Hello'
    });
    await service.listTemplates();
    await service.getTemplate('template-1');
    await service.deleteTemplate('template-1');
    await service.updateTemplateName('template-1', 'Renamed');
    await service.getTemplateVersion('template-1', 'version-1');
    await service.createTemplateVersion('template-1', {
      name: 'Draft',
      subject: 'Hello',
      html_content: '<p>Hello</p>',
      plain_content: 'Hello'
    });
    await service.updateTemplateVersion('template-1', 'version-2', { subject: 'Updated' });
    await service.activateTemplateVersion('template-1', 'version-2');
    await service.deleteTemplateVersion('template-1', 'version-2');
    await service.duplicateTemplate('template-1', 'Copy');
    await service.listDesigns({ summary: true });
    await service.getDesign('design-1');
    await service.createDesign({ name: 'Design' });
    await service.updateDesign('design-1', { subject: 'Updated' });
    await service.duplicateDesign('design-1', 'Copy');
    await service.deleteDesign('design-1');
    await service.listPreBuiltDesigns({ page_size: 10 });
    await service.getPreBuiltDesign('prebuilt-1');
    await service.duplicatePreBuiltDesign('prebuilt-1', 'Copy');

    expectRequest({
      method: 'POST',
      url: '/v3/designs/pre-builts/prebuilt-1',
      body: { name: 'Copy' }
    });
  });

  it('covers validation, stats, single sends, suppressions, and senders', async () => {
    resolveBodies(
      { result: 'valid' },
      [],
      { id: 'single-1' },
      { id: 'single-1' },
      {},
      { id: 'single-copy' },
      { result: [] },
      {},
      { send_at: 'now' },
      {},
      { categories: [] },
      { results: [] },
      { results: [] },
      { id: 'single-1' },
      { result: [] },
      [],
      [],
      {},
      [],
      {},
      {},
      [],
      [],
      [],
      [],
      { result: [] },
      { result: [] },
      { id: 1 },
      { id: 1 },
      { id: 1 },
      {},
      {}
    );

    await service.validateEmail('a@example.com');
    await service.getStats({ start_date: '2026-06-01' });
    await service.createSingleSend({
      name: 'Draft',
      send_to: { list_ids: ['list-1'] },
      email_config: {
        subject: 'Hello',
        html_content: '<p>Hello</p>',
        plain_content: 'Hello',
        sender_id: 1
      }
    });
    await service.updateSingleSend('single-1', { name: 'Updated' });
    await service.deleteSingleSend('single-1');
    await service.duplicateSingleSend('single-1', 'Copy');
    await service.searchSingleSends({ query: 'status="draft"', page_size: 10 });
    await service.scheduleSingleSend('single-1', 'now');
    await service.getSingleSendSchedule('single-1');
    await service.cancelSingleSendSchedule('single-1');
    await service.listSingleSendCategories();
    await service.listSingleSendStats({ start_date: '2026-06-01' });
    await service.getSingleSendStats('single-1', { start_date: '2026-06-01' });
    await service.getSingleSend('single-1');
    await service.listSingleSends();
    await service.getSuppressionGroups();
    await service.listGroupSuppressions(1, { start_time: 1 });
    await service.addGroupSuppressions(1, ['a@example.com']);
    await service.deleteGroupSuppression(1, 'a@example.com');
    await service.listGlobalSuppressions({ start_time: 1 });
    await service.addGlobalSuppressions(['a@example.com']);
    await service.deleteGlobalSuppression('a@example.com');
    await service.listBounces({ start_time: 1 });
    await service.listBlocks({ start_time: 1 });
    await service.listInvalidEmails({ start_time: 1 });
    await service.listSpamReports({ start_time: 1 });
    await service.getVerifiedSenders();
    await service.listMarketingSenders();
    await service.getMarketingSender(1);
    await service.createMarketingSender({ nickname: 'Support' });
    await service.updateMarketingSender(1, { nickname: 'Support' });
    await service.deleteMarketingSender(1);
    await service.resendMarketingSenderVerification(1);

    expectRequest({
      method: 'POST',
      url: '/v3/marketing/senders/1/resend_verification'
    });
  });
});
