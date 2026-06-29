import { Client } from '@sendgrid/client';
import sgMail from '@sendgrid/mail';
import {
  SendGridContact,
  SendGridDesign,
  SendGridDesignInput,
  SendGridDesignListParams,
  SendGridListResponse,
  SendGridList,
  SendGridSingleSend,
  SendGridStats,
  SendGridTemplate,
  SendGridTemplateVersion,
  SendGridTemplateVersionInput
} from '../types/index.js';

const compactObject = <T extends Record<string, any>>(value: T): Partial<T> =>
  Object.fromEntries(Object.entries(value).filter(([, entryValue]) => entryValue !== undefined)) as Partial<T>;

export class SendGridService {
  private client: Client;

  constructor(apiKey: string) {
    this.client = new Client();
    this.client.setApiKey(apiKey);
    sgMail.setApiKey(apiKey);
  }

  async sendEmail(params: {
    to: string;
    from: string;
    subject: string;
    text: string;
    html?: string;
    template_id?: string;
    dynamic_template_data?: Record<string, any>;
  }) {
    return await sgMail.send(params);
  }

  async deleteContactsByEmails(emails: string[]): Promise<void> {
    const [searchResponse] = await this.client.request({
      method: 'POST',
      url: '/v3/marketing/contacts/search',
      body: {
        query: `email IN (${emails.map((email) => `'${email}'`).join(',')})`
      }
    });

    const contacts = (searchResponse.body as { result: SendGridContact[] }).result || [];
    const contactIds = contacts.map((contact) => contact.id).filter((id) => id) as string[];

    if (contactIds.length > 0) {
      await this.client.request({
        method: 'DELETE',
        url: '/v3/marketing/contacts',
        qs: {
          ids: contactIds.join(',')
        }
      });
    }
  }

  async listAllContacts(): Promise<SendGridContact[]> {
    const [response] = await this.client.request({
      method: 'POST',
      url: '/v3/marketing/contacts/search',
      body: {
        query: 'email IS NOT NULL'
      }
    });
    return (response.body as { result: SendGridContact[] }).result || [];
  }

  async addContact(contact: SendGridContact) {
    const [response] = await this.client.request({
      method: 'PUT',
      url: '/v3/marketing/contacts',
      body: {
        contacts: [contact]
      }
    });
    return response;
  }

  async getContactsByList(listId: string): Promise<SendGridContact[]> {
    const [response] = await this.client.request({
      method: 'POST',
      url: '/v3/marketing/contacts/search',
      body: {
        query: `CONTAINS(list_ids, '${listId}')`
      }
    });
    return (response.body as { result: SendGridContact[] }).result || [];
  }

  async getContactsByEmails(emails: string[]) {
    const [response] = await this.client.request({
      method: 'POST',
      url: '/v3/marketing/contacts/search/emails',
      body: { emails }
    });
    return response.body;
  }

  async getContactById(contactId: string): Promise<SendGridContact> {
    const [response] = await this.client.request({
      method: 'GET',
      url: `/v3/marketing/contacts/${contactId}`
    });
    return response.body as SendGridContact;
  }

  async getTotalContactCount() {
    const [response] = await this.client.request({
      method: 'GET',
      url: '/v3/marketing/contacts/count'
    });
    return response.body;
  }

  async getList(listId: string): Promise<SendGridList> {
    const [response] = await this.client.request({
      method: 'GET',
      url: `/v3/marketing/lists/${listId}`
    });
    return response.body as SendGridList;
  }

  async listContactLists(): Promise<SendGridList[]> {
    const [response] = await this.client.request({
      method: 'GET',
      url: '/v3/marketing/lists'
    });
    return (response.body as { result: SendGridList[] }).result;
  }

  async deleteList(listId: string): Promise<void> {
    await this.client.request({
      method: 'DELETE',
      url: `/v3/marketing/lists/${listId}`
    });
  }

  async updateList(listId: string, name: string): Promise<SendGridList> {
    const [response] = await this.client.request({
      method: 'PATCH',
      url: `/v3/marketing/lists/${listId}`,
      body: { name }
    });
    return response.body as SendGridList;
  }

  async getListContactCount(listId: string) {
    const [response] = await this.client.request({
      method: 'GET',
      url: `/v3/marketing/lists/${listId}/contacts/count`
    });
    return response.body;
  }

  async createList(name: string): Promise<SendGridList> {
    const [response] = await this.client.request({
      method: 'POST',
      url: '/v3/marketing/lists',
      body: { name }
    });
    return response.body as SendGridList;
  }

