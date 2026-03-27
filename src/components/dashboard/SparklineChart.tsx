import type { TokenMarketData } from '@/api/external/coingecko'
import { formatNumber } from '@/utils/utils'
import React from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface SparklineProps {
  token?: TokenMarketData
}

const formatYAxis = (value: number) => {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
  if (value >= 1e3) return `$${(value / 1e3).toFixed(value >= 10000 ? 0 : 1)}K`
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: value < 1 ? 4 : 2 })}`
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    const dateObj = new Date(data.time) // an toàn parse timestamp
    const dateStr = dateObj.toLocaleString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

    return (
      <div className="bg-card border border-border p-3 rounded-lg shadow-xl min-w-[160px]">
        <p className="text-xs text-muted-foreground mb-1 font-medium">{dateStr}</p>
        <p className="font-semibold text-lg text-foreground">${formatNumber(payload[0].value)}</p>
      </div>
    )
  }
  return null
}

const SparklineChart: React.FC<SparklineProps> = ({ token }) => {
  if (!token || !token.sparkline) return null
  if (token.sparkline.length === 0) return null

  const rates = token.sparkline
  const isPositive = token.priceChange24h >= 0
  const color = isPositive ? '#22c55e' : '#ef4444'

  // CoinGecko trả về 168 điểm cho 7 ngày (mỗi điểm cách nhau 1 giờ)
  const now = new Date().getTime()
  const dataPoints = rates.length

  const chartData = rates.map((value: number, index: number) => {
    // Trừ lùi thời gian theo giờ bằng timestamp số nguyên để dễ dàng scale trên XAxis
    const time = now - (dataPoints - 1 - index) * 60 * 60 * 1000
    return { value, time }
  })

  // Chọn hiển thị chính xác 1 Tick mốc thời gian mỗi 24 tiếng (mỗi ngày), bắt đầu từ hiện tại lùi về
  const ticks: number[] = []
  for (let i = dataPoints - 1; i >= 0; i -= 24) {
    if (chartData[i]) {
      ticks.unshift(chartData[i].time)
    }
  }

  // Tránh biểu đồ bị bẹp dí, setup domain min max hợp lý để biểu đồ phủ đầy
  const minVal = Math.min(...rates)
  const maxVal = Math.max(...rates)
  const diff = maxVal - minVal
  const domain = [minVal - diff * 0.05, maxVal + diff * 0.05]

  return (
    <div className="h-full w-full select-none pt-4 outline-none focus:outline-none">
      <ResponsiveContainer width="100%" height="100%" className="outline-none focus:outline-none">
        <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} style={{ outline: 'none' }}>
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            type="number"
            domain={['dataMin', 'dataMax']}
            ticks={ticks}
            tickFormatter={(time) => {
              const date = new Date(time)
              return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
            }}
            tick={{ fill: 'currentColor', fontSize: 10, opacity: 0.5 }}
            axisLine={false}
            tickLine={false}
            dy={10}
          />
          <YAxis
            domain={domain}
            tickFormatter={formatYAxis}
            width={70}
            tick={{ fill: 'currentColor', fontSize: 10, opacity: 0.5 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'currentColor', strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.2 }} />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorGradient)"
            isAnimationActive={true}
            animationDuration={800}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default SparklineChart
