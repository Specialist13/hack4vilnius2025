/**
 * API Utility Module
 * Centralized API configuration and helper functions for backend communication
 */

// Base API URL - can be configured via environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

/**
 * Storage keys for authentication
 */
export const AUTH_TOKEN_KEY = 'authToken'
export const USER_DATA_KEY = 'userData'

/**
 * Get authentication token from localStorage
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

/**
 * Set authentication token in localStorage
 */
export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(AUTH_TOKEN_KEY, token)
}

/**
 * Remove authentication token from localStorage
 */
export function removeAuthToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(USER_DATA_KEY)
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken()
}

/**
 * Get user data from localStorage
 */
export function getUserData(): any | null {
  if (typeof window === 'undefined') return null
  const data = localStorage.getItem(USER_DATA_KEY)
  return data ? JSON.parse(data) : null
}

/**
 * Set user data in localStorage
 */
export function setUserData(user: any): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(user))
}

/**
 * API Error class
 */
export class APIError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: any
  ) {
    super(`API Error ${status}: ${statusText}`)
    this.name = 'APIError'
  }
}

/**
 * Make an authenticated API request
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  // Prepare headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  // Merge with provided headers
  if (options.headers) {
    Object.entries(options.headers).forEach(([key, value]) => {
      if (typeof value === 'string') {
        headers[key] = value
      }
    })
  }

  // Add authentication token if available
  const token = getAuthToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  // Make the request
  const response = await fetch(url, {
    ...options,
    headers,
  })

  // Parse response
  let data: any
  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    data = await response.json()
  } else {
    data = await response.text()
  }

  // Handle errors
  if (!response.ok) {
    throw new APIError(response.status, response.statusText, data)
  }

  return data
}

/**
 * Authentication API
 */
export const authAPI = {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  register: async (data: {
    email: string
    password: string
    name: string
    address?: string
  }) => {
    const response = await apiRequest<{
      code: string
      email: string
      name: string
      address?: string
      createdAt: string
    }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response
  },

  /**
   * Login user
   * POST /api/auth/login
   */
  login: async (data: { email: string; password: string }) => {
    const response = await apiRequest<{ accessToken: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response
  },
}

/**
 * User API
 */
export const userAPI = {
  /**
   * Get user profile
   * GET /api/users
   */
  getProfile: async () => {
    return apiRequest<{
      code: string
      email: string
      name: string
      address?: string
      image?: string
      createdAt: string
      updatedAt: string
    }>('/api/users', {
      method: 'GET',
    })
  },

  /**
   * Update user profile (full update)
   * PUT /api/users
   */
  updateProfile: async (data: {
    name?: string
    address?: string
    image?: string
  }) => {
    return apiRequest('/api/users', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  /**
   * Partially update user profile
   * PATCH /api/users
   */
  partialUpdateProfile: async (data: {
    name?: string
    address?: string
    image?: string
  }) => {
    return apiRequest('/api/users', {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },
}

/**
 * Forum API (based on common patterns, may need backend implementation)
 */
export const forumAPI = {
  /**
   * Get all posts
   */
  getPosts: async () => {
    return apiRequest('/api/posts', {
      method: 'GET',
    })
  },

  /**
   * Get a single post by ID
   */
  getPost: async (postId: string) => {
    return apiRequest(`/api/posts/${postId}`, {
      method: 'GET',
    })
  },

  /**
   * Create a new post
   */
  createPost: async (data: {
    title: string
    content: string
    address: string
    status: string
    language: string
    coordinates: { lat: number; lng: number }
  }) => {
    return apiRequest('/api/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  /**
   * Get replies for a post
   */
  getReplies: async (postId: string) => {
    return apiRequest(`/api/posts/${postId}/replies`, {
      method: 'GET',
    })
  },

  /**
   * Create a reply to a post
   */
  createReply: async (postId: string, data: { content: string }) => {
    return apiRequest(`/api/posts/${postId}/replies`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  /**
   * Like a post
   */
  likePost: async (postId: string) => {
    return apiRequest(`/api/posts/${postId}/like`, {
      method: 'POST',
    })
  },

  /**
   * Like a reply
   */
  likeReply: async (postId: string, replyId: string) => {
    return apiRequest(`/api/posts/${postId}/replies/${replyId}/like`, {
      method: 'POST',
    })
  },
}

/**
 * Map API (based on common patterns, may need backend implementation)
 */
export const mapAPI = {
  /**
   * Get map statistics
   */
  getStats: async () => {
    return apiRequest('/api/map/stats', {
      method: 'GET',
    })
  },
}

/**
 * AI Consultant API (based on common patterns, may need backend implementation)
 */
export const aiAPI = {
  /**
   * Analyze user message and provide AI recommendations
   */
  analyze: async (data: {
    message: string
    userLocation?: { address: string; coordinates: { lat: number; lng: number } }
  }) => {
    return apiRequest('/api/ai-consultant/analyze', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}
