import { getClient } from './client.js';

export interface SendOptions {
  recipientEmail?: string;
  recipientUserId?: string;
  dataFields?: Record<string, unknown>;
  sendAt?: string;
  allowRepeatMarketingSends?: boolean;
}

export async function sendEmail(campaignId: number, options: SendOptions): Promise<{ msg: string }> {
  const client = await getClient();
  const response = await client.post('/api/email/target', {
    campaignId,
    ...options,
  });
  return response.data;
}

export async function sendPush(campaignId: number, options: SendOptions): Promise<{ msg: string }> {
  const client = await getClient();
  const response = await client.post('/api/push/target', {
    campaignId,
    ...options,
  });
  return response.data;
}

export async function sendSms(campaignId: number, options: SendOptions): Promise<{ msg: string }> {
  const client = await getClient();
  const response = await client.post('/api/sms/target', {
    campaignId,
    ...options,
  });
  return response.data;
}

export async function sendInApp(campaignId: number, options: SendOptions): Promise<{ msg: string }> {
  const client = await getClient();
  const response = await client.post('/api/inApp/target', {
    campaignId,
    ...options,
  });
  return response.data;
}

export async function sendWebPush(campaignId: number, options: SendOptions): Promise<{ msg: string }> {
  const client = await getClient();
  const response = await client.post('/api/webPush/target', {
    campaignId,
    ...options,
  });
  return response.data;
}

export async function cancelEmail(options: {
  campaignId?: number;
  email?: string;
  userId?: string;
  scheduledMessageId?: string;
}): Promise<{ msg: string }> {
  const client = await getClient();
  const response = await client.post('/api/email/cancel', options);
  return response.data;
}

export async function cancelPush(options: {
  campaignId?: number;
  email?: string;
  userId?: string;
  scheduledMessageId?: string;
}): Promise<{ msg: string }> {
  const client = await getClient();
  const response = await client.post('/api/push/cancel', options);
  return response.data;
}

export async function cancelSms(options: {
  campaignId?: number;
  email?: string;
  userId?: string;
  scheduledMessageId?: string;
}): Promise<{ msg: string }> {
  const client = await getClient();
  const response = await client.post('/api/sms/cancel', options);
  return response.data;
}
