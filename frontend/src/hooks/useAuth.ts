import { useState, useEffect, useCallback } from 'react'
import { authApi } from '../api/auth'
import { setToken, clearToken, getToken } from '../api/client'
import type { User } from '../types'

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })

  // On mount: verify token and load user
  useEffect(() => {
    const token = getToken()
    if (!token) {
      setState({ user: null, isLoading: false, isAuthenticated: false })
      return
    }

    authApi
      .getMe()
      .then((res) => {
        setState({ user: res.data, isLoading: false, isAuthenticated: true })
      })
      .catch(() => {
        clearToken()
        setState({ user: null, isLoading: false, isAuthenticated: false })
      })
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login({ email, password })
    setToken(res.data.token)
    setState({ user: res.data.user, isLoading: false, isAuthenticated: true })
    return res.data.user
  }, [])

  const register = useCallback(
    async (username: string, email: string, password: string, displayName?: string) => {
      const res = await authApi.register({ username, email, password, displayName })
      setToken(res.data.token)
      setState({ user: res.data.user, isLoading: false, isAuthenticated: true })
      return res.data.user
    },
    []
  )

  const logout = useCallback(async () => {
    try { await authApi.logout() } catch (_) { /* ignore */ }
    clearToken()
    setState({ user: null, isLoading: false, isAuthenticated: false })
  }, [])

  return { ...state, login, register, logout }
}
