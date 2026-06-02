import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

interface Props {
  data: { game: string; count: number }[]
}

const COLORS = ['#7c6aff', '#00e5c8', '#ff4560', '#ffa500', '#4a9eff', '#b06aff']

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  const total = payload[0].payload.total
  const pct = total ? ((payload[0].value / total) * 100).toFixed(1) : 0
  return (
    <div className="gp-card border border-gp-border px-4 py-3 text-sm shadow-xl">
      <p className="font-mono text-gp-muted text-xs mb-1">{payload[0].name}</p>
      <p className="font-display font-bold text-white text-lg">{payload[0].value.toLocaleString()}</p>
      <p className="text-gp-muted text-xs">{pct}% of total</p>
    </div>
  )
}

const CustomLegend = ({ payload }: any) => (
  <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 justify-center">
    {payload?.map((entry: any, i: number) => (
      <div key={i} className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
        <span className="text-gp-muted text-xs font-body truncate max-w-[80px]">{entry.value}</span>
      </div>
    ))}
  </div>
)

export const GameActivityChart = ({ data }: Props) => {
  const total = data.reduce((sum, d) => sum + d.count, 0)
  const chartData = data.slice(0, 6).map((d) => ({ ...d, total }))

  return (
    <div className="gp-card-glow opacity-0-init animate-fade-up delay-400" style={{ animationFillMode: 'forwards' }}>
      <div className="mb-4">
        <p className="gp-label mb-1">Distribution</p>
        <p className="font-display font-bold text-white text-lg">Activity by Game</p>
      </div>

      {chartData.length === 0 ? (
        <div className="h-56 flex items-center justify-center">
          <p className="text-gp-muted text-sm font-body">No game data yet.</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="count"
              nameKey="game"
            >
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
