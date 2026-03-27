import type { TokenMarketData } from '@/api/external/coingecko'
import { formatCompactNumber, formatPercentage } from '@/utils/utils'
import { cn } from '@/lib/utils'
import React from 'react'
import { TrendingUp, TrendingDown, BarChart3, Activity } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface MarketStatsProps {
  stats: {
    totalMarketCap: number
    totalVolume: number
    avgChange: number
    topGainer: TokenMarketData
    topLoser: TokenMarketData
  } | null
  isLoading?: boolean
}

const MarketStats: React.FC<MarketStatsProps> = ({ stats, isLoading }) => {
  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-4 space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: 'Total Market Cap',
      value: formatCompactNumber(stats.totalMarketCap),
      sub: `${stats.topGainer.name} #1`,
      icon: <BarChart3 className="w-4 h-4" />,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: '24h Volume',
      value: formatCompactNumber(stats.totalVolume),
      sub: 'Total tracked tokens',
      icon: <Activity className="w-4 h-4" />,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Top Gainer',
      value: formatPercentage(stats.topGainer.priceChange24h),
      sub: `${stats.topGainer.name} (${stats.topGainer.symbol.toUpperCase()})`,
      icon: <TrendingUp className="w-4 h-4" />,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      image: stats.topGainer.image,
    },
    {
      title: 'Top Loser',
      value: formatPercentage(stats.topLoser.priceChange24h),
      sub: `${stats.topLoser.name} (${stats.topLoser.symbol.toUpperCase()})`,
      icon: <TrendingDown className="w-4 h-4" />,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      image: stats.topLoser.image,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition-all duration-300 group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              {card.title}
            </span>
            <div className={cn('p-1.5 rounded-lg', card.bgColor, card.color)}>
              {card.icon}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {card.image && (
              <img
                src={card.image}
                alt=""
                className="w-6 h-6 rounded-full"
              />
            )}
            <p className={cn('text-xl font-bold', card.color)}>
              {card.value}
            </p>
          </div>
          <p className="text-xs text-muted-foreground mt-1 truncate">
            {card.sub}
          </p>
        </div>
      ))}
    </div>
  )
}

export default MarketStats
