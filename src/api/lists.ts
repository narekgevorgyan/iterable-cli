import { getClient } from './client.js';
import type { List, ListsResponse } from './types.js';

export async function listLists(): Promise<List[]> {
  const client = await getClient();
  const response = await client.get<ListsResponse>('/api/lists');
  return response.data.lists;
}

export async function createList(name: string): Promise<{ listId: number }> {
  const client = await getClient();
  const response = await client.post('/api/lists', { name });
  return response.data;
}

export async function deleteList(listId: number): Promise<{ msg: string }> {
  const client = await getClient();
  const response = await client.delete(`/api/lists/${listId}`);
  return response.data;
}

export async function getListSize(listId: number): Promise<number> {
  const client = await getClient();
  const response = await client.get(`/api/lists/${listId}/size`);
  return response.data.size || 0;
}

export async function subscribeToList(listId: number, subscribers: Array<{
  email: string;
  dataFields?: Record<string, unknown>;
}>): Promise<{ successCount: number; failCount: number }> {
  const client = await getClient();
  const response = await client.post('/api/lists/subscribe', {
    listId,
    subscribers,
  });
  return response.data;
}

export async function unsubscribeFromList(listId: number, subscribers: Array<{
  email: string;
}>): Promise<{ successCount: number; failCount: number }> {
  const client = await getClient();
  const response = await client.post('/api/lists/unsubscribe', {
    listId,
    subscribers,
  });
  return response.data;
}

export async function getListUsers(listId: number): Promise<string[]> {
  const client = await getClient();
  const response = await client.get('/api/lists/getUsers', {
    params: { listId },
  });
  return response.data;
}

export async function previewListUsers(listId: number): Promise<Array<{ email: string }>> {
  const client = await getClient();
  const response = await client.get('/api/lists/previewUsers', {
    params: { listId },
  });
  return response.data.users || [];
}
