import { getClient } from './client.js';
import type { User, UserUpdateRequest, Event } from './types.js';

export async function getUser(email: string): Promise<User> {
  const client = await getClient();
  const response = await client.get(`/api/users/${encodeURIComponent(email)}`);
  return response.data.user;
}

export async function getUserById(userId: string): Promise<User> {
  const client = await getClient();
  const response = await client.get(`/api/users/byUserId/${encodeURIComponent(userId)}`);
  return response.data.user;
}

export async function updateUser(request: UserUpdateRequest): Promise<{ msg: string }> {
  const client = await getClient();
  const response = await client.post('/api/users/update', request);
  return response.data;
}

export async function bulkUpdateUsers(users: UserUpdateRequest[]): Promise<{ msg: string }> {
  const client = await getClient();
  const response = await client.post('/api/users/bulkUpdate', { users });
  return response.data;
}

export async function deleteUser(email: string): Promise<{ msg: string }> {
  const client = await getClient();
  const response = await client.delete(`/api/users/${encodeURIComponent(email)}`);
  return response.data;
}

export async function deleteUserById(userId: string): Promise<{ msg: string }> {
  const client = await getClient();
  const response = await client.delete(`/api/users/byUserId/${encodeURIComponent(userId)}`);
  return response.data;
}

export async function getUserEvents(email: string, limit?: number): Promise<Event[]> {
  const client = await getClient();
  const params: Record<string, string | number> = {};
  if (limit) params.limit = limit;

  const response = await client.get(`/api/events/${encodeURIComponent(email)}`, { params });
  return response.data.events || [];
}

export async function getUserEventsByUserId(userId: string, limit?: number): Promise<Event[]> {
  const client = await getClient();
  const params: Record<string, string | number> = {};
  if (limit) params.limit = limit;

  const response = await client.get(`/api/events/byUserId/${encodeURIComponent(userId)}`, { params });
  return response.data.events || [];
}

export async function getFields(): Promise<string[]> {
  const client = await getClient();
  const response = await client.get('/api/users/getFields');
  return response.data.fields || [];
}

export async function updateSubscriptions(email: string, subscriptions: {
  emailListIds?: number[];
  unsubscribedChannelIds?: number[];
  unsubscribedMessageTypeIds?: number[];
}): Promise<{ msg: string }> {
  const client = await getClient();
  const response = await client.post('/api/users/updateSubscriptions', {
    email,
    ...subscriptions,
  });
  return response.data;
}
