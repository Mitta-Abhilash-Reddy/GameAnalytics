import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gp-bg flex items-center justify-center relative overflow-hidden">
      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(124,106,255,0.04) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(124,106,255,0.04) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Glow orbs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none blur-3xl opacity-10"
           style={{ background: '#7c6aff' }} />
      <div className="fixed bottom-1/4 right-1/4 w-64 h-64 rounded-full pointer-events-none blur-3xl opacity-10"
           style={{ background: '#00e5c8' }} />

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo */}
        <div className="text-center mb-10 opacity-0-init animate-fade-up" style={{ animationFillMode: 'forwards' }}>
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gp-accent mb-4"
               style={{ boxShadow: '0 0 32px #7c6aff66' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-7 h-7" strokeLinecap="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="font-display font-bold text-3xl text-white tracking-wide">GAMEPULSE AI</h1>
          <p className="text-gp-muted text-sm font-body mt-1">Player Analytics Platform</p>
        </div>

        {/* Card */}
        <div className="gp-card-glow opacity-0-init animate-fade-up delay-100" style={{ animationFillMode: 'forwards' }}>
          <h2 className="font-display font-bold text-xl text-white mb-1">Sign In</h2>
          <p className="text-gp-muted text-sm font-body mb-6">Access your analytics dashboard</p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-gp-danger/10 border border-gp-danger/30 text-gp-danger text-sm font-body">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="gp-label block mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="gp-input"
                placeholder="player@gamepulse.ai"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="gp-label block mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="gp-input"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="gp-btn-primary mt-2" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                'SIGN IN'
              )}
            </button>
          </form>

          <p className="text-center text-gp-muted text-sm font-body mt-6">
            No account?{' '}
            <Link to="/register" className="text-gp-accent hover:text-white transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
