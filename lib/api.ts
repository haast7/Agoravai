'use client'

const API_BASE = '/api'

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }))
    
    // Criar erro com detalhes preservados
    const error: any = new Error(errorData.error || 'Erro na requisição')
    error.response = {
      status: response.status,
      data: errorData,
    }
    
    throw error
  }

  return response.json()
}

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    apiRequest<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (email: string, password: string, name?: string) =>
    apiRequest<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }),
}

// Domains
export const domainsApi = {
  list: () => apiRequest<any[]>('/domains'),
  create: (url: string) =>
    apiRequest<any>('/domains', {
      method: 'POST',
      body: JSON.stringify({ url }),
    }),
  delete: (id: string) =>
    apiRequest<{ success: boolean }>(`/domains/${id}`, {
      method: 'DELETE',
    }),
}

// Pixels
export const pixelsApi = {
  list: () => apiRequest<any[]>('/pixels'),
  create: (name: string, pixelId: string, accessToken: string) =>
    apiRequest<any>('/pixels', {
      method: 'POST',
      body: JSON.stringify({ name, pixelId, accessToken }),
    }),
  update: (id: string, data: { name?: string; pixelId?: string; accessToken?: string }) =>
    apiRequest<any>(`/pixels/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest<{ success: boolean }>(`/pixels/${id}`, {
      method: 'DELETE',
    }),
  test: (id: string) =>
    apiRequest<{ success: boolean }>(`/pixels/${id}/test`, {
      method: 'POST',
    }),
}

// Channels
export const channelsApi = {
  list: () => apiRequest<any[]>('/channels'),
  create: (
    name: string,
    botName: string,
    botToken: string,
    channelId?: string,
    channelType?: 'private' | 'public'
  ) =>
    apiRequest<any>('/channels', {
      method: 'POST',
      body: JSON.stringify({
        name,
        botName,
        botToken,
        ...(channelId && { channelId }),
        ...(channelType && { channelType }),
      }),
    }),
  update: (id: string, data: { channelId?: string; channelType?: string }) =>
    apiRequest<any>(`/channels/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest<{ success: boolean }>(`/channels/${id}`, {
      method: 'DELETE',
    }),
  getStatus: (id: string) => apiRequest<any>(`/channels/${id}/status`),
}

// Funnels
export const funnelsApi = {
  list: () => apiRequest<any[]>('/funnels'),
  get: (id: string) => apiRequest<any>(`/funnels/${id}`),
  create: (data: {
    name: string
    pixelId: string
    domainId: string
    channelId: string
    requestEntry?: boolean
    urls: string[]
  }) =>
    apiRequest<any>('/funnels', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest<{ success: boolean }>(`/funnels/${id}`, {
      method: 'DELETE',
    }),
  getInstructions: (id: string) =>
    apiRequest<{ script: string; scriptUrl: string; telegramLink: string }>(
      `/funnels/${id}/instructions`
    ),
}

// Postbacks
export const postbacksApi = {
  list: () => apiRequest<any[]>('/postbacks'),
  create: (data: {
    name: string
    url: string
    type: string
    pixelId?: string
    funnelId?: string
  }) =>
    apiRequest<any>('/postbacks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: { name?: string; url?: string; type?: string }) =>
    apiRequest<any>(`/postbacks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest<{ success: boolean }>(`/postbacks/${id}`, {
      method: 'DELETE',
    }),
  test: (id: string) =>
    apiRequest<{ 
      success: boolean
      status?: number
      statusText?: string
      error?: string
      message?: string
      responseBody?: string | null
    }>(
      `/postbacks/${id}/test`,
      {
        method: 'POST',
      }
    ),
}

// Analytics
export const analyticsApi = {
  getDashboard: (params?: {
    funnelId?: string
    pixelId?: string
    startDate?: string
    endDate?: string
  }) => {
    const query = new URLSearchParams()
    if (params?.funnelId) query.set('funnelId', params.funnelId)
    if (params?.pixelId) query.set('pixelId', params.pixelId)
    if (params?.startDate) query.set('startDate', params.startDate)
    if (params?.endDate) query.set('endDate', params.endDate)
    return apiRequest<any>(`/analytics/dashboard?${query.toString()}`)
  },
  getChart: (params: {
    type: string
    funnelId?: string
    pixelId?: string
    startDate?: string
    endDate?: string
  }) => {
    const query = new URLSearchParams()
    query.set('type', params.type)
    if (params.funnelId) query.set('funnelId', params.funnelId)
    if (params.pixelId) query.set('pixelId', params.pixelId)
    if (params.startDate) query.set('startDate', params.startDate)
    if (params.endDate) query.set('endDate', params.endDate)
    return apiRequest<any[]>(`/analytics/chart?${query.toString()}`)
  },
  getRetention: (params?: {
    funnelId?: string
    pixelId?: string
    startDate?: string
    endDate?: string
  }) => {
    const query = new URLSearchParams()
    if (params?.funnelId) query.set('funnelId', params.funnelId)
    if (params?.pixelId) query.set('pixelId', params.pixelId)
    if (params?.startDate) query.set('startDate', params.startDate)
    if (params?.endDate) query.set('endDate', params.endDate)
    return apiRequest<any[]>(`/analytics/retention?${query.toString()}`)
  },
}



