import axios, { AxiosInstance, AxiosError } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Only redirect on 401 for authenticated routes
    if (error.response?.status === 401) {
      const isAdminRoute = window.location.pathname.startsWith('/admin')
      if (isAdminRoute && !window.location.pathname.includes('/admin/login')) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/admin/login'
      }
    }
    // Silently reject without console logging for connection errors
    return Promise.reject(error)
  }
)

// API Types
export interface User {
  id: number
  email: string
  name: string
  role: string
  is_active: boolean
  last_login: string | null
  created_at: string
}

export interface Page {
  id: number
  title: string
  slug: string
  content?: string
  meta_title: string | null
  meta_description: string | null
  meta_keywords: string | null
  featured_image: string | null
  is_published: boolean
  sort_order: number
  template: string
  created_at: string
  updated_at: string
}

export interface Service {
  id: number
  title: string
  slug: string
  short_description: string | null
  description?: string
  icon: string | null
  featured_image: string | null
  features: string[]
  meta_title: string | null
  meta_description: string | null
  is_featured: boolean
  is_published: boolean
  sort_order: number
  display_order: number
  created_at: string
  updated_at: string
}

export interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string | null
  content?: string
  featured_image: string | null
  category: string | null
  tags: string[]
  meta_title: string | null
  meta_description: string | null
  is_published: boolean
  status?: 'draft' | 'published'
  published_at: string | null
  views: number
  created_at: string
  updated_at: string
  author: string | null
}

export interface Lead {
  id: number
  name: string
  email: string
  phone: string | null
  organization: string | null
  message: string
  preferred_contact_time: string | null
  service_interest: string | null
  source: string
  status: string
  notes: string | null
  privacy_accepted: boolean
  email_sent: boolean
  created_at: string
  updated_at: string
}

export interface ContactFormData {
  name: string
  email: string
  phone?: string
  organization?: string
  message: string
  preferred_contact_time?: string
  service_interest?: string
  privacy_accepted: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  pages: number
  current_page: number
  per_page: number
  has_next: boolean
  has_prev: boolean
}

// Dashboard Stats Interface
export interface DashboardStats {
  leads_count: number
  new_leads_count: number
  posts_count: number
  services_count: number
  pages_count: number
  recent_leads: Lead[]
  recent_posts: BlogPost[]
}

// Setting Interface
export interface Setting {
  id?: number
  key: string
  value: string
  description?: string
  category?: string
  type?: string
}

// Create Service Data
export interface CreateServiceData {
  title: string
  short_description?: string
  description?: string
  icon?: string
  // When used in the admin form `features` is edited as a newline-separated string,
  // so allow either a string (textarea) or an array of strings (API payload).
  features?: string | string[]
  is_featured?: boolean
  display_order?: number
  meta_title?: string
  meta_description?: string
}

// Create Lead Data
export interface CreateLeadData {
  name: string
  email: string
  phone?: string
  organization?: string
  message: string
  source?: string
}

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },
  signup: async (data: { name: string; email: string; password: string }) => {
    const response = await api.post('/auth/signup', data)
    return response.data
  },
  logout: async () => {
    const response = await api.post('/auth/logout')
    return response.data
  },
  me: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },
  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.post('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    })
    return response.data
  },
}

// Pages API
export const pagesApi = {
  getAll: async () => {
    const response = await api.get('/pages')
    return response.data.pages as Page[]
  },
  getBySlug: async (slug: string) => {
    const response = await api.get(`/pages/${slug}`)
    return response.data.page as Page
  },
  // Admin
  adminGetAll: async () => {
    const response = await api.get('/pages/admin')
    return response.data.pages as Page[]
  },
  adminGet: async (id: number) => {
    const response = await api.get(`/pages/admin/${id}`)
    return response.data.page as Page
  },
  create: async (data: Partial<Page>) => {
    const response = await api.post('/pages/admin', data)
    return response.data
  },
  update: async (id: number, data: Partial<Page>) => {
    const response = await api.put(`/pages/admin/${id}`, data)
    return response.data
  },
  delete: async (id: number) => {
    const response = await api.delete(`/pages/admin/${id}`)
    return response.data
  },
}

// Services API
export const servicesApi = {
  getAll: async () => {
    const response = await api.get('/services')
    return response.data.services as Service[]
  },
  getFeatured: async () => {
    const response = await api.get('/services/featured')
    return response.data.services as Service[]
  },
  getBySlug: async (slug: string) => {
    const response = await api.get(`/services/${slug}`)
    return response.data.service as Service
  },
  // Admin
  adminGetAll: async () => {
    const response = await api.get('/services/admin')
    return response.data.services as Service[]
  },
  adminGet: async (id: number) => {
    const response = await api.get(`/services/admin/${id}`)
    return response.data.service as Service
  },
  create: async (data: Partial<Service>) => {
    const response = await api.post('/services/admin', data)
    return response.data
  },
  update: async (id: number, data: Partial<Service>) => {
    const response = await api.put(`/services/admin/${id}`, data)
    return response.data
  },
  delete: async (id: number) => {
    const response = await api.delete(`/services/admin/${id}`)
    return response.data
  },
}

