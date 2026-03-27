import type { TokenMarketData, TokenChartDataPoint } from '@/api/external/coingecko'
import type { TimeRange } from '@/hooks/useTokenChart'
import { formatCurrency, formatPercentage, formatCompactNumber } from '@/utils/utils'
import { cn } from '@/lib/utils'
import React, { useMemo } from 'react'
import {
  Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import { ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

// ─── Time Range Options ──────────────────────────────────────────
const timeRanges: { value: TimeRange; label: string }[] = [
  { value: '1', label: '24H' },
  { value: '7', label: '7D' },
  { value: '30', label: '1M' },
  { value: '90', label: '3M' },
  { value: '365', label: '1Y' },
]

// ─── Types ───────────────────────────────────────────────────────
interface TokenDetailChartProps {
  token: TokenMarketData | undefined
  chartData: TokenChartDataPoint[] | undefined
  isChartLoading: boolean
  selectedTimeRange: TimeRange
  onTimeRangeChange: (range: TimeRange) => void
}

// ─── Tooltip ─────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: TokenChartDataPoint; value: number }> }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    const dateObj = new Date(data.timestamp)
    const dateStr = dateObj.toLocaleString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

    return (
      <div className="bg-card/95 backdrop-blur-md border border-border p-3 rounded-xl shadow-2xl min-w-[180px]">
        <p className="text-[11px] text-muted-foreground mb-1.5 font-medium flex items-center gap-1.5">
          <Clock className="w-3 h-3" />
          {dateStr}
        </p>
        <p className="font-bold text-lg text-foreground tabular-nums">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    )
  }
  return null
}

// ─── Y-Axis Formatter ────────────────────────────────────────────
const formatYAxis = (value: number) => {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`
  if (value >= 1e3) return `$${(value / 1e3).toFixed(value >= 10000 ? 0 : 1)}K`
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: value < 1 ? 4 : 2 })}`
}

// ─── X-Axis Formatter ────────────────────────────────────────────
const formatXAxisTick = (timestamp: number, timeRange: TimeRange) => {
  const date = new Date(timestamp)
  switch (timeRange) {
    case '1':
      return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    case '7':
    case '30':
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    case '90':
    case '365':
      return date.toLocaleDateString(undefined, { month: 'short', year: '2-digit' })
    default:
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  }
}

// ─── Main Component ──────────────────────────────────────────────
const TokenDetailChart: React.FC<TokenDetailChartProps> = ({
  token,
  chartData,
  isChartLoading,
  selectedTimeRange,
  onTimeRangeChange,
}) => {
  const isPositive = (token?.priceChange24h ?? 0) >= 0
  const color = isPositive ? '#22c55e' : '#ef4444'
  const gradientId = `chart-gradient-${token?.id ?? 'default'}`

  // Compute chart domain
  const domain = useMemo(() => {
    if (!chartData?.length) return [0, 0]
    const prices = chartData.map((d) => d.price)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    const diff = max - min
    return [min - diff * 0.05, max + diff * 0.05]
  }, [chartData])

  // Compute ticks for X-axis
  const ticks = useMemo(() => {
    if (!chartData?.length) return []
    const tickCount = timeRanges.find((tr) => tr.value === selectedTimeRange)?.value === '1' ? 6 : 7
    const step = Math.floor(chartData.length / tickCount)
    return chartData.filter((_, i) => i % step === 0).map((d) => d.timestamp)
  }, [chartData, selectedTimeRange])

  // Compute change in selected period
  const periodChange = useMemo(() => {
    if (!chartData?.length || chartData.length < 2) return null
    const first = chartData[0].price
    const last = chartData[chartData.length - 1].price
    const change = ((last - first) / first) * 100
    return change
  }, [chartData])

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="p-5 pb-3">
        <div className="flex items-center justify-between mb-4">
          {/* Token Info */}
          <div className="flex items-center gap-4">
            {token ? (
              <>
                <img
                  src={token.image}
                  alt={token.name}
                  className="w-11 h-11 rounded-full ring-2 ring-border shadow-lg"
                />
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2.5">
                    {token.name}
                    <span className="text-muted-foreground text-xs uppercase font-semibold bg-muted px-2 py-0.5 rounded-md">
                      {token.symbol}
                    </span>
                    {token.marketCapRank && (
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                        #{token.marketCapRank}
                      </span>
                    )}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span>MCap: {formatCompactNumber(token.marketCap)}</span>
                    <span>Vol: {formatCompactNumber(token.totalVolume)}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Skeleton className="w-11 h-11 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </>
            )}
          </div>

          {/* Price Info */}
          <div className="text-right">
            {token ? (
              <>
                <div className="text-2xl font-bold tabular-nums">
                  {formatCurrency(token.currentPrice)}
                </div>
                <div
                  className={cn(
                    'text-sm font-semibold flex items-center justify-end gap-1 mt-0.5',
                    isPositive ? 'text-green-500' : 'text-red-500',
                  )}
                >
                  {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {formatPercentage(token.priceChange24h)} (24h)
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Skeleton className="h-8 w-28 ml-auto" />
                <Skeleton className="h-4 w-20 ml-auto" />
              </div>
            )}
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-0.5">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => onTimeRangeChange(range.value)}
                className={cn(
                  'px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200',
                  selectedTimeRange === range.value
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                )}
              >
                {range.label}
              </button>
            ))}
          </div>

          {/* Period change indicator */}
          {periodChange !== null && !isChartLoading && (
            <div
              className={cn(
                'flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg',
                periodChange >= 0
                  ? 'bg-green-500/10 text-green-500'
                  : 'bg-red-500/10 text-red-500',
              )}
            >
              {periodChange >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {formatPercentage(periodChange)}
              <span className="text-muted-foreground/70 ml-1 font-normal">
                ({timeRanges.find((tr) => tr.value === selectedTimeRange)?.label})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0 px-3 pb-3">
        {isChartLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="relative w-full h-full">
              <Skeleton className="w-full h-full rounded-lg" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-muted-foreground">Loading chart...</span>
                </div>
              </div>
            </div>
          </div>
        ) : chartData && chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.25} />
                  <stop offset="50%" stopColor={color} stopOpacity={0.1} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                opacity={0.05}
                vertical={false}
              />
              <XAxis
                dataKey="timestamp"
                type="number"
                domain={['dataMin', 'dataMax']}
                ticks={ticks}
                tickFormatter={(ts) => formatXAxisTick(ts, selectedTimeRange)}
                tick={{ fill: 'currentColor', fontSize: 10, opacity: 0.4 }}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis
                domain={domain}
                tickFormatter={formatYAxis}
                width={65}
                tick={{ fill: 'currentColor', fontSize: 10, opacity: 0.4 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'currentColor', strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.15 }} />
              <Area
                type="monotone"
                dataKey="price"
                stroke={color}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#${gradientId})`}
                isAnimationActive={true}
                animationDuration={600}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            Select a token to view chart
          </div>
        )}
      </div>
    </div>
  )
}

export default TokenDetailChart
