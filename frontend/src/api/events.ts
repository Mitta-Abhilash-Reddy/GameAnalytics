import apiClient from './client'
import type { ApiResponse, EventsResponse, EventStats } from '../types'

export interface GetEventsParams {
  page?: number
  limit?: number
  eventType?: string
  game?: string
  from?: string
  to?: string
}

export const eventsApi = {
  getEvents: async (params: GetEventsParams = {}) => {
    const res = await apiClient.get<ApiResponse<EventsResponse>>('/events', { params })
    return res.data
  },

  getStats: async () => {
    const res = await apiClient.get<ApiResponse<EventStats>>('/events/stats')
    return res.data
  },

  ingestEvent: async (event: {
    eventType: string
    sessionId: string
    game: string
    clientTimestamp: string
    properties?: Record<string, unknown>
    device?: { platform?: string; os?: string }
  }) => {
    const res = await apiClient.post<ApiResponse<{ eventId: string }>>('/events', event)
    return res.data
  },
}
