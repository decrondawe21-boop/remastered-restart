export type ApiRole = 'admin' | 'editor' | 'client' | 'user';

export type ApiUser = {
  id: string;
  role: ApiRole;
  name: string;
  email: string;
  phone: string;
  isActive?: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
};

export type ApiNewsItem = {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  body?: string;
};

export type ApiNewsLike = {
  newsId: string;
  count: number;
  likedByMe: boolean;
};

export type ApiNewsComment = {
  id: string;
  newsId: string;
  parentId: string | null;
  authorId: string;
  authorName: string;
  authorRole: ApiRole;
  body: string;
  createdAt: string;
  updatedAt: string;
  canEdit: boolean;
  canDelete: boolean;
};

export type ApiHomeSlide = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaLabel: string;
  ctaHref: string;
  sortOrder: number;
  isActive: boolean;
};

export type ApiClientRecord = {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  targetGroup: string | null;
  program: string;
  status: string;
  notes: string | null;
  createdAt: string;
};

export type ApiFormField = {
  key: string;
  label: string;
  rows?: number;
};

export type ApiFormTemplate = {
  id: string;
  title: string;
  description: string;
  fields: ApiFormField[];
  fileUrl?: string;
  folder?: string;
  sourceNote?: string;
  sizeBytes?: number;
  isActive: boolean;
};

export type ApiManagedUser = Required<Pick<ApiUser, 'id' | 'role' | 'name' | 'email' | 'phone' | 'createdAt'>> & {
  isActive: boolean;
  lastLoginAt: string | null;
};

export type ApiMediaFile = {
  id: string;
  title: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  category: string;
  altText: string;
  uploadedBy: string | null;
  createdAt: string;
};

export type ApiClientDocument = {
  id: string;
  clientId: string | null;
  userId: string | null;
  mediaId: string | null;
  title: string;
  documentType: string;
  status: string;
  fileUrl: string;
  notes: string;
  signedAt: string | null;
  createdAt: string;
};

export type ApiNotification = {
  id: string;
  recipientId: string | null;
  title: string;
  body: string;
  tone: string;
  category: string;
  linkHref: string;
  readAt: string | null;
  createdAt: string;
};

export type ApiPasswordResetRequest = {
  ok: boolean;
  message: string;
  expiresInMinutes?: number;
  resetToken?: string;
  resetUrl?: string;
};

export class ApiRequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    ...options,
    credentials: 'include',
    headers: {
      'content-type': 'application/json',
      ...(options.headers || {})
    }
  });
  const body = (await response.json().catch(() => null)) as T & { error?: string };
  if (!response.ok) {
    throw new ApiRequestError(body?.error || `API request failed: ${response.status}`, response.status);
  }
  return body;
}

export async function getSession() {
  const body = await request<{ user: ApiUser | null }>('/api/auth/me');
  return body.user;
}

export async function loginUser(email: string, password: string, role: ApiRole) {
  const body = await request<{ user: ApiUser }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, role })
  });
  return body.user;
}

export async function registerClient(name: string, email: string, phone: string, password: string) {
  const body = await request<{ user: ApiUser }>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, phone, password })
  });
  return body.user;
}

export async function logoutUser() {
  await request<{ ok: boolean }>('/api/auth/logout', { method: 'POST' });
}

export async function requestPasswordReset(email: string) {
  return request<ApiPasswordResetRequest>('/api/auth/reset', {
    method: 'POST',
    body: JSON.stringify({ email })
  });
}

export async function confirmPasswordReset(token: string, password: string) {
  const body = await request<{ ok: boolean; message: string }>('/api/auth/reset/confirm', {
    method: 'POST',
    body: JSON.stringify({ token, password })
  });
  return body.message;
}

export async function listNews() {
  const body = await request<{ news: ApiNewsItem[] }>('/api/news');
  return body.news;
}

export async function saveNews(news: ApiNewsItem) {
  const body = await request<{ news: ApiNewsItem }>('/api/news', {
    method: 'POST',
    body: JSON.stringify(news)
  });
  return body.news;
}

export async function deleteNews(newsId: string) {
  await request<{ ok: boolean; id: string }>(`/api/news/${encodeURIComponent(newsId)}`, {
    method: 'DELETE'
  });
}

