const BASE_URL = 'http://localhost:8000/api';
const TOKEN_KEY = 'mapper-portal:token';

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    removeToken();
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed: ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export interface AuthResponse {
  user: { id: number; name: string; email: string; role: string };
  token: string;
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  rejectedTasks: number;
  performanceScore: number;
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }).then((res) => {
        setToken(res.token);
        return res;
      }),

    me: () => request<{ id: number; name: string; email: string; role: string }>('/auth/me'),

    logout: () => {
      removeToken();
    },
  },

  dashboard: {
    getStats: () => request<DashboardStats>('/mapper/dashboard'),
  },

  tasks: {
    list: (params?: { status?: string; priority?: string }) => {
      const query = new URLSearchParams();
      if (params?.status) query.set('status', params.status);
      if (params?.priority) query.set('priority', params.priority);
      const qs = query.toString();
      return request<any[]>(`/tasks${qs ? `?${qs}` : ''}`);
    },

    get: (id: string) => request<any>(`/tasks/${id}`),

    update: (id: string, data: Record<string, any>) =>
      request<any>(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

    create: (data: Record<string, any>) =>
      request<any>('/tasks', { method: 'POST', body: JSON.stringify(data) }),
  },

  vendorRegistrations: {
    list: () => request<any[]>('/vendor-registrations'),

    create: (data: Record<string, any>) =>
      request<any>('/vendor-registrations', { method: 'POST', body: JSON.stringify(data) }),

    update: (id: string, data: Record<string, any>) =>
      request<any>(`/vendor-registrations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  },

  shopLocations: {
    list: () => request<any[]>('/shop-locations'),

    create: (data: Record<string, any>) =>
      request<any>('/shop-locations', { method: 'POST', body: JSON.stringify(data) }),

    update: (id: string, data: Record<string, any>) =>
      request<any>(`/shop-locations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  },

  verificationQueue: {
    list: () => request<any[]>('/verification-queue'),

    update: (id: string, data: Record<string, any>) =>
      request<any>(`/verification-queue/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  },

  messages: {
    list: () => request<any[]>('/messages'),

    send: (data: Record<string, any>) =>
      request<any>('/messages', { method: 'POST', body: JSON.stringify(data) }),
  },

  notifications: {
    list: () => request<any[]>('/notifications'),

    markRead: (id: string) =>
      request<any>(`/notifications/${id}`, { method: 'PUT' }),
  },

  shops: {
    list: () => request<any[]>('/shops'),
  },

  hasToken: () => !!getToken(),
};
