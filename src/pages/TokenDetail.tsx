import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTokenDetail } from '@/hooks/useTokenDetail'
import { useTokenChart, type TimeRange } from '@/hooks/useTokenChart'
import { formatCurrency, formatPercentage, formatCompactNumber } from '@/utils/utils'
import { cn } from '@/lib/utils'
import ErrorState from '@/components/dashboard/ErrorState'
import { Skeleton } from '@/components/ui/skeleton'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts'
import type { TokenChartDataPoint } from '@/api/external/coingecko'
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Globe,
  ExternalLink,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Layers,
  CircleDot,
} from 'lucide-react'
import { useMemo } from 'react'

// ─── Time Range Options ──────────────────────────────────────────
const timeRanges: { value: TimeRange; label: string }[] = [
  { value: '1', label: '24H' },
  { value: '7', label: '7D' },
  { value: '30', label: '1M' },
  { value: '90', label: '3M' },
  { value: '365', label: '1Y' },
]

// ─── Chart Tooltip ───────────────────────────────────────────────
const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: TokenChartDataPoint; value: number }> }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    const dateStr = new Date(data.timestamp).toLocaleString(undefined, {
      year: 'numeric',
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
        <p className="font-bold text-lg text-foreground tabular-nums">{formatCurrency(payload[0].value)}</p>
      </div>
    )
  }
  return null
}

// ─── Formatters ──────────────────────────────────────────────────
const formatYAxis = (value: number) => {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`
  if (value >= 1e3) return `$${(value / 1e3).toFixed(value >= 10000 ? 0 : 1)}K`
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: value < 1 ? 4 : 2 })}`
}

const formatXAxisTick = (timestamp: number, timeRange: TimeRange) => {
  const date = new Date(timestamp)
  switch (timeRange) {
    case '1':
      return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    case '7':
    case '30':
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    default:
      return date.toLocaleDateString(undefined, { month: 'short', year: '2-digit' })
  }
}

