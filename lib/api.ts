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
 * Custom API Error class
 */
export class APIError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data: any,
    public url?: string
  ) {
    super(`API Error ${status}: ${statusText}`)
    this.name = 'APIError'
  }
}

/**
 * System API
 */
export const systemAPI = {
  /**
   * Health check
   * GET /health
   */
  health: async () => {
    return apiRequest<{
      status: string
      message: string
    }>('/health', {
      method: 'GET',
    })
  },
}

/**
 * Make an API request with authentication
 */
async function apiRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  // Default headers
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
    // include the full request URL to make 404s easier to trace
    throw new APIError(response.status, response.statusText, data, url)
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

  /**
   * Soft delete user
   * DELETE /api/users
   * Returns 204 (no content) on success
   */
  deleteUser: async () => {
    return apiRequest<void>('/api/users', {
      method: 'DELETE',
    })
  },
}

/**
 * Forum API - Matches OpenAPI specification
 */
export const forumAPI = {
  /**
   * Get paginated forums
   * GET /api/forums?page=1&limit=10
   */
  getForums: async (page: number = 1, limit: number = 10) => {
    return apiRequest<{
      forums: Array<{
        code: string
        userCode: string
        userName: string
        userImage?: string
        title: string
        body: string
        address?: string
        language: 'EN' | 'LT'
        createdAt: string
        approvalCount: number
      }>
      pagination: {
        page: number
        limit: number
        totalItems: number
        totalPages: number
        hasNextPage: boolean
        hasPreviousPage: boolean
      }
    }>(`/api/forums?page=${page}&limit=${limit}`, {
      method: 'GET',
    })
  },

  /**
   * Get a single forum by code
   * GET /api/forums/{code}
   */
  getForum: async (code: string) => {
    return apiRequest<{
      code: string
      userCode: string
      userName: string
      userImage?: string
      title: string
      body: string
      address?: string
      language: 'EN' | 'LT'
      approvalCount: number
      createdAt: string
      updatedAt: string
    }>(`/api/forums/${code}`, {
      method: 'GET',
    })
  },

  /**
   * Create a new forum post
   * POST /api/forums
   */
  createForum: async (data: {
    title: string
    body: string
    address?: string
    language?: 'EN' | 'LT'
  }) => {
    return apiRequest<{
      code: string
      userCode: string
      title: string
      body: string
      address?: string
      language: 'EN' | 'LT'
      createdAt: string
    }>('/api/forums', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  /**
   * Update a forum post
   * PATCH /api/forums/{forumCode}
   */
  updateForum: async (forumCode: string, data: {
    title?: string
    body?: string
    address?: string
    language?: 'EN' | 'LT'
  }) => {
    return apiRequest<{
      code: string
      userCode: string
      title: string
      body: string
      address?: string
      language: 'EN' | 'LT'
      createdAt: string
      updatedAt: string
    }>(`/api/forums/${forumCode}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  /**
   * Delete a forum post
   * DELETE /api/forums/{code}
   */
  deleteForum: async (code: string) => {
    return apiRequest<{
      message: string
    }>(`/api/forums/${code}`, {
      method: 'DELETE',
    })
  },

  /**
   * Get current user's forums
   * GET /api/users/forums
   */
  getUserForums: async () => {
    return apiRequest<Array<{
      code: string
      userCode: string
      userName: string
      userImage?: string
      title: string
      body: string
      address?: string
      language: 'EN' | 'LT'
      approvalCount: number
      createdAt: string
    }>>('/api/users/forums', {
      method: 'GET',
    })
  },

  /**
   * Approve a forum post (like)
   * POST /api/forums/{forumCode}/approvals
   * Returns 201 on success
   * Returns 400 if user tries to approve their own forum
   * Returns 409 if forum already approved by this user
   */
  approveForum: async (forumCode: string) => {
    return apiRequest<{
      userCode: string
      forumCode: string
      createdAt: string
    }>(`/api/forums/${forumCode}/approvals`, {
      method: 'POST',
    })
  },

  /**
   * Remove approval from a forum post (unlike)
   * DELETE /api/forums/{forumCode}/approvals
   * Returns 204 (no content) on success
   */
  removeApproval: async (forumCode: string) => {
    // Returns 204 with no body
    return apiRequest<void>(`/api/forums/${forumCode}/approvals`, {
      method: 'DELETE',
    })
  },
}

/**
 * Comments API - Matches OpenAPI specification
 */
export const commentsAPI = {
  /**
   * Get comments for a forum
   * GET /api/forums/{forumCode}/comments
   * Returns all comments for a specific forum post
   */
  getComments: async (forumCode: string) => {
    return apiRequest<Array<{
      code: string
      userCode: string
      userName: string
      userImage?: string
      commentText: string
      createdAt: string
      updatedAt?: string
    }>>(`/api/forums/${forumCode}/comments`, {
      method: 'GET',
    })
  },

  /**
   * Create a comment on a forum
   * POST /api/forums/{forumCode}/comments
   */
  createComment: async (forumCode: string, data: { commentText: string }) => {
    return apiRequest<{
      code: string
      userCode: string
      forumCode: string
      commentText: string
      createdAt: string
    }>(`/api/forums/${forumCode}/comments`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  /**
   * Update a comment
   * PATCH /api/forums/comments/{commentCode}
   */
  updateComment: async (commentCode: string, data: { commentText: string }) => {
    return apiRequest<{
      code: string
      userCode: string
      commentText: string
      createdAt: string
      updatedAt: string
    }>(`/api/forums/comments/${commentCode}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  /**
   * Delete a comment
   * DELETE /api/forums/comments/{commentCode}
   * Returns 204 (no content) on success
   */
  deleteComment: async (commentCode: string) => {
    return apiRequest<void>(`/api/forums/comments/${commentCode}`, {
      method: 'DELETE',
    })
  },
}

/**
 * AI Agent API - Matches OpenAPI specification
 * POST /api/agent/generate
 */
export const aiAPI = {
  /**
   * Generate AI response using Gemini models
   * POST /api/agent/generate
   */
  generate: async (data: { prompt: string }) => {
    return apiRequest<{
      response: string
      timestamp: string
    }>('/api/agent/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}

/**
 * Petitions API - Matches OpenAPI specification
 */
export const petitionsAPI = {
  /**
   * Get paginated petitions
   * GET /api/petitions?page=1&limit=10
   */
  getPetitions: async (page: number = 1, limit: number = 10) => {
    return apiRequest<{
      petitions: Array<{
        code: string
        userCode: string
        userName: string
        userImage?: string
        name: string
        description: string
        address?: string
        createdAt: string
        approvalCount: number
      }>
      pagination: {
        page: number
        limit: number
        totalItems: number
        totalPages: number
        hasNextPage: boolean
        hasPreviousPage: boolean
      }
    }>(`/api/petitions?page=${page}&limit=${limit}`, {
      method: 'GET',
    })
  },

  /**
   * Create a new petition
   * POST /api/petitions
   */
  createPetition: async (data: {
    name: string
    description: string
    address?: string
  }) => {
    return apiRequest<{
      code: string
      userCode: string
      name: string
      description: string
      address?: string
      createdAt: string
    }>('/api/petitions', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  /**
   * Update a petition
   * PATCH /api/petitions/{code}
   */
  updatePetition: async (code: string, data: {
    name?: string
    description?: string
    address?: string
  }) => {
    return apiRequest<{
      code: string
      userCode: string
      name: string
      description: string
      address?: string
      createdAt: string
      updatedAt: string
    }>(`/api/petitions/${code}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  /**
   * Delete a petition
   * DELETE /api/petitions/{code}
   * Returns 204 (no content) on success
   */
  deletePetition: async (code: string) => {
    return apiRequest<void>(`/api/petitions/${code}`, {
      method: 'DELETE',
    })
  },

  /**
   * Approve a petition (sign)
   * POST /api/petitions/{petitionCode}/approvals
   * Returns 201 on success
   * Returns 400 if user tries to approve their own petition
   * Returns 409 if petition already approved by this user
   */
  approvePetition: async (petitionCode: string) => {
    return apiRequest<{
      userCode: string
      petitionCode: string
      createdAt: string
    }>(`/api/petitions/${petitionCode}/approvals`, {
      method: 'POST',
    })
  },

  /**
   * Remove approval from a petition (unsign)
   * DELETE /api/petitions/{petitionCode}/approvals
   * Returns 204 (no content) on success
   */
  removeApproval: async (petitionCode: string) => {
    return apiRequest<void>(`/api/petitions/${petitionCode}/approvals`, {
      method: 'DELETE',
    })
  },
}
