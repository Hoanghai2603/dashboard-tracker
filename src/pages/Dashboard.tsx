import ErrorState from '@/components/dashboard/ErrorState'
import MarketStats from '@/components/dashboard/MarketStats'
import { useTokenFilter } from '@/hooks/useTokenFilter'
import { useGlobalTokens, useTokens } from '@/hooks/useTokens'
import { formatCurrency, formatPercentage, formatCompactNumber } from '@/utils/utils'
import { cn } from '@/lib/utils'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUpRight, ArrowDownRight, Search, X, TrendingUp, TrendingDown, BarChart3, SlidersHorizontal } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const Dashboard: React.FC = () => {
  const navigate = useNavigate()

  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(20)

  const { data: globalData } = useGlobalTokens()
  const { data: tokens, isLoading: isTokensLoading, isError, error, refetch } = useTokens(pageSize, page)
  const { filteredTokens, searchQuery, setSearchQuery, filterPreset, setFilterPreset, sortField, setSortField, stats } =
    useTokenFilter(tokens)

  const totalActiveTokens = globalData?.activeCryptocurrencies || 0
  const totalPages = Math.ceil(totalActiveTokens / pageSize) || 1

  const filterOptions = [
    { value: 'all' as const, label: 'All', icon: <BarChart3 className="w-3 h-3" /> },
    { value: 'gainers' as const, label: 'Gainers', icon: <TrendingUp className="w-3 h-3" /> },
    { value: 'losers' as const, label: 'Losers', icon: <TrendingDown className="w-3 h-3" /> },
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Crypto Currency Prices</h2>
          <p className="text-muted-foreground mt-1">Track live prices, market cap, volume and more for the top cryptocurrencies.</p>
        </div>
      </div>

      {/* Market Stats */}
      <MarketStats stats={stats} isLoading={isTokensLoading} />

      {/* Error State */}
      {isError && <ErrorState error={error} onRetry={refetch} title="Failed to load market data" />}

      {/* Token Table */}
      {!isError && (
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
          {/* Toolbar */}
          <div className="p-4 border-b border-border flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-0 w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
              <Input
                placeholder="Search tokens..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 h-10 w-full sm:max-w-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md hover:bg-muted text-muted-foreground transition-all duration-200 focus:outline-none"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-1.5">
              {filterOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFilterPreset(opt.value)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                    filterPreset === opt.value
                      ? 'bg-primary/15 text-primary border border-primary/30'
                      : 'bg-muted/50 text-muted-foreground border border-transparent hover:bg-muted hover:text-foreground',
                  )}
                >
                  {opt.icon}
                  {opt.label}
                </button>
              ))}

              <button
                onClick={() =>
                  setSortField(sortField === 'market_cap' ? 'change_24h' : sortField === 'change_24h' ? 'volume' : 'market_cap')
                }
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all ml-1"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Sort: {sortField === 'market_cap' ? 'Market Cap' : sortField === 'change_24h' ? '24h Change' : 'Volume'}
              </button>
            </div>
          </div>

          <Table>
            <TableHeader className="bg-muted/20">
              <TableRow>
                <TableHead className="w-[50px] text-center font-bold">#</TableHead>
                <TableHead className="min-w-[180px] font-bold">Token</TableHead>
                <TableHead className="text-right font-bold">Price</TableHead>
                <TableHead className="text-right font-bold">24h %</TableHead>
                <TableHead className="text-right font-bold">Market Cap</TableHead>
                <TableHead className="text-right font-bold">Volume (24h)</TableHead>
                <TableHead className="text-right font-bold w-[120px]">Last 7 Days</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isTokensLoading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-6 mx-auto" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <div className="space-y-1.5">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-3 w-10" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20 ml-auto" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-14 ml-auto" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16 ml-auto" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16 ml-auto" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-[100px] ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredTokens.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-center">
                      <Search className="w-10 h-10 text-muted-foreground/40 mb-3" />
                      <p className="text-sm font-medium text-muted-foreground">No tokens found</p>
                      <p className="text-xs text-muted-foreground/70 mt-1">Try a different search term or filter</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTokens.map((token, index) => {
                  const isPositive = token.priceChange24h >= 0
                  const sparkData =
                    token.sparkline.length > 0 ? token.sparkline.filter((_, i) => i % 4 === 0).map((price, i) => ({ i, price })) : []

                  return (
                    <TableRow key={token.id} className="cursor-pointer group" onClick={() => navigate(`/token/${token.id}`)}>
                      <TableCell className="text-center text-sm text-muted-foreground font-medium">
                        {(page - 1) * pageSize + index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={token.image}
                            alt={token.name}
                            className="w-8 h-8 rounded-full group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                              {token.name}
                            </p>
                            <p className="text-xs text-muted-foreground uppercase">{token.symbol}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold tabular-nums">{formatCurrency(token.currentPrice)}</TableCell>
                      <TableCell className="text-right">
                        <span
                          className={cn(
                            'inline-flex items-center gap-0.5 text-sm font-semibold tabular-nums',
                            isPositive ? 'text-green-500' : 'text-red-500',
                          )}
                        >
                          {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                          {formatPercentage(token.priceChange24h)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-sm text-foreground/80 tabular-nums">
                        {formatCompactNumber(token.marketCap)}
                      </TableCell>
                      <TableCell className="text-right text-sm text-foreground/80 tabular-nums">
                        {formatCompactNumber(token.totalVolume)}
                      </TableCell>
                      <TableCell>
                        {sparkData.length > 0 ? (
                          <ResponsiveContainer width="100%" height={36}>
                            <AreaChart data={sparkData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                              <YAxis domain={['dataMin', 'dataMax']} hide />
                              <defs>
                                <linearGradient id={`spark-${token.id}`} x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor={isPositive ? '#22c55e' : '#ef4444'} stopOpacity={0.3} />
                                  <stop offset="95%" stopColor={isPositive ? '#22c55e' : '#ef4444'} stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <Area
                                type="monotone"
                                dataKey="price"
                                stroke={isPositive ? '#22c55e' : '#ef4444'}
                                strokeWidth={1.5}
                                fill={`url(#spark-${token.id})`}
                                isAnimationActive={false}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="h-9 flex items-center justify-center text-[10px] text-muted-foreground">—</div>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>

          <div className="p-4 border-t border-border bg-muted/10 flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              Showing <span className="font-medium">{(page - 1) * pageSize + 1}</span> to{' '}
              <span className="font-medium">{Math.min(page * pageSize, totalActiveTokens)}</span> of{' '}
              <span className="font-medium text-foreground">{totalActiveTokens.toLocaleString()}</span> tokens
            </div>

            <div className="flex items-center">
              <Pagination className="mx-0 w-auto">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      className={cn('cursor-pointer', page === 1 && 'pointer-events-none opacity-50')}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    />
                  </PaginationItem>

                  {/* Simple pagination logic */}
                  {page > 2 && (
                    <PaginationItem>
                      <PaginationLink onClick={() => setPage(1)}>1</PaginationLink>
                    </PaginationItem>
                  )}
                  {page > 3 && <PaginationEllipsis />}

                  {page > 1 && (
                    <PaginationItem>
                      <PaginationLink onClick={() => setPage(page - 1)}>{page - 1}</PaginationLink>
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    <PaginationLink isActive>{page}</PaginationLink>
                  </PaginationItem>

                  {page < totalPages && (
                    <PaginationItem>
                      <PaginationLink onClick={() => setPage(page + 1)}>{page + 1}</PaginationLink>
                    </PaginationItem>
                  )}

                  {page < totalPages - 2 && <PaginationEllipsis />}
                  {page < totalPages - 1 && (
                    <PaginationItem>
                      <PaginationLink onClick={() => setPage(totalPages)}>{totalPages}</PaginationLink>
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      className={cn('cursor-pointer', page === totalPages && 'pointer-events-none opacity-50')}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground whitespace-nowrap">Per page</span>
                <Select
                  value={pageSize.toString()}
                  onValueChange={(val) => {
                    setPageSize(Number(val))
                    setPage(1)
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={pageSize.toString()} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
