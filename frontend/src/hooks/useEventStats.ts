import { useState, useEffect } from 'react'
import { eventsApi } from '../api/events'
import type { EventStats } from '../types'

export const useEventStats = () => {
  const [stats, setStats] = useState<EventStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const res = await eventsApi.getStats()
      setStats(res.data)
    } catch (err: unknown) {
      setError('Failed to load analytics data')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return { stats, isLoading, error, refetch: fetchStats }
}
