import type { TokenMarketData } from '@/api/external/coingecko'
import { formatCurrency, formatPercentage, formatCompactNumber } from '@/utils/utils'
import { cn } from '@/lib/utils'
import React from 'react'
import { ArrowUpRight, ArrowDownRight, Search, SlidersHorizontal, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react'
import type { FilterPreset, SortField } from '@/hooks/useTokenFilter'

interface TokenListProps {
  tokens: TokenMarketData[]
  selectedTokenId: string | null
  onSelectToken: (id: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  filterPreset: FilterPreset
  onFilterChange: (preset: FilterPreset) => void
  sortField: SortField
  onSortChange: (field: SortField) => void
  isLoading?: boolean
}

const filterOptions: { value: FilterPreset; label: string; icon: React.ReactNode }[] = [
  { value: 'all', label: 'All', icon: <BarChart3 className="w-3 h-3" /> },
  { value: 'gainers', label: 'Gainers', icon: <TrendingUp className="w-3 h-3" /> },
  { value: 'losers', label: 'Losers', icon: <TrendingDown className="w-3 h-3" /> },
]

const TokenList: React.FC<TokenListProps> = ({
  tokens,
  selectedTokenId,
  onSelectToken,
  searchQuery,
  onSearchChange,
  filterPreset,
  onFilterChange,
  sortField,
  onSortChange,
  isLoading,
}) => {
  if (isLoading) {
    return <TokenListSkeleton />
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden flex flex-col shadow-sm h-full">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-10 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-foreground uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            Market
          </h4>
          <span className="text-xs text-muted-foreground font-medium bg-muted px-2 py-0.5 rounded-full">
            {tokens.length} Assets
          </span>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tokens..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-muted/50 border border-border rounded-lg pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onFilterChange(opt.value)}
              className={cn(
                'flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all duration-200',
                filterPreset === opt.value
                  ? 'bg-primary/15 text-primary border border-primary/30'
                  : 'bg-muted/50 text-muted-foreground border border-transparent hover:bg-muted hover:text-foreground',
              )}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}

          <div className="ml-auto">
            <button
              onClick={() => onSortChange(sortField === 'market_cap' ? 'change_24h' : 'market_cap')}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
            >
              <SlidersHorizontal className="w-3 h-3" />
              {sortField === 'market_cap' ? 'Cap' : sortField === 'change_24h' ? '24h' : sortField === 'price' ? 'Price' : 'Vol'}
            </button>
          </div>
        </div>
      </div>

      {/* Token List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-0.5">
        {tokens.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="w-8 h-8 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground font-medium">No tokens found</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Try a different search term</p>
          </div>
        ) : (
          tokens.map((token, index) => {
            const isSelected = selectedTokenId === token.id
            const isPositive = token.priceChange24h >= 0

            return (
              <button
                key={token.id}
                onClick={() => onSelectToken(token.id)}
                className={cn(
                  'w-full group flex justify-between items-center px-3 py-2.5 rounded-lg transition-all duration-200 relative overflow-hidden',
                  isSelected
                    ? 'bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.1)]'
                    : 'border border-transparent hover:bg-muted/80 hover:border-border/50',
                )}
              >
                {/* Active indicator bar */}
                {isSelected && (
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary shadow-[0_0_8px_var(--primary)]" />
                )}

                <div className="flex items-center gap-3 relative z-10 min-w-0">
                  <div className="relative flex-shrink-0">
                    <img
                      src={token.image}
                      alt={token.name}
                      className={cn(
                        'w-8 h-8 rounded-full transition-transform duration-300',
                        isSelected ? 'scale-110' : 'group-hover:scale-105',
                      )}
                    />
                    <div className="absolute -bottom-1 -right-1 bg-background text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center border border-border">
                      {index + 1}
                    </div>
                  </div>
                  <div className="text-left min-w-0">
                    <p className={cn('font-semibold text-sm leading-none mb-1 truncate', isSelected ? 'text-foreground' : 'text-foreground/80')}>
                      {token.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase font-medium">
                      {token.symbol}
                      <span className="ml-1.5 text-muted-foreground/60">
                        {formatCompactNumber(token.marketCap)}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end relative z-10 flex-shrink-0">
                  <p className={cn('font-semibold text-sm tabular-nums', isSelected ? 'text-foreground' : 'text-foreground/90')}>
                    {formatCurrency(token.currentPrice)}
                  </p>
                  <div
                    className={cn(
                      'flex items-center gap-0.5 text-[10px] font-bold mt-0.5 tabular-nums',
                      isPositive ? 'text-green-500' : 'text-red-500',
                    )}
                  >
                    {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {formatPercentage(token.priceChange24h)}
                  </div>
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}

// ─── Skeleton Component ──────────────────────────────────────────

const TokenListSkeleton: React.FC = () => {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden flex flex-col shadow-sm h-full">
      <div className="p-4 border-b border-border space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 w-16 bg-muted rounded animate-pulse" />
          <div className="h-4 w-12 bg-muted rounded-full animate-pulse" />
        </div>
        <div className="h-8 w-full bg-muted rounded-lg animate-pulse" />
        <div className="flex gap-1.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-6 w-16 bg-muted rounded-md animate-pulse" />
          ))}
        </div>
      </div>
      <div className="flex-1 p-2 space-y-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between px-3 py-2.5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
              <div className="space-y-1.5">
                <div className="h-3.5 w-20 bg-muted rounded animate-pulse" />
                <div className="h-2.5 w-12 bg-muted rounded animate-pulse" />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="h-3.5 w-16 bg-muted rounded animate-pulse" />
              <div className="h-2.5 w-10 bg-muted rounded animate-pulse ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TokenList