  async addContactsToList(listId: string, contactEmails: string[]) {
    const [response] = await this.client.request({
      method: 'PUT',
      url: '/v3/marketing/contacts',
      body: {
        list_ids: [listId],
        contacts: contactEmails.map((email) => ({ email }))
      }
    });
    return response;
  }

  async removeContactsFromList(listId: string, contactEmails: string[]) {
    const [searchResponse] = await this.client.request({
      method: 'POST',
      url: '/v3/marketing/contacts/search',
      body: {
        query: `email IN (${contactEmails.map((email) => `'${email}'`).join(',')}) AND CONTAINS(list_ids, '${listId}')`
      }
    });

    const contacts = (searchResponse.body as { result: SendGridContact[] }).result || [];
    const contactIds = contacts.map((contact) => contact.id).filter((id) => id) as string[];

    if (contactIds.length > 0) {
      await this.client.request({
        method: 'DELETE',
        url: `/v3/marketing/lists/${listId}/contacts`,
        qs: {
          contact_ids: contactIds.join(',')
        }
      });
    }
  }

  async listCustomFields() {
    const [response] = await this.client.request({
      method: 'GET',
      url: '/v3/marketing/field_definitions'
    });
    return response.body;
  }

  async createCustomField(params: Record<string, any>) {
    const [response] = await this.client.request({
      method: 'POST',
      url: '/v3/marketing/field_definitions',
      body: params
    });
    return response.body;
  }

  async updateCustomField(fieldId: string, params: Record<string, any>) {
    const [response] = await this.client.request({
      method: 'PATCH',
      url: `/v3/marketing/field_definitions/${fieldId}`,
      body: compactObject(params)
    });
    return response.body;
  }

  async deleteCustomField(fieldId: string): Promise<void> {
    await this.client.request({
      method: 'DELETE',
      url: `/v3/marketing/field_definitions/${fieldId}`
    });
  }

  async listSegments(params: Record<string, any> = {}) {
    const [response] = await this.client.request({
      method: 'GET',
      url: '/v3/marketing/segments/2.0',
      qs: compactObject(params)
    });
    return response.body;
  }

  async createSegment(params: Record<string, any>) {
    const [response] = await this.client.request({
      method: 'POST',
      url: '/v3/marketing/segments/2.0',
      body: params
    });
    return response.body;
  }

  async getSegment(segmentId: string) {
    const [response] = await this.client.request({
      method: 'GET',
      url: `/v3/marketing/segments/2.0/${segmentId}`
    });
    return response.body;
  }

  async updateSegment(segmentId: string, params: Record<string, any>) {
    const [response] = await this.client.request({
      method: 'PATCH',
      url: `/v3/marketing/segments/2.0/${segmentId}`,
      body: compactObject(params)
    });
    return response.body;
  }

  async deleteSegment(segmentId: string): Promise<void> {
    await this.client.request({
      method: 'DELETE',
      url: `/v3/marketing/segments/2.0/${segmentId}`
    });
  }

  async refreshSegment(segmentId: string) {
    const [response] = await this.client.request({
      method: 'POST',
      url: `/v3/marketing/segments/2.0/${segmentId}/refresh`
    });
    return response.body;
  }

  async createTemplate(params: {
    name: string;
    html_content: string;
    plain_content: string;
    subject: string;
  }): Promise<SendGridTemplate> {
    const [response] = await this.client.request({
      method: 'POST',
      url: '/v3/templates',
      body: {
        name: params.name,
        generation: 'dynamic'
      }
    });

    const templateId = (response.body as { id: string }).id;

    const [versionResponse] = await this.client.request({
      method: 'POST',
      url: `/v3/templates/${templateId}/versions`,
      body: {
        template_id: templateId,
        name: `${params.name} v1`,
        subject: params.subject,
        html_content: params.html_content,
        plain_content: params.plain_content,
        active: 1
      }
    });

    return {
      id: templateId,
      name: params.name,
      generation: 'dynamic',
      updated_at: new Date().toISOString(),
      versions: [
        {
          id: (versionResponse.body as { id: string }).id,
          template_id: templateId,
          active: 1,
          name: `${params.name} v1`,
          html_content: params.html_content,
          plain_content: params.plain_content,
          subject: params.subject
        }
      ]
    };
  }

