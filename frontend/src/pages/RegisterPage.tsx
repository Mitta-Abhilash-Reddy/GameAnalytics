import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export const RegisterPage = () => {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ username: '', email: '', password: '', displayName: '' })
  const [errors, setErrors] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrors([])
    setIsLoading(true)
    try {
      await register(form.username, form.email, form.password, form.displayName)
      navigate('/dashboard')
    } catch (err: any) {
      const data = err?.response?.data
      if (data?.errors) {
        setErrors(data.errors.map((e: any) => e.msg))
      } else {
        setErrors([data?.message ?? 'Registration failed.'])
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gp-bg flex items-center justify-center relative overflow-hidden py-10">
      <div className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(124,106,255,0.04) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(124,106,255,0.04) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
      <div className="fixed top-1/3 right-1/4 w-80 h-80 rounded-full pointer-events-none blur-3xl opacity-10"
           style={{ background: '#7c6aff' }} />

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="text-center mb-8 opacity-0-init animate-fade-up" style={{ animationFillMode: 'forwards' }}>
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gp-accent mb-4"
               style={{ boxShadow: '0 0 32px #7c6aff66' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-7 h-7" strokeLinecap="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="font-display font-bold text-3xl text-white tracking-wide">GAMEPULSE AI</h1>
          <p className="text-gp-muted text-sm font-body mt-1">Create your analyst account</p>
        </div>

        <div className="gp-card-glow opacity-0-init animate-fade-up delay-100" style={{ animationFillMode: 'forwards' }}>
          <h2 className="font-display font-bold text-xl text-white mb-1">Create Account</h2>
          <p className="text-gp-muted text-sm font-body mb-6">Start tracking player analytics</p>

          {errors.length > 0 && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-gp-danger/10 border border-gp-danger/30 space-y-1">
              {errors.map((err, i) => (
                <p key={i} className="text-gp-danger text-sm font-body">{err}</p>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="gp-label block mb-2">Username *</label>
                <input type="text" value={form.username} onChange={set('username')}
                  className="gp-input" placeholder="player_one" required />
              </div>
              <div>
                <label className="gp-label block mb-2">Display Name</label>
                <input type="text" value={form.displayName} onChange={set('displayName')}
                  className="gp-input" placeholder="Player One" />
              </div>
            </div>

            <div>
              <label className="gp-label block mb-2">Email *</label>
              <input type="email" value={form.email} onChange={set('email')}
                className="gp-input" placeholder="player@gamepulse.ai" required />
            </div>

            <div>
              <label className="gp-label block mb-2">Password *</label>
              <input type="password" value={form.password} onChange={set('password')}
                className="gp-input" placeholder="Min 8 chars, 1 uppercase, 1 number" required />
            </div>

            <button type="submit" className="gp-btn-primary mt-2" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                'CREATE ACCOUNT'
              )}
            </button>
          </form>

          <p className="text-center text-gp-muted text-sm font-body mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-gp-accent hover:text-white transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
