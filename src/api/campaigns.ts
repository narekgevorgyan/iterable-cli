import { getClient } from './client.js';
import type { Campaign, CampaignsResponse, CampaignMetrics } from './types.js';

export async function listCampaigns(): Promise<Campaign[]> {
  const client = await getClient();
  const response = await client.get<CampaignsResponse>('/api/campaigns');
  return response.data.campaigns;
}

export async function getCampaign(campaignId: number): Promise<Campaign> {
  const campaigns = await listCampaigns();
  const campaign = campaigns.find(c => c.id === campaignId);
  if (!campaign) {
    throw new Error(`Campaign ${campaignId} not found`);
  }
  return campaign;
}

export async function getCampaignMetrics(campaignId: number, startDate?: string, endDate?: string): Promise<CampaignMetrics> {
  const client = await getClient();
  const params: Record<string, string | number> = { campaignId };
  if (startDate) params.startDateTime = startDate;
  if (endDate) params.endDateTime = endDate;

  const response = await client.get('/api/campaigns/metrics', { params });
  return response.data;
}

export interface CreateCampaignRequest {
  name: string;
  listIds: number[];
  templateId: number;
  suppressionListIds?: number[];
  sendAt?: string;
  sendMode?: 'Scheduled' | 'Immediate';
  dataFields?: Record<string, unknown>;
}

export async function createCampaign(request: CreateCampaignRequest): Promise<{ campaignId: number }> {
  const client = await getClient();
  const response = await client.post('/api/campaigns/create', request);
  return response.data;
}

export async function triggerCampaign(campaignId: number, options: {
  listId?: number;
  email?: string;
  userId?: string;
  dataFields?: Record<string, unknown>;
}): Promise<{ msg: string }> {
  const client = await getClient();

  if (options.listId) {
    const response = await client.post('/api/campaigns/trigger', {
      campaignId,
      listId: options.listId,
      dataFields: options.dataFields,
    });
    return response.data;
  }

  // Single user trigger
  const response = await client.post('/api/campaigns/trigger', {
    campaignId,
    recipientEmail: options.email,
    recipientUserId: options.userId,
    dataFields: options.dataFields,
  });
  return response.data;
}

export async function scheduleCampaign(campaignId: number, sendAt: string): Promise<{ msg: string }> {
  const client = await getClient();
  const response = await client.post('/api/campaigns/schedule', {
    campaignId,
    sendAt,
  });
  return response.data;
}

export async function abortCampaign(campaignId: number): Promise<{ msg: string }> {
  const client = await getClient();
  const response = await client.post('/api/campaigns/abort', { campaignId });
  return response.data;
}

export async function archiveCampaign(campaignId: number): Promise<{ msg: string }> {
  const client = await getClient();
  const response = await client.post('/api/campaigns/archive', { campaignIds: [campaignId] });
  return response.data;
}
