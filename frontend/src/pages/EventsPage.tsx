import { useState, useEffect } from 'react'
import { eventsApi } from '../api/events'
import type { GameEvent, EventsMeta } from '../types'

const EVENT_TYPE_COLORS: Record<string, string> = {
  session_start:      'text-gp-cyan   bg-gp-cyan/10   border-gp-cyan/30',
  session_end:        'text-gp-muted  bg-gp-border/40 border-gp-border',
  match_start:        'text-gp-accent bg-gp-accent/10 border-gp-accent/30',
  match_end:          'text-gp-accent bg-gp-accent/10 border-gp-accent/30',
  kill:               'text-gp-danger bg-gp-danger/10 border-gp-danger/30',
  death:              'text-gp-warning bg-gp-warning/10 border-gp-warning/30',
  level_up:           'text-gp-cyan   bg-gp-cyan/10   border-gp-cyan/30',
  achievement_unlocked:'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
}

const getBadgeClass = (type: string) =>
  EVENT_TYPE_COLORS[type] ?? 'text-gp-muted bg-gp-border/40 border-gp-border'

export const EventsPage = () => {
  const [events, setEvents]     = useState<GameEvent[]>([])
  const [meta, setMeta]         = useState<EventsMeta | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage]         = useState(1)
  const [filterGame, setFilterGame]   = useState('')
  const [filterType, setFilterType]   = useState('')

  const fetchEvents = async (p: number) => {
    setIsLoading(true)
    try {
      const params: Record<string, any> = { page: p, limit: 15 }
      if (filterGame) params.game = filterGame
      if (filterType) params.eventType = filterType
      const res = await eventsApi.getEvents(params)
      setEvents(res.data.events)
      setMeta(res.meta ?? null)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchEvents(page) }, [page, filterGame, filterType])

  const handleFilter = () => { setPage(1); fetchEvents(1) }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8 opacity-0-init animate-fade-up" style={{ animationFillMode: 'forwards' }}>
        <p className="gp-label mb-1">Telemetry</p>
        <h1 className="font-display font-bold text-4xl text-white">Event Stream</h1>
        <p className="text-gp-muted text-sm font-body mt-1">Raw player telemetry events from your backend</p>
      </div>

      {/* Filters */}
      <div className="gp-card mb-6 flex flex-wrap gap-3 items-end opacity-0-init animate-fade-up delay-100"
           style={{ animationFillMode: 'forwards' }}>
        <div className="flex-1 min-w-[160px]">
          <label className="gp-label block mb-2">Game</label>
          <input
            type="text"
            value={filterGame}
            onChange={(e) => setFilterGame(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
            className="gp-input text-sm"
            placeholder="e.g. Valorant"
          />
        </div>
        <div className="flex-1 min-w-[160px]">
          <label className="gp-label block mb-2">Event Type</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="gp-input text-sm"
          >
            <option value="">All types</option>
            {['session_start','session_end','match_start','match_end','kill','death',
              'assist','level_up','achievement_unlocked','xp_gained','item_purchased',
              'purchase','quest_completed','custom'].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <button onClick={handleFilter}
          className="px-5 py-3 rounded-lg bg-gp-accent/20 border border-gp-accent/40 text-gp-accent text-sm font-display font-semibold tracking-wider hover:bg-gp-accent/30 transition-all">
          FILTER
        </button>
        {(filterGame || filterType) && (
          <button onClick={() => { setFilterGame(''); setFilterType(''); setPage(1) }}
            className="px-4 py-3 rounded-lg border border-gp-border text-gp-muted text-sm hover:text-gp-text transition-all">
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="gp-card-glow opacity-0-init animate-fade-up delay-200" style={{ animationFillMode: 'forwards' }}>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-12 bg-gp-border/30 rounded animate-pulse" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-display font-bold text-white text-lg mb-2">No events found</p>
            <p className="text-gp-muted text-sm font-body">Try adjusting your filters or ingest some events first.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gp-border">
                  {['Event Type', 'Game', 'Session', 'Timestamp'].map((h) => (
                    <th key={h} className="gp-label text-left py-3 px-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gp-border/50">
                {events.map((event) => (
                  <tr key={event._id} className="hover:bg-gp-border/20 transition-colors group">
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-mono border ${getBadgeClass(event.eventType)}`}>
                        {event.eventType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gp-text font-body">{event.game}</td>
                    <td className="py-3 px-4 text-gp-muted font-mono text-xs truncate max-w-[140px]">
                      {event.sessionId}
                    </td>
                    <td className="py-3 px-4 text-gp-muted font-mono text-xs">
                      {new Date(event.serverTimestamp).toLocaleString('en-US', {
                        month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gp-border">
            <p className="text-gp-muted text-xs font-mono">
              {meta.total.toLocaleString()} total events · page {meta.page} of {meta.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!meta.hasPrevPage}
                className="px-3 py-1.5 rounded-lg border border-gp-border text-gp-muted text-xs hover:text-gp-text hover:border-gp-accent/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                ← Prev
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!meta.hasNextPage}
                className="px-3 py-1.5 rounded-lg border border-gp-border text-gp-muted text-xs hover:text-gp-text hover:border-gp-accent/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
