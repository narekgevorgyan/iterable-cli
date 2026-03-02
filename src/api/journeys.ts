import { getClient } from './client.js';
import type { Journey, JourneysResponse } from './types.js';

export async function listJourneys(options?: {
  state?: 'Active' | 'Archived';
  sort?: string;
  limit?: number;
}): Promise<{ journeys: Journey[]; totalCount: number }> {
  const client = await getClient();
  const params: Record<string, string | number> = {};
  if (options?.state) params.state = options.state;
  if (options?.sort) params.sort = options.sort;
  if (options?.limit) params.limit = options.limit;

  const response = await client.get<JourneysResponse>('/api/journeys', { params });
  return {
    journeys: response.data.journeys || [],
    totalCount: response.data.totalJourneysCount || 0,
  };
}

export async function getJourney(journeyId: number): Promise<Journey | null> {
  const { journeys } = await listJourneys();
  // Also check archived journeys
  const { journeys: archivedJourneys } = await listJourneys({ state: 'Archived' });
  const allJourneys = [...journeys, ...archivedJourneys];
  return allJourneys.find(j => j.id === journeyId) || null;
}

export async function triggerWorkflow(workflowId: number, options: {
  email?: string;
  userId?: string;
  listId?: number;
  dataFields?: Record<string, unknown>;
}): Promise<{ msg: string }> {
  const client = await getClient();
  const body: Record<string, unknown> = { workflowId };
  if (options.email) body.email = options.email;
  if (options.userId) body.userId = options.userId;
  if (options.listId) body.listId = options.listId;
  if (options.dataFields) body.dataFields = options.dataFields;

  const response = await client.post('/api/workflows/triggerWorkflow', body);
  return response.data;
}
