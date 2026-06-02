import { useAuth } from '../hooks/useAuth'
import { useEventStats } from '../hooks/useEventStats'
import { StatCard } from '../components/ui/StatCard'
import { DailyActivityChart } from '../components/charts/DailyActivityChart'
import { EventTypeChart } from '../components/charts/EventTypeChart'
import { GameActivityChart } from '../components/charts/GameActivityChart'

const formatNumber = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString()

const formatDate = (iso: string | null) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export const DashboardPage = () => {
  const { user } = useAuth()
  const { stats, isLoading, error, refetch } = useEventStats()

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 opacity-0-init animate-fade-up" style={{ animationFillMode: 'forwards' }}>
        <p className="gp-label mb-1">Overview</p>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="font-display font-bold text-4xl text-white">
              Welcome back,{' '}
              <span className="text-gp-accent" style={{ textShadow: '0 0 20px #7c6aff66' }}>
                {user?.displayName}
              </span>
            </h1>
            <p className="text-gp-muted font-body text-sm mt-1">
              Your player analytics dashboard — real-time telemetry insights
            </p>
          </div>

          <button
            onClick={refetch}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gp-border text-gp-muted hover:text-gp-text hover:border-gp-accent/50 text-sm font-body transition-all duration-150"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
                 className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}>
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-gp-danger/10 border border-gp-danger/30 text-gp-danger text-sm font-body flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4 shrink-0">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error} —{' '}
          <button onClick={refetch} className="underline hover:no-underline">retry</button>
        </div>
      )}

      {/* Skeleton or stat cards */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="gp-card h-32 animate-pulse">
              <div className="h-3 w-20 bg-gp-border rounded mb-4" />
              <div className="h-8 w-16 bg-gp-border rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Total Events"
            value={formatNumber(stats?.summary.totalEvents ?? 0)}
            sub="all time"
            color="accent"
            animDelay="0ms"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            }
          />
          <StatCard
            label="Unique Games"
            value={stats?.summary.uniqueGames ?? 0}
            sub="tracked titles"
            color="cyan"
            animDelay="100ms"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
                <rect x="2" y="6" width="20" height="12" rx="2"/>
                <path d="M12 12h.01M8 12h.01" strokeLinecap="round"/>
                <path d="M17 10v4M15 12h4" strokeLinecap="round"/>
              </svg>
            }
          />
          <StatCard
            label="Sessions"
            value={formatNumber(stats?.summary.uniqueSessions ?? 0)}
            sub="play sessions"
            color="warning"
            animDelay="200ms"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            }
          />
          <StatCard
            label="Last Active"
            value={stats?.summary.lastEvent ? new Date(stats.summary.lastEvent).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
            sub={formatDate(stats?.summary.lastEvent ?? null)}
            color="danger"
            animDelay="300ms"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
          />
        </div>
      )}

      {/* Charts row 1 — Activity timeline full width */}
      {isLoading ? (
        <div className="gp-card h-64 animate-pulse mb-4">
          <div className="h-3 w-32 bg-gp-border rounded mb-6" />
          <div className="h-48 bg-gp-border/40 rounded" />
        </div>
      ) : (
        <div className="mb-4">
          <DailyActivityChart data={stats?.dailyActivity ?? []} />
        </div>
      )}

      {/* Charts row 2 — Event types + Game activity side by side */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[0, 1].map((i) => (
            <div key={i} className="gp-card h-64 animate-pulse">
              <div className="h-3 w-28 bg-gp-border rounded mb-6" />
              <div className="h-48 bg-gp-border/40 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <EventTypeChart data={stats?.byEventType ?? []} />
          <GameActivityChart data={stats?.byGame ?? []} />
        </div>
      )}

      {/* Empty state prompt */}
      {!isLoading && stats?.summary.totalEvents === 0 && (
        <div className="mt-6 gp-card border-dashed border-gp-accent/30 text-center py-10">
          <p className="font-display font-bold text-white text-lg mb-2">No events yet</p>
          <p className="text-gp-muted text-sm font-body mb-4">
            Start sending events to your backend to see analytics here.
          </p>
          <code className="text-gp-accent text-xs font-mono bg-gp-surface px-4 py-2 rounded-lg border border-gp-border">
            POST /api/events
          </code>
        </div>
      )}
    </div>
  )
}
