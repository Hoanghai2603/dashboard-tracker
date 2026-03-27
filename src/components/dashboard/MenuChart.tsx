import { Skeleton } from '@/components/ui/skeleton'
import type { TokenMarketData } from '@/api/external/coingecko'
import { formatPercentage } from '@/utils/utils'
import React, { useState } from 'react'
import SparklineChart from './SparklineChart'

interface MenuChartProps {
  data: TokenMarketData[]
  isLoading?: boolean
}

const MenuChart: React.FC<MenuChartProps> = ({ data, isLoading }) => {
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null)

  const actualSelectedTokenId = selectedTokenId || (data?.length > 0 ? data[0].id : null)
  const selectedToken = data?.find((t) => t.id === actualSelectedTokenId)

  if (isLoading || !data || data.length === 0) {
    return (
      <div className="h-[480px] w-full bg-card rounded-xl border border-border overflow-hidden flex shadow-sm">
        {/* Skeleton Trái: Chart */}
        <div className="w-3/4 h-full p-6 flex flex-col">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            <div className="text-right flex flex-col items-end space-y-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          <Skeleton className="flex-1 w-full min-h-0 rounded-lg" />
        </div>

        <div className="w-1/4 h-full border-l border-border bg-card/40 flex flex-col relative ">
          <div className="p-4 border-b border-border bg-card/80 backdrop-blur-md z-10 sticky top-0 flex items-center justify-between">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-16 rounded-full" />
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1 max-h-[95%]">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-full flex justify-between items-center px-3 py-3 rounded-lg border border-transparent">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-10" />
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-3 w-10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[480px] w-full bg-card rounded-xl border border-border overflow-hidden flex shadow-sm">
      <div className="w-3/4 h-full p-6 flex flex-col">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {selectedToken?.image && <img src={selectedToken.image} alt={selectedToken.name} className="w-10 h-10 rounded-full" />}
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                {selectedToken?.name}
                <span className="text-muted-foreground text-sm uppercase font-medium">{selectedToken?.symbol}</span>
              </h3>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">${selectedToken?.currentPrice.toLocaleString()}</div>
            <div
              className={`text-sm font-medium flex items-center justify-end gap-1 ${selectedToken?.priceChange24h || 0 >= 0 ? 'text-green-500' : 'text-red-500'}`}
            >
              {formatPercentage(Number(selectedToken?.priceChange24h))}
            </div>
          </div>
        </div>

        <div className="flex-1 w-full min-h-0">
          <SparklineChart token={selectedToken} />
        </div>
      </div>

      <div className="w-1/4 h-full border-l border-border bg-card/40 flex flex-col relative ">
        <div className="p-4 border-b border-border bg-card/80 backdrop-blur-md z-10 sticky top-0 flex items-center justify-between">
          <h4 className="font-bold text-sm text-foreground uppercase tracking-wider flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Market
          </h4>
          <span className="text-xs text-muted-foreground font-medium bg-muted px-2 py-0.5 rounded-full">{data.length} Assets</span>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1 max-h-[95%]">
          {data.map((token, index) => {
            const isSelected = actualSelectedTokenId === token.id
            const isPositive = token.priceChange24h >= 0

            return (
              <button
                key={token.id}
                onClick={() => setSelectedTokenId(token.id)}
                className={`w-full group flex justify-between items-center px-3 py-3 rounded-lg transition-all duration-300 relative overflow-hidden ${
                  isSelected
                    ? 'bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.1)]'
                    : 'border border-transparent hover:bg-muted/80 hover:border-border/50'
                }`}
              >
                {/* Thanh dọc Active Indicator */}
                {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_8px_var(--primary)]" />}

                <div className="flex items-center gap-3 relative z-10">
                  <div className="relative">
                    <img
                      src={token.image}
                      alt={token.name}
                      className={`w-8 h-8 rounded-full transition-transform duration-300 ${isSelected ? 'scale-110' : 'group-hover:scale-105'}`}
                    />
                    <div className="absolute -bottom-1 -right-1 bg-background text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-border">
                      {index + 1}
                    </div>
                  </div>
                  <div className="text-left">
                    <p className={`font-semibold text-sm leading-none mb-1 ${isSelected ? 'text-foreground' : 'text-foreground/80'}`}>
                      {token.name}
                    </p>
                    <p className="text-xs text-muted-foreground uppercase font-medium">{token.symbol}</p>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end relative z-10">
                  <p className={`font-semibold text-sm ${isSelected ? 'text-foreground' : 'text-foreground/90'}`}>
                    ${token.currentPrice.toLocaleString(undefined, { maximumFractionDigits: token.currentPrice < 1 ? 4 : 2 })}
                  </p>
                  <p
                    className={`text-[11px] font-bold mt-1 tracking-wide px-1.5 py-0.5 rounded-md ${
                      isPositive
                        ? isSelected
                          ? 'bg-green-500/10 text-green-500'
                          : 'text-green-500'
                        : isSelected
                          ? 'bg-red-500/10 text-red-500'
                          : 'text-red-500'
                    }`}
                  >
                    {formatPercentage(Number(token?.priceChange24h))}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default MenuChart
