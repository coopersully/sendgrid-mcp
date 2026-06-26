import { describe, expect, it, beforeEach, vi } from 'vitest';
import { SendGridService } from '../sendgrid.js';

describe('SendGridService', () => {
  let service: SendGridService;
  let request: any;

  beforeEach(() => {
    service = new SendGridService('SG.test-api-key');
    request = vi.fn();
    (service as any).client = { request };
  });

  describe('Design Library', () => {
    it('lists designs with optional pagination and summary options', async () => {
      request.mockResolvedValueOnce([
        {
          body: {
            result: [{ id: 'design-1', name: 'Welcome' }],
            _metadata: { next: 'next-page' }
          }
        }
      ]);

      const response = await service.listDesigns({ page_size: 25, page_token: 'next-page', summary: true });

      expect(response).toEqual({
        result: [{ id: 'design-1', name: 'Welcome' }],
        _metadata: { next: 'next-page' }
      });
      expect(request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/v3/designs',
        qs: {
          page_size: 25,
          page_token: 'next-page',
          summary: true
        }
      });
    });

    it('creates a design with editor content', async () => {
      request.mockResolvedValueOnce([{ body: { id: 'design-1', name: 'Welcome' } }]);

      const design = await service.createDesign({
        name: 'Welcome',
        subject: 'Hello {{first_name}}',
        html_content: '<p>Hello</p>',
        plain_content: 'Hello',
        generate_plain_content: false
      });

      expect(design).toEqual({ id: 'design-1', name: 'Welcome' });
      expect(request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/v3/designs',
        body: {
          name: 'Welcome',
          subject: 'Hello {{first_name}}',
          html_content: '<p>Hello</p>',
          plain_content: 'Hello',
          generate_plain_content: false
        }
      });
    });

    it('duplicates an existing design', async () => {
      request.mockResolvedValueOnce([{ body: { id: 'design-copy', name: 'Welcome Copy' } }]);

      const design = await service.duplicateDesign('design-1', 'Welcome Copy');

      expect(design).toEqual({ id: 'design-copy', name: 'Welcome Copy' });
      expect(request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/v3/designs/design-1',
        body: { name: 'Welcome Copy' }
      });
    });
  });

  describe('Dynamic template versions', () => {
    it('creates a new inactive template version from edited content by default', async () => {
      request.mockResolvedValueOnce([{ body: { id: 'version-2', active: 0 } }]);

      const version = await service.createTemplateVersion('template-1', {
        name: 'Draft edit',
        subject: 'Updated subject',
        html_content: '<p>Updated</p>',
        plain_content: 'Updated'
      });

      expect(version).toEqual({ id: 'version-2', active: 0 });
      expect(request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/v3/templates/template-1/versions',
        body: {
          template_id: 'template-1',
          name: 'Draft edit',
          subject: 'Updated subject',
          html_content: '<p>Updated</p>',
          plain_content: 'Updated',
          active: 0
        }
      });
    });

    it('activates a specific template version', async () => {
      request.mockResolvedValueOnce([{ body: { id: 'version-2', active: 1 } }]);

      const version = await service.activateTemplateVersion('template-1', 'version-2');

      expect(version).toEqual({ id: 'version-2', active: 1 });
      expect(request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/v3/templates/template-1/versions/version-2/activate'
      });
    });

    it('duplicates a dynamic template through SendGrid native duplicate endpoint', async () => {
      request.mockResolvedValueOnce([{ body: { id: 'template-copy', name: 'Copied Template' } }]);

      const template = await service.duplicateTemplate('template-1', 'Copied Template');

      expect(template).toEqual({ id: 'template-copy', name: 'Copied Template' });
      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/v3/templates/template-1',
        body: { name: 'Copied Template' }
      });
    });
  });

  describe('Single Sends workflow and stats', () => {
    it('updates a single send without immediately scheduling it', async () => {
      request.mockResolvedValueOnce([{ body: { id: 'single-send-1', name: 'Updated' } }]);

      const singleSend = await service.updateSingleSend('single-send-1', { name: 'Updated' });

      expect(singleSend).toEqual({ id: 'single-send-1', name: 'Updated' });
      expect(request).toHaveBeenCalledWith({
        method: 'PATCH',
        url: '/v3/marketing/singlesends/single-send-1',
        body: { name: 'Updated' }
      });
    });

    it('searches single sends with query and pagination', async () => {
      request.mockResolvedValueOnce([{ body: { result: [{ id: 'single-send-1' }] } }]);

      const result = await service.searchSingleSends({ query: 'status="draft"', page_size: 20 });

      expect(result).toEqual({ result: [{ id: 'single-send-1' }] });
      expect(request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/v3/marketing/singlesends/search',
        qs: { page_size: 20 },
        body: { query: 'status="draft"' }
      });
    });

    it('cancels a scheduled single send and retrieves single-send stats', async () => {
      request
        .mockResolvedValueOnce([{ body: {} }])
        .mockResolvedValueOnce([{ body: { results: [{ id: 'single-send-1' }] } }]);

      await service.cancelSingleSendSchedule('single-send-1');
      const stats = await service.getSingleSendStats('single-send-1', { start_date: '2026-06-01' });

      expect(stats).toEqual({ results: [{ id: 'single-send-1' }] });
      expect(request).toHaveBeenNthCalledWith(1, {
        method: 'DELETE',
        url: '/v3/marketing/singlesends/single-send-1/schedule'
      });
      expect(request).toHaveBeenNthCalledWith(2, {
        method: 'GET',
        url: '/v3/marketing/stats/singlesends/single-send-1',
        qs: { start_date: '2026-06-01' }
      });
    });
  });

  describe('Marketing contacts quick wins', () => {
    it('lists custom field definitions', async () => {
      request.mockResolvedValueOnce([{ body: { custom_fields: [{ id: 'field-1' }] } }]);

      const fields = await service.listCustomFields();

      expect(fields).toEqual({ custom_fields: [{ id: 'field-1' }] });
      expect(request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/v3/marketing/field_definitions'
      });
    });

    it('retrieves contacts by email', async () => {
      request.mockResolvedValueOnce([{ body: { result: { 'person@example.com': { email: 'person@example.com' } } } }]);

      const contacts = await service.getContactsByEmails(['person@example.com']);

      expect(contacts).toEqual({ result: { 'person@example.com': { email: 'person@example.com' } } });
      expect(request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/v3/marketing/contacts/search/emails',
        body: { emails: ['person@example.com'] }
      });
    });

    it('creates a segment v2', async () => {
      request.mockResolvedValueOnce([{ body: { id: 'segment-1', name: 'Engaged' } }]);

      const segment = await service.createSegment({ name: 'Engaged', query_dsl: 'email LIKE "%@example.com"' });

      expect(segment).toEqual({ id: 'segment-1', name: 'Engaged' });
      expect(request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/v3/marketing/segments/2.0',
        body: { name: 'Engaged', query_dsl: 'email LIKE "%@example.com"' }
      });
    });
  });

  describe('Suppressions and senders quick wins', () => {
    it('lists group suppressions and creates a marketing sender', async () => {
      request
        .mockResolvedValueOnce([{ body: [{ email: 'blocked@example.com' }] }])
        .mockResolvedValueOnce([{ body: { id: 42, nickname: 'Support' } }]);

      const suppressions = await service.listGroupSuppressions(123);
      const sender = await service.createMarketingSender({ nickname: 'Support' });

      expect(suppressions).toEqual([{ email: 'blocked@example.com' }]);
      expect(sender).toEqual({ id: 42, nickname: 'Support' });
      expect(request).toHaveBeenNthCalledWith(1, {
        method: 'GET',
        url: '/v3/asm/groups/123/suppressions',
        qs: {}
      });
      expect(request).toHaveBeenNthCalledWith(2, {
        method: 'POST',
        url: '/v3/marketing/senders',
        body: { nickname: 'Support' }
      });
    });
  });
});
