import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Area, AreaChart,
} from 'recharts'

interface Props {
  data: { date: string; count: number }[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="gp-card border border-gp-accent/30 px-4 py-3 text-sm shadow-xl">
      <p className="font-mono text-gp-muted text-xs mb-1">{label}</p>
      <p className="font-display font-bold text-gp-accent text-lg">{payload[0].value.toLocaleString()}</p>
      <p className="text-gp-muted text-xs">events</p>
    </div>
  )
}

export const DailyActivityChart = ({ data }: Props) => {
  // Format date labels
  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }))

  return (
    <div className="gp-card-glow opacity-0-init animate-fade-up delay-200" style={{ animationFillMode: 'forwards' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="gp-label mb-1">Activity Timeline</p>
          <p className="font-display font-bold text-white text-lg">Events Over Time</p>
        </div>
        <span className="text-gp-muted text-xs font-mono bg-gp-surface px-3 py-1 rounded-full border border-gp-border">
          Last 30 days
        </span>
      </div>

      {data.length === 0 ? (
        <div className="h-56 flex items-center justify-center">
          <p className="text-gp-muted text-sm font-body">No activity data yet. Start ingesting events!</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={formatted} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#7c6aff" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#7c6aff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#1e1e3f" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: '#5a6080', fontSize: 11, fontFamily: 'JetBrains Mono' }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: '#5a6080', fontSize: 11, fontFamily: 'JetBrains Mono' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#7c6aff44', strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#7c6aff"
              strokeWidth={2}
              fill="url(#activityGradient)"
              dot={false}
              activeDot={{ r: 4, fill: '#7c6aff', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
