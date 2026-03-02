import { getClient } from './client.js';
import type { Template, TemplatesResponse, EmailTemplate, PushTemplate } from './types.js';

export type TemplateType = 'Base' | 'Blast' | 'Triggered' | 'Workflow';

export async function listTemplates(templateType?: TemplateType, messageMedium?: string): Promise<Template[]> {
  const client = await getClient();
  const params: Record<string, string> = {};
  if (templateType) params.templateType = templateType;
  if (messageMedium) params.messageMedium = messageMedium;

  const response = await client.get<TemplatesResponse>('/api/templates', { params });
  return response.data.templates;
}

export async function getEmailTemplate(templateId: number): Promise<EmailTemplate> {
  const client = await getClient();
  const response = await client.get('/api/templates/email/get', {
    params: { templateId },
  });
  return response.data;
}

export async function getPushTemplate(templateId: number): Promise<PushTemplate> {
  const client = await getClient();
  const response = await client.get('/api/templates/push/get', {
    params: { templateId },
  });
  return response.data;
}

export async function getSmsTemplate(templateId: number): Promise<Template> {
  const client = await getClient();
  const response = await client.get('/api/templates/sms/get', {
    params: { templateId },
  });
  return response.data;
}

export async function getInAppTemplate(templateId: number): Promise<Template> {
  const client = await getClient();
  const response = await client.get('/api/templates/inapp/get', {
    params: { templateId },
  });
  return response.data;
}

export async function previewEmailTemplate(templateId: number, recipientEmail: string): Promise<{
  subject: string;
  html: string;
  plainText: string;
}> {
  const client = await getClient();
  const response = await client.post('/api/templates/email/preview', {
    templateId,
    recipientEmail,
  });
  return response.data;
}

export async function updateEmailTemplate(templateId: number, updates: {
  name?: string;
  subject?: string;
  fromEmail?: string;
  fromName?: string;
  html?: string;
  plainText?: string;
}): Promise<{ msg: string }> {
  const client = await getClient();
  const response = await client.post('/api/templates/email/update', {
    templateId,
    ...updates,
  });
  return response.data;
}

export async function updatePushTemplate(templateId: number, updates: {
  name?: string;
  title?: string;
  message?: string;
  sound?: string;
  deepLink?: string;
}): Promise<{ msg: string }> {
  const client = await getClient();
  const response = await client.post('/api/templates/push/update', {
    templateId,
    ...updates,
  });
  return response.data;
}

export async function upsertEmailTemplate(clientTemplateId: string, template: {
  name: string;
  subject: string;
  fromEmail: string;
  fromName?: string;
  html?: string;
  plainText?: string;
}): Promise<{ templateId: number }> {
  const client = await getClient();
  const response = await client.post('/api/templates/email/upsert', {
    clientTemplateId,
    ...template,
  });
  return response.data;
}

export async function sendProof(type: 'email' | 'push' | 'sms', templateId: number, recipientEmail: string): Promise<{ msg: string }> {
  const client = await getClient();
  const response = await client.post(`/api/templates/${type}/proof`, {
    templateId,
    recipientEmail,
  });
  return response.data;
}