// ─── Token Detail Page ───────────────────────────────────────────
const TokenDetail: React.FC = () => {
  const { coinId } = useParams<{ coinId: string }>()
  const navigate = useNavigate()
  const [timeRange, setTimeRange] = useState<TimeRange>('7')

  const { data: token, isLoading, isError, error, refetch } = useTokenDetail(coinId)
  const { data: chartData, isLoading: isChartLoading } = useTokenChart(coinId ?? null, timeRange)

  const isPositive = (token?.priceChange24h ?? 0) >= 0
  const color = isPositive ? '#22c55e' : '#ef4444'
  const gradientId = `detail-gradient-${coinId}`

  const domain = useMemo(() => {
    if (!chartData?.length) return [0, 0]
    const prices = chartData.map((d) => d.price)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    const diff = max - min
    return [min - diff * 0.05, max + diff * 0.05]
  }, [chartData])

  const ticks = useMemo(() => {
    if (!chartData?.length) return []
    const tickCount = timeRange === '1' ? 6 : 7
    const step = Math.floor(chartData.length / tickCount)
    if (step === 0) return chartData.map((d) => d.timestamp)
    return chartData.filter((_, i) => i % step === 0).map((d) => d.timestamp)
  }, [chartData, timeRange])

  const periodChange = useMemo(() => {
    if (!chartData?.length || chartData.length < 2) return null
    const first = chartData[0].price
    const last = chartData[chartData.length - 1].price
    return ((last - first) / first) * 100
  }, [chartData])

  if (isError) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Market
        </button>
        <ErrorState error={error} onRetry={refetch} title="Failed to load token data" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Back to Market
      </button>

      {/* Header Section */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left: Token Info */}
          <div className="flex items-center gap-4">
            {isLoading ? (
              <>
                <Skeleton className="w-14 h-14 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-7 w-40" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </>
            ) : token ? (
              <>
                <img src={token.image} alt={token.name} className="w-14 h-14 rounded-full ring-2 ring-border shadow-lg" />
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-3">
                    {token.name}
                    <span className="text-muted-foreground text-sm uppercase font-semibold bg-muted px-2.5 py-0.5 rounded-md">
                      {token.symbol}
                    </span>
                    {token.marketCapRank && (
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">Rank #{token.marketCapRank}</span>
                    )}
                  </h1>
                  {token.homepageUrl && (
                    <a
                      href={token.homepageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 mt-1 transition-colors"
                    >
                      <Globe className="w-3 h-3" /> {token.homepageUrl.replace(/https?:\/\//, '').replace(/\/$/, '')}{' '}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </>
            ) : null}
          </div>

          {/* Right: Price */}
          <div className="text-left md:text-right">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-36 md:ml-auto" />
                <Skeleton className="h-5 w-24 md:ml-auto" />
              </div>
            ) : token ? (
              <>
                <div className="text-3xl font-bold tabular-nums">{formatCurrency(token.currentPrice)}</div>
                <div
                  className={cn(
                    'text-base font-semibold flex items-center md:justify-end gap-1 mt-1',
                    isPositive ? 'text-green-500' : 'text-red-500',
                  )}
                >
                  {isPositive ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                  {formatPercentage(token.priceChange24h ?? 0)} (24h)
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-5 pb-3 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-0.5">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={cn(
                  'px-4 py-2 rounded-md text-xs font-semibold transition-all duration-200',
                  timeRange === range.value
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                )}
              >
                {range.label}
              </button>
            ))}
          </div>
          {periodChange !== null && !isChartLoading && (
            <div
              className={cn(
                'flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg',
                periodChange >= 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500',
              )}
            >
              {periodChange >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {formatPercentage(periodChange)}
              <span className="text-muted-foreground/70 ml-1 font-normal">({timeRanges.find((tr) => tr.value === timeRange)?.label})</span>
            </div>
          )}
        </div>

        <div className="px-3 pb-3" style={{ height: '400px' }}>
          {isChartLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-muted-foreground">Loading chart...</span>
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
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.05} vertical={false} />
                <XAxis
                  dataKey="timestamp"
                  type="number"
                  domain={['dataMin', 'dataMax']}
                  ticks={ticks}
                  tickFormatter={(ts) => formatXAxisTick(ts, timeRange)}
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
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ stroke: 'currentColor', strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.15 }}
                />
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
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No chart data available</div>
          )}
        </div>
      </div>

      {/* Market Data Grid */}
      {token && !isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Market Stats Card */}
          <div className="bg-card rounded-xl border border-border p-5 space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" /> Market Statistics
            </h3>
            <div className="space-y-3">
              <StatRow label="Market Cap" value={formatCompactNumber(token.marketCap)} />
              <StatRow label="24h Volume" value={formatCompactNumber(token.totalVolume)} />
              <StatRow label="FDV" value={token.totalSupply ? formatCompactNumber(token.currentPrice * token.totalSupply) : 'N/A'} />
              <StatRow label="Vol/MCap" value={`${((token.totalVolume / token.marketCap) * 100).toFixed(2)}%`} />
            </div>
          </div>

          {/* Price Range Card */}
          <div className="bg-card rounded-xl border border-border p-5 space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-orange-500" /> Price Range (24h)
            </h3>
            <div className="space-y-3">
              <StatRow label="24h High" value={token.high24h ? formatCurrency(token.high24h) : 'N/A'} valueColor="text-green-500" />
              <StatRow label="24h Low" value={token.low24h ? formatCurrency(token.low24h) : 'N/A'} valueColor="text-red-500" />
              <StatRow label="All-Time High" value={formatCurrency(token.ath)} />
              <StatRow label="All-Time Low" value={formatCurrency(token.atl)} />
            </div>
            {token.high24h && token.low24h && (
              <div className="pt-2">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full"
                    style={{
                      width: `${Math.min(100, Math.max(0, ((token.currentPrice - token.low24h) / (token.high24h - token.low24h)) * 100))}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>{formatCurrency(token.low24h)}</span>
                  <span>{formatCurrency(token.high24h)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Supply Info Card */}
          <div className="bg-card rounded-xl border border-border p-5 space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-500" /> Supply
            </h3>
            <div className="space-y-3">
              <StatRow
                label="Circulating Supply"
                value={
                  token.circulatingSupply
                    ? `${formatCompactNumber(token.circulatingSupply).replace('$', '')} ${token.symbol.toUpperCase()}`
                    : 'N/A'
                }
              />
              <StatRow
                label="Total Supply"
                value={
                  token.totalSupply ? `${formatCompactNumber(token.totalSupply).replace('$', '')} ${token.symbol.toUpperCase()}` : 'N/A'
                }
              />
              <StatRow
                label="Max Supply"
                value={token.maxSupply ? `${formatCompactNumber(token.maxSupply).replace('$', '')} ${token.symbol.toUpperCase()}` : '∞'}
              />
              {token.circulatingSupply && token.maxSupply && (
                <>
                  <StatRow label="Circulating %" value={`${((token.circulatingSupply / token.maxSupply) * 100).toFixed(1)}%`} />
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary/50 rounded-full"
                      style={{ width: `${Math.min(100, (token.circulatingSupply / token.maxSupply) * 100)}%` }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Price Changes Card */}
          <div className="bg-card rounded-xl border border-border p-5 space-y-4 md:col-span-2 lg:col-span-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" /> Price Change Overview
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <PriceChangeCard label="24 Hours" value={token.priceChange24h} />
              <PriceChangeCard label="7 Days" value={token.priceChange7d} />
              <PriceChangeCard label="30 Days" value={token.priceChange30d} />
            </div>
          </div>

          {/* Description Card */}
          {token.description && (
            <div className="bg-card rounded-xl border border-border p-5 space-y-3 md:col-span-2 lg:col-span-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <CircleDot className="w-4 h-4 text-blue-500" /> About {token.name}
              </h3>
              <div
                className="text-sm text-muted-foreground leading-relaxed line-clamp-6 prose prose-invert prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: token.description }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Helper Components ───────────────────────────────────────────
const StatRow: React.FC<{ label: string; value: string; valueColor?: string }> = ({ label, value, valueColor }) => (
  <div className="flex items-center justify-between">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className={cn('text-sm font-semibold tabular-nums', valueColor || 'text-foreground')}>{value}</span>
  </div>
)

const PriceChangeCard: React.FC<{ label: string; value: number | null }> = ({ label, value }) => {
  if (value === null) {
    return (
      <div className="bg-muted/30 rounded-lg p-4 text-center">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className="text-sm text-muted-foreground">N/A</p>
      </div>
    )
  }
  const isPositive = value >= 0
  return (
    <div
      className={cn(
        'rounded-lg p-4 text-center',
        isPositive ? 'bg-green-500/5 border border-green-500/10' : 'bg-red-500/5 border border-red-500/10',
      )}
    >
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <div className={cn('flex items-center justify-center gap-1 text-lg font-bold', isPositive ? 'text-green-500' : 'text-red-500')}>
        {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        {formatPercentage(value)}
      </div>
    </div>
  )
}

export default TokenDetail
