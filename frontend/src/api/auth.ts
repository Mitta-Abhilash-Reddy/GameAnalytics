import apiClient from './client'
import type { ApiResponse, AuthResponse, User } from '../types'

export const authApi = {
  register: async (data: {
    username: string
    email: string
    password: string
    displayName?: string
  }) => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data)
    return res.data
  },

  login: async (data: { email: string; password: string }) => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data)
    return res.data
  },

  getMe: async () => {
    const res = await apiClient.get<ApiResponse<User>>('/auth/me')
    return res.data
  },

  logout: async () => {
    const res = await apiClient.post<ApiResponse<null>>('/auth/logout')
    return res.data
  },
}
