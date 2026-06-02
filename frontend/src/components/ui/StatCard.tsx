interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  color?: 'accent' | 'cyan' | 'danger' | 'warning'
  icon: React.ReactNode
  animDelay?: string
}

const colorMap = {
  accent:  { text: 'text-gp-accent',   glow: '#7c6aff', bg: 'bg-gp-accent/10',  border: 'border-gp-accent/20' },
  cyan:    { text: 'text-gp-cyan',     glow: '#00e5c8', bg: 'bg-gp-cyan/10',    border: 'border-gp-cyan/20'   },
  danger:  { text: 'text-gp-danger',   glow: '#ff4560', bg: 'bg-gp-danger/10',  border: 'border-gp-danger/20' },
  warning: { text: 'text-gp-warning',  glow: '#ffa500', bg: 'bg-gp-warning/10', border: 'border-gp-warning/20'},
}

export const StatCard = ({ label, value, sub, color = 'accent', icon, animDelay = '0ms' }: StatCardProps) => {
  const c = colorMap[color]

  return (
    <div
      className={`gp-card border ${c.border} opacity-0-init animate-fade-up relative overflow-hidden`}
      style={{ animationDelay: animDelay, animationFillMode: 'forwards' }}
    >
      {/* Subtle corner glow */}
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 blur-2xl pointer-events-none"
        style={{ background: c.glow, transform: 'translate(30%, -30%)' }}
      />

      <div className="flex items-start justify-between">
        <div>
          <p className="gp-label mb-3">{label}</p>
          <p className={`gp-stat-value ${c.text}`} style={{ textShadow: `0 0 20px ${c.glow}55` }}>
            {value}
          </p>
          {sub && <p className="text-gp-muted text-xs font-body mt-1">{sub}</p>}
        </div>
        <div className={`${c.bg} ${c.text} p-3 rounded-xl border ${c.border}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}