// Blog API
export const blogApi = {
  getAll: async (page = 1, perPage = 10, category?: string) => {
    const params = new URLSearchParams({ page: String(page), per_page: String(perPage) })
    if (category) params.append('category', category)
    const response = await api.get(`/blog?${params}`)
    return response.data
  },
  getCategories: async () => {
    const response = await api.get('/blog/categories')
    return response.data.categories as string[]
  },
  getRecent: async (limit = 5) => {
    const response = await api.get(`/blog/recent?limit=${limit}`)
    return response.data.posts as BlogPost[]
  },
  getBySlug: async (slug: string) => {
    const response = await api.get(`/blog/${slug}`)
    return response.data.post as BlogPost
  },
  // Admin
  adminGetAll: async (page = 1, perPage = 20) => {
    const response = await api.get(`/blog/admin?page=${page}&per_page=${perPage}`)
    return response.data
  },
  adminGet: async (id: number) => {
    const response = await api.get(`/blog/admin/${id}`)
    return response.data.post as BlogPost
  },
  create: async (data: Partial<BlogPost>) => {
    const response = await api.post('/blog/admin', data)
    return response.data
  },
  update: async (id: number, data: Partial<BlogPost>) => {
    const response = await api.put(`/blog/admin/${id}`, data)
    return response.data
  },
  delete: async (id: number) => {
    const response = await api.delete(`/blog/admin/${id}`)
    return response.data
  },
}

// Leads API
export const leadsApi = {
  submit: async (data: ContactFormData) => {
    const response = await api.post('/contact', data)
    return response.data
  },
  create: async (data: CreateLeadData) => {
    const response = await api.post('/contact', data)
    return response.data
  },
  // Admin
  getAll: async (page = 1, status?: string) => {
    const params = new URLSearchParams({ page: String(page), per_page: '20' })
    if (status) params.append('status', status)
    const response = await api.get(`/contact/admin?${params}`)
    return response.data.leads as Lead[]
  },
  get: async (id: number) => {
    const response = await api.get(`/contact/admin/${id}`)
    return response.data.lead as Lead
  },
  update: async (id: number, data: { status?: string; notes?: string }) => {
    const response = await api.put(`/contact/admin/${id}`, data)
    return response.data
  },
  updateStatus: async (id: number, status: string) => {
    const response = await api.put(`/contact/admin/${id}`, { status })
    return response.data
  },
  delete: async (id: number) => {
    const response = await api.delete(`/contact/admin/${id}`)
    return response.data
  },
  export: async (status?: string) => {
    const params = status ? `?status=${status}` : ''
    const response = await api.get(`/contact/admin/export${params}`, {
      responseType: 'blob',
    })
    return response.data
  },
  exportCSV: async () => {
    const response = await api.get('/contact/admin/export', {
      responseType: 'blob',
    })
    return response.data
  },
  getStats: async () => {
    const response = await api.get('/contact/admin/stats')
    return response.data
  },
}

// Admin API
export const adminApi = {
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard')
    return response.data as DashboardStats
  },
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard')
    return response.data as DashboardStats
  },
  getUsers: async () => {
    const response = await api.get('/admin/users')
    return response.data.users as User[]
  },
  approveUser: async (id: number) => {
    const response = await api.put(`/admin/users/${id}/approve`)
    return response.data
  },
  createUser: async (data: { email: string; password: string; name: string; role?: string }) => {
    const response = await api.post('/admin/users', data)
    return response.data
  },
  updateUser: async (id: number, data: Partial<User> & { password?: string }) => {
    const response = await api.put(`/admin/users/${id}`, data)
    return response.data
  },
  deleteUser: async (id: number) => {
    const response = await api.delete(`/admin/users/${id}`)
    return response.data
  },
}

// Settings API
export const settingsApi = {
  getPublic: async () => {
    const response = await api.get('/settings/public')
    return response.data.settings
  },
  getAll: async () => {
    const response = await api.get('/settings/admin')
    // Backend returns { settings: { grouped }, all: [...flat array] }
    return response.data.all as Setting[]
  },
  update: async (key: string, value: string) => {
    const response = await api.post('/settings/admin', { settings: { [key]: value } })
    return response.data
  },
  updateAll: async (settings: Record<string, string>) => {
    const response = await api.post('/settings/admin', { settings })
    return response.data
  },
}

export default api

// MIS Templates API
export const misApi = {
  listTemplates: async () => {
    const response = await api.get('/admin/mis/templates')
    return response.data.templates
  },
  createTemplate: async (data: { name: string; columns: any[] }) => {
    const response = await api.post('/admin/mis/templates', data)
    return response.data.template
  },
  getTemplate: async (id: number) => {
    const response = await api.get(`/admin/mis/templates/${id}`)
    return response.data.template
  },
  updateTemplate: async (id: number, data: any) => {
    const response = await api.put(`/admin/mis/templates/${id}`, data)
    return response.data.template
  },
  deleteTemplate: async (id: number) => {
    const response = await api.delete(`/admin/mis/templates/${id}`)
    return response.data
  },
  listRows: async (id: number) => {
    const response = await api.get(`/admin/mis/templates/${id}/rows`)
    return response.data.rows
  },
  importFile: async (id: number, file: File, format?: string) => {
    const fd = new FormData()
    fd.append('file', file)
    if (format) fd.append('format', format)
    const response = await api.post(`/admin/mis/templates/${id}/import`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    return response.data
  },
  exportFile: async (id: number, format = 'csv') => {
    const response = await api.get(`/admin/mis/templates/${id}/export?format=${format}`, { responseType: 'blob' })
    return response
  }
}
