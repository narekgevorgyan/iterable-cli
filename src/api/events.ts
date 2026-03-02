import { getClient } from './client.js';
import type { TrackEventRequest } from './types.js';

export async function trackEvent(request: TrackEventRequest): Promise<{ msg: string }> {
  const client = await getClient();
  const response = await client.post('/api/events/track', request);
  return response.data;
}

export async function trackBulkEvents(events: TrackEventRequest[]): Promise<{ msg: string }> {
  const client = await getClient();
  const response = await client.post('/api/events/trackBulk', { events });
  return response.data;
}

export async function trackPurchase(options: {
  email?: string;
  userId?: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    sku?: string;
    description?: string;
    categories?: string[];
    imageUrl?: string;
    url?: string;
    dataFields?: Record<string, unknown>;
  }>;
  total: number;
  campaignId?: number;
  templateId?: number;
  dataFields?: Record<string, unknown>;
}): Promise<{ msg: string }> {
  const client = await getClient();
  const response = await client.post('/api/commerce/trackPurchase', options);
  return response.data;
}

export async function updateCart(options: {
  email?: string;
  userId?: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    sku?: string;
    description?: string;
    categories?: string[];
    imageUrl?: string;
    url?: string;
    dataFields?: Record<string, unknown>;
  }>;
}): Promise<{ msg: string }> {
  const client = await getClient();
  const response = await client.post('/api/commerce/updateCart', options);
  return response.data;
}
