import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gp-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-gp-accent border-t-transparent rounded-full animate-spin" />
          <p className="font-mono text-gp-muted text-sm">Authenticating...</p>
        </div>
      </div>
    )
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}
