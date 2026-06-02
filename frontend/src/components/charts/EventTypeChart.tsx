import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell,
} from 'recharts'

interface Props {
  data: { eventType: string; count: number }[]
}

const COLORS = [
  '#7c6aff', '#00e5c8', '#ff4560', '#ffa500',
  '#4a9eff', '#b06aff', '#00c878', '#ff6b6b',
]

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="gp-card border border-gp-border px-4 py-3 text-sm shadow-xl">
      <p className="font-mono text-gp-muted text-xs mb-1">{payload[0].payload.eventType}</p>
      <p className="font-display font-bold text-white text-lg">{payload[0].value.toLocaleString()}</p>
      <p className="text-gp-muted text-xs">events</p>
    </div>
  )
}

export const EventTypeChart = ({ data }: Props) => {
  const top = data.slice(0, 8)

  return (
    <div className="gp-card-glow opacity-0-init animate-fade-up delay-300" style={{ animationFillMode: 'forwards' }}>
      <div className="mb-6">
        <p className="gp-label mb-1">Breakdown</p>
        <p className="font-display font-bold text-white text-lg">Events by Type</p>
      </div>

      {top.length === 0 ? (
        <div className="h-56 flex items-center justify-center">
          <p className="text-gp-muted text-sm font-body">No events recorded yet.</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={top} margin={{ top: 5, right: 10, left: -20, bottom: 40 }}>
            <CartesianGrid stroke="#1e1e3f" strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis
              dataKey="eventType"
              tick={{ fill: '#5a6080', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              axisLine={false}
              tickLine={false}
              angle={-35}
              textAnchor="end"
              interval={0}
            />
            <YAxis
              tick={{ fill: '#5a6080', fontSize: 11, fontFamily: 'JetBrains Mono' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#7c6aff11' }} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={40}>
              {top.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
