export type ApiRole = 'admin' | 'client';

export type ApiUser = {
  id: string;
  role: ApiRole;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
};

export type ApiNewsItem = {
  id: string;
  title: string;
  date: string;
  excerpt: string;
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
    throw new Error(body?.error || `API request failed: ${response.status}`);
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
  const body = await request<{ message: string }>('/api/auth/reset', {
    method: 'POST',
    body: JSON.stringify({ email })
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