export async function listNewsDiscussion() {
  return request<{ likes: ApiNewsLike[]; comments: ApiNewsComment[] }>('/api/news/discussion');
}

export async function toggleNewsLike(newsId: string) {
  const body = await request<{ like: ApiNewsLike }>(`/api/news/${encodeURIComponent(newsId)}/like`, {
    method: 'POST'
  });
  return body.like;
}

export async function addNewsComment(newsId: string, text: string, parentId?: string | null) {
  const body = await request<{ comment: ApiNewsComment }>(`/api/news/${encodeURIComponent(newsId)}/comments`, {
    method: 'POST',
    body: JSON.stringify({ body: text, parentId: parentId || null })
  });
  return body.comment;
}

export async function updateNewsComment(commentId: string, text: string) {
  const body = await request<{ comment: ApiNewsComment }>(`/api/comments/${encodeURIComponent(commentId)}`, {
    method: 'PATCH',
    body: JSON.stringify({ body: text })
  });
  return body.comment;
}

export async function deleteNewsComment(commentId: string) {
  await request<{ ok: boolean; id: string }>(`/api/comments/${encodeURIComponent(commentId)}`, {
    method: 'DELETE'
  });
}

export async function listSlides() {
  const body = await request<{ slides: ApiHomeSlide[] }>('/api/slides');
  return body.slides;
}

export async function saveSlide(slide: ApiHomeSlide) {
  const body = await request<{ slide: ApiHomeSlide }>('/api/slides', {
    method: 'POST',
    body: JSON.stringify(slide)
  });
  return body.slide;
}

export async function listClients() {
  const body = await request<{ clients: ApiClientRecord[] }>('/api/clients');
  return body.clients;
}

export async function saveClient(client: Omit<ApiClientRecord, 'createdAt'> & { createdAt?: string }) {
  const body = await request<{ client: ApiClientRecord }>('/api/clients', {
    method: 'POST',
    body: JSON.stringify(client)
  });
  return body.client;
}

export async function listFormTemplates() {
  const body = await request<{ templates: ApiFormTemplate[] }>('/api/forms/templates');
  return body.templates;
}

export async function listUsers() {
  const body = await request<{ users: ApiManagedUser[] }>('/api/admin/users');
  return body.users;
}

export async function updateUser(user: Pick<ApiManagedUser, 'id' | 'role' | 'isActive'>) {
  const body = await request<{ user: ApiManagedUser }>(`/api/admin/users/${encodeURIComponent(user.id)}`, {
    method: 'PATCH',
    body: JSON.stringify({ role: user.role, isActive: user.isActive })
  });
  return body.user;
}

export async function listMedia() {
  const body = await request<{ media: ApiMediaFile[] }>('/api/media');
  return body.media;
}

export async function saveMedia(media: Omit<ApiMediaFile, 'createdAt' | 'uploadedBy'> & { createdAt?: string; uploadedBy?: string | null }) {
  const body = await request<{ media: ApiMediaFile }>('/api/media', {
    method: 'POST',
    body: JSON.stringify(media)
  });
  return body.media;
}

export async function listDocuments() {
  const body = await request<{ documents: ApiClientDocument[] }>('/api/documents');
  return body.documents;
}

export async function saveDocument(document: Omit<ApiClientDocument, 'createdAt'> & { createdAt?: string }) {
  const body = await request<{ document: ApiClientDocument }>('/api/documents', {
    method: 'POST',
    body: JSON.stringify(document)
  });
  return body.document;
}

export async function listNotifications() {
  const body = await request<{ notifications: ApiNotification[] }>('/api/notifications');
  return body.notifications;
}

export async function saveNotification(notification: Omit<ApiNotification, 'createdAt' | 'readAt'> & { createdAt?: string; readAt?: string | null }) {
  const body = await request<{ notification: ApiNotification }>('/api/notifications', {
    method: 'POST',
    body: JSON.stringify(notification)
  });
  return body.notification;
}

export async function markNotificationRead(notificationId: string) {
  await request<{ ok: boolean; id: string }>(`/api/notifications/${encodeURIComponent(notificationId)}/read`, {
    method: 'PATCH'
  });
}