  async listTemplates(): Promise<SendGridTemplate[]> {
    const [response] = await this.client.request({
      method: 'GET',
      url: '/v3/templates',
      qs: {
        generations: 'dynamic'
      }
    });
    return (response.body as { templates: SendGridTemplate[] }).templates || [];
  }

  async getTemplate(templateId: string): Promise<SendGridTemplate> {
    const [response] = await this.client.request({
      method: 'GET',
      url: `/v3/templates/${templateId}`
    });
    return response.body as SendGridTemplate;
  }

  async deleteTemplate(templateId: string): Promise<void> {
    await this.client.request({
      method: 'DELETE',
      url: `/v3/templates/${templateId}`
    });
  }

  async updateTemplateName(templateId: string, name: string): Promise<SendGridTemplate> {
    const [response] = await this.client.request({
      method: 'PATCH',
      url: `/v3/templates/${templateId}`,
      body: { name }
    });
    return response.body as SendGridTemplate;
  }

  async getTemplateVersion(templateId: string, versionId: string): Promise<SendGridTemplateVersion> {
    const [response] = await this.client.request({
      method: 'GET',
      url: `/v3/templates/${templateId}/versions/${versionId}`
    });
    return response.body as SendGridTemplateVersion;
  }

  async createTemplateVersion(
    templateId: string,
    params: SendGridTemplateVersionInput
  ): Promise<SendGridTemplateVersion> {
    const [response] = await this.client.request({
      method: 'POST',
      url: `/v3/templates/${templateId}/versions`,
      body: {
        template_id: templateId,
        name: params.name,
        subject: params.subject,
        html_content: params.html_content,
        plain_content: params.plain_content,
        active: params.active ?? 0
      }
    });
    return response.body as SendGridTemplateVersion;
  }

  async updateTemplateVersion(
    templateId: string,
    versionId: string,
    params: Partial<SendGridTemplateVersionInput>
  ): Promise<SendGridTemplateVersion> {
    const [response] = await this.client.request({
      method: 'PATCH',
      url: `/v3/templates/${templateId}/versions/${versionId}`,
      body: compactObject(params)
    });
    return response.body as SendGridTemplateVersion;
  }

  async activateTemplateVersion(templateId: string, versionId: string): Promise<SendGridTemplateVersion> {
    const [response] = await this.client.request({
      method: 'POST',
      url: `/v3/templates/${templateId}/versions/${versionId}/activate`
    });
    return response.body as SendGridTemplateVersion;
  }

  async deleteTemplateVersion(templateId: string, versionId: string): Promise<void> {
    await this.client.request({
      method: 'DELETE',
      url: `/v3/templates/${templateId}/versions/${versionId}`
    });
  }

  async duplicateTemplate(templateId: string, name: string): Promise<SendGridTemplate> {
    const [response] = await this.client.request({
      method: 'POST',
      url: `/v3/templates/${templateId}`,
      body: { name }
    });
    return response.body as SendGridTemplate;
  }

  async listDesigns(params: SendGridDesignListParams = {}): Promise<SendGridListResponse<SendGridDesign>> {
    const [response] = await this.client.request({
      method: 'GET',
      url: '/v3/designs',
      qs: compactObject(params)
    });
    return response.body as SendGridListResponse<SendGridDesign>;
  }

  async getDesign(designId: string): Promise<SendGridDesign> {
    const [response] = await this.client.request({
      method: 'GET',
      url: `/v3/designs/${designId}`
    });
    return response.body as SendGridDesign;
  }

  async createDesign(params: SendGridDesignInput): Promise<SendGridDesign> {
    const [response] = await this.client.request({
      method: 'POST',
      url: '/v3/designs',
      body: compactObject(params)
    });
    return response.body as SendGridDesign;
  }

  async updateDesign(designId: string, params: Partial<SendGridDesignInput>): Promise<SendGridDesign> {
    const [response] = await this.client.request({
      method: 'PATCH',
      url: `/v3/designs/${designId}`,
      body: compactObject(params)
    });
    return response.body as SendGridDesign;
  }

  async duplicateDesign(designId: string, name?: string): Promise<SendGridDesign> {
    const [response] = await this.client.request({
      method: 'POST',
      url: `/v3/designs/${designId}`,
      body: compactObject({ name })
    });
    return response.body as SendGridDesign;
  }

  async deleteDesign(designId: string): Promise<void> {
    await this.client.request({
      method: 'DELETE',
      url: `/v3/designs/${designId}`
    });
  }

