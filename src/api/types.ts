// Campaign Types
export interface Campaign {
  id: number;
  createdAt: number;
  updatedAt: number;
  name: string;
  templateId: number;
  messageMedium: 'Email' | 'Push' | 'SMS' | 'InApp' | 'WebPush';
  createdByUserId: string;
  updatedByUserId: string;
  campaignState: 'Draft' | 'Running' | 'Finished' | 'Cancelled';
  listIds: number[];
  labels: string[];
  type: 'Blast' | 'Triggered' | 'Proof';
}

export interface CampaignsResponse {
  campaigns: Campaign[];
}

export interface CampaignMetrics {
  id: number;
  name: string;
  sendCount?: number;
  openCount?: number;
  clickCount?: number;
  unsubscribeCount?: number;
  bounceCount?: number;
  complaintCount?: number;
}

// User Types
export interface User {
  email: string;
  userId?: string;
  dataFields?: Record<string, unknown>;
  signupDate?: number;
  signupSource?: string;
  emailListIds?: number[];
  unsubscribedChannelIds?: number[];
  unsubscribedMessageTypeIds?: number[];
}

export interface UserResponse {
  user: User;
}

export interface UserUpdateRequest {
  email: string;
  userId?: string;
  dataFields?: Record<string, unknown>;
  mergeNestedObjects?: boolean;
}

// List Types
export interface List {
  id: number;
  name: string;
  createdAt: number;
  listType: 'Standard' | 'Newsletter';
}

export interface ListsResponse {
  lists: List[];
}

export interface ListSubscribeRequest {
  listId: number;
  subscribers: Array<{
    email: string;
    dataFields?: Record<string, unknown>;
  }>;
}

// Template Types
export interface Template {
  templateId: number;
  createdAt: number;
  updatedAt: number;
  name: string;
  creatorUserId: string;
  messageTypeId: number;
}

export interface TemplatesResponse {
  templates: Template[];
}

export interface EmailTemplate extends Template {
  subject?: string;
  fromEmail?: string;
  fromName?: string;
  html?: string;
  plainText?: string;
}

export interface PushTemplate extends Template {
  title?: string;
  message?: string;
  sound?: string;
  badge?: string;
  deepLink?: string;
}

// Event Types
export interface Event {
  email?: string;
  userId?: string;
  eventName: string;
  createdAt: number;
  dataFields?: Record<string, unknown>;
}

export interface TrackEventRequest {
  email?: string;
  userId?: string;
  eventName: string;
  dataFields?: Record<string, unknown>;
  campaignId?: number;
  templateId?: number;
}

// Journey Types
export interface Journey {
  id: number;
  name: string;
  description: string;
  createdAt: number;
  updatedAt: number;
  journeyType: 'Draft' | 'Published' | 'Stopped';
  creatorUserId: string;
  enabled: boolean;
  startTileId: number;
  triggerEventNames: string[];
  isArchived: boolean;
  simultaneousLimit: number;
  lifetimeLimit?: number;
}

export interface JourneysResponse {
  journeys: Journey[];
  totalJourneysCount: number;
}

export interface TriggerWorkflowRequest {
  workflowId: number;
  email?: string;
  userId?: string;
  listId?: number;
  dataFields?: Record<string, unknown>;
}

// Send Types
export interface SendEmailRequest {
  campaignId?: number;
  recipientEmail: string;
  recipientUserId?: string;
  dataFields?: Record<string, unknown>;
  sendAt?: string;
  allowRepeatMarketingSends?: boolean;
}

export interface SendPushRequest {
  campaignId: number;
  recipientEmail?: string;
  recipientUserId?: string;
  dataFields?: Record<string, unknown>;
  sendAt?: string;
}

export interface SendSmsRequest {
  campaignId: number;
  recipientEmail?: string;
  recipientUserId?: string;
  dataFields?: Record<string, unknown>;
  sendAt?: string;
}

// API Response Types
export interface ApiSuccessResponse {
  msg: string;
  code: string;
  params?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  msg: string;
  code: string;
  params?: Record<string, unknown>;
}