  async listPreBuiltDesigns(params: SendGridDesignListParams = {}): Promise<SendGridListResponse<SendGridDesign>> {
    const [response] = await this.client.request({
      method: 'GET',
      url: '/v3/designs/pre-builts',
      qs: compactObject(params)
    });
    return response.body as SendGridListResponse<SendGridDesign>;
  }

  async getPreBuiltDesign(designId: string): Promise<SendGridDesign> {
    const [response] = await this.client.request({
      method: 'GET',
      url: `/v3/designs/pre-builts/${designId}`
    });
    return response.body as SendGridDesign;
  }

  async duplicatePreBuiltDesign(designId: string, name?: string): Promise<SendGridDesign> {
    const [response] = await this.client.request({
      method: 'POST',
      url: `/v3/designs/pre-builts/${designId}`,
      body: compactObject({ name })
    });
    return response.body as SendGridDesign;
  }

  async validateEmail(email: string) {
    const [response] = await this.client.request({
      method: 'POST',
      url: '/v3/validations/email',
      body: { email }
    });
    return response.body;
  }

  async getStats(params: {
    start_date: string;
    end_date?: string;
    aggregated_by?: 'day' | 'week' | 'month';
  }): Promise<SendGridStats> {
    const [response] = await this.client.request({
      method: 'GET',
      url: '/v3/stats',
      qs: params
    });
    return response.body as SendGridStats;
  }

  async createSingleSend(params: {
    name: string;
    send_to: { list_ids?: string[]; segment_ids?: string[] };
    email_config: {
      subject: string;
      html_content: string;
      plain_content: string;
      sender_id: number;
      suppression_group_id?: number;
      custom_unsubscribe_url?: string;
    };
  }): Promise<{ id: string }> {
    const [response] = await this.client.request({
      method: 'POST',
      url: '/v3/marketing/singlesends',
      body: params
    });
    return response.body as { id: string };
  }

  async updateSingleSend(singleSendId: string, params: Record<string, any>): Promise<SendGridSingleSend> {
    const [response] = await this.client.request({
      method: 'PATCH',
      url: `/v3/marketing/singlesends/${singleSendId}`,
      body: compactObject(params)
    });
    return response.body as SendGridSingleSend;
  }

  async deleteSingleSend(singleSendId: string): Promise<void> {
    await this.client.request({
      method: 'DELETE',
      url: `/v3/marketing/singlesends/${singleSendId}`
    });
  }

  async duplicateSingleSend(singleSendId: string, name?: string) {
    const [response] = await this.client.request({
      method: 'POST',
      url: `/v3/marketing/singlesends/${singleSendId}/duplicate`,
      body: compactObject({ name })
    });
    return response.body;
  }

  async searchSingleSends(params: { query: string; page_size?: number; page_token?: string }) {
    const [response] = await this.client.request({
      method: 'POST',
      url: '/v3/marketing/singlesends/search',
      qs: compactObject({
        page_size: params.page_size,
        page_token: params.page_token
      }),
      body: { query: params.query }
    });
    return response.body;
  }

  async scheduleSingleSend(singleSendId: string, sendAt: string) {
    const [response] = await this.client.request({
      method: 'PUT',
      url: `/v3/marketing/singlesends/${singleSendId}/schedule`,
      body: {
        send_at: sendAt
      }
    });
    return response.body;
  }

  async getSingleSendSchedule(singleSendId: string) {
    const [response] = await this.client.request({
      method: 'GET',
      url: `/v3/marketing/singlesends/${singleSendId}/schedule`
    });
    return response.body;
  }

  async cancelSingleSendSchedule(singleSendId: string): Promise<void> {
    await this.client.request({
      method: 'DELETE',
      url: `/v3/marketing/singlesends/${singleSendId}/schedule`
    });
  }

  async listSingleSendCategories() {
    const [response] = await this.client.request({
      method: 'GET',
      url: '/v3/marketing/singlesends/categories'
    });
    return response.body;
  }

  async listSingleSendStats(params: Record<string, any> = {}) {
    const [response] = await this.client.request({
      method: 'GET',
      url: '/v3/marketing/stats/singlesends',
      qs: compactObject(params)
    });
    return response.body;
  }

  async getSingleSendStats(singleSendId: string, params: Record<string, any> = {}) {
    const [response] = await this.client.request({
      method: 'GET',
      url: `/v3/marketing/stats/singlesends/${singleSendId}`,
      qs: compactObject(params)
    });
    return response.body;
  }

  async getSingleSend(singleSendId: string): Promise<SendGridSingleSend> {
    const [response] = await this.client.request({
      method: 'GET',
      url: `/v3/marketing/singlesends/${singleSendId}`
    });
    return response.body as SendGridSingleSend;
  }

  async listSingleSends(params: Record<string, any> = {}): Promise<SendGridListResponse<SendGridSingleSend>> {
    const [response] = await this.client.request({
      method: 'GET',
      url: '/v3/marketing/singlesends',
      qs: compactObject(params)
    });
    return response.body as SendGridListResponse<SendGridSingleSend>;
  }

  async getSuppressionGroups() {
    const [response] = await this.client.request({
      method: 'GET',
      url: '/v3/asm/groups'
    });
    return response.body;
  }

  async listGroupSuppressions(groupId: number, params: Record<string, any> = {}) {
    const [response] = await this.client.request({
      method: 'GET',
      url: `/v3/asm/groups/${groupId}/suppressions`,
      qs: compactObject(params)
    });
    return response.body;
  }

  async addGroupSuppressions(groupId: number, emails: string[]) {
    const [response] = await this.client.request({
      method: 'POST',
      url: `/v3/asm/groups/${groupId}/suppressions`,
      body: { recipient_emails: emails }
    });
    return response.body;
  }

  async deleteGroupSuppression(groupId: number, email: string): Promise<void> {
    await this.client.request({
      method: 'DELETE',
      url: `/v3/asm/groups/${groupId}/suppressions/${encodeURIComponent(email)}`
    });
  }

  async listGlobalSuppressions(params: Record<string, any> = {}) {
    const [response] = await this.client.request({
      method: 'GET',
      url: '/v3/asm/suppressions/global',
      qs: compactObject(params)
    });
    return response.body;
  }

  async addGlobalSuppressions(emails: string[]) {
    const [response] = await this.client.request({
      method: 'POST',
      url: '/v3/asm/suppressions/global',
      body: { recipient_emails: emails }
    });
    return response.body;
  }

  async deleteGlobalSuppression(email: string): Promise<void> {
    await this.client.request({
      method: 'DELETE',
      url: `/v3/asm/suppressions/global/${encodeURIComponent(email)}`
    });
  }

  async listBounces(params: Record<string, any> = {}) {
    const [response] = await this.client.request({
      method: 'GET',
      url: '/v3/suppression/bounces',
      qs: compactObject(params)
    });
    return response.body;
  }

  async listBlocks(params: Record<string, any> = {}) {
    const [response] = await this.client.request({
      method: 'GET',
      url: '/v3/suppression/blocks',
      qs: compactObject(params)
    });
    return response.body;
  }

  async listInvalidEmails(params: Record<string, any> = {}) {
    const [response] = await this.client.request({
      method: 'GET',
      url: '/v3/suppression/invalid_emails',
      qs: compactObject(params)
    });
    return response.body;
  }

  async listSpamReports(params: Record<string, any> = {}) {
    const [response] = await this.client.request({
      method: 'GET',
      url: '/v3/suppression/spam_reports',
      qs: compactObject(params)
    });
    return response.body;
  }

  async getVerifiedSenders() {
    const [response] = await this.client.request({
      method: 'GET',
      url: '/v3/verified_senders'
    });
    return response.body;
  }

  async listMarketingSenders() {
    const [response] = await this.client.request({
      method: 'GET',
      url: '/v3/marketing/senders'
    });
    return response.body;
  }

  async getMarketingSender(senderId: number) {
    const [response] = await this.client.request({
      method: 'GET',
      url: `/v3/marketing/senders/${senderId}`
    });
    return response.body;
  }

  async createMarketingSender(params: Record<string, any>) {
    const [response] = await this.client.request({
      method: 'POST',
      url: '/v3/marketing/senders',
      body: params
    });
    return response.body;
  }

  async updateMarketingSender(senderId: number, params: Record<string, any>) {
    const [response] = await this.client.request({
      method: 'PATCH',
      url: `/v3/marketing/senders/${senderId}`,
      body: compactObject(params)
    });
    return response.body;
  }

  async deleteMarketingSender(senderId: number): Promise<void> {
    await this.client.request({
      method: 'DELETE',
      url: `/v3/marketing/senders/${senderId}`
    });
  }

  async resendMarketingSenderVerification(senderId: number) {
    const [response] = await this.client.request({
      method: 'POST',
      url: `/v3/marketing/senders/${senderId}/resend_verification`
    });
    return response.body;
  }
}
