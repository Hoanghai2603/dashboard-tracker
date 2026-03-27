import type { TokenMarketData } from '@/api/external/coingecko'
import { useMemo, useState } from 'react'

// ─── Sort Options ────────────────────────────────────────────────
export type SortField = 'market_cap' | 'price' | 'change_24h' | 'volume' | 'name'
export type SortDirection = 'asc' | 'desc'

// ─── Filter Options ──────────────────────────────────────────────
export type FilterPreset = 'all' | 'gainers' | 'losers'

export interface TokenFilterState {
  searchQuery: string
  sortField: SortField
  sortDirection: SortDirection
  filterPreset: FilterPreset
}

const defaultFilterState: TokenFilterState = {
  searchQuery: '',
  sortField: 'market_cap',
  sortDirection: 'desc',
  filterPreset: 'all',
}

/**
 * Hook quản lý search, filter, sort cho token list.
 *
 * @param tokens - Danh sách token gốc từ API
 * @returns { filteredTokens, ...handlers }
 *
 * @example
 * ```tsx
 * const { filteredTokens, searchQuery, setSearchQuery, sortField } = useTokenFilter(tokens)
 * ```
 */
export const useTokenFilter = (tokens: TokenMarketData[] = []) => {
  const [filterState, setFilterState] = useState<TokenFilterState>(defaultFilterState)

  const filteredTokens = useMemo(() => {
    let result = [...tokens]

    // 1. Search filter
    if (filterState.searchQuery.trim()) {
      const query = filterState.searchQuery.toLowerCase().trim()
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.symbol.toLowerCase().includes(query),
      )
    }

    // 2. Filter preset
    switch (filterState.filterPreset) {
      case 'gainers':
        result = result.filter((t) => t.priceChange24h > 0)
        break
      case 'losers':
        result = result.filter((t) => t.priceChange24h < 0)
        break
      default:
        break
    }

    // 3. Sort
    result.sort((a, b) => {
      let comparison = 0
      switch (filterState.sortField) {
        case 'market_cap':
          comparison = a.marketCap - b.marketCap
          break
        case 'price':
          comparison = a.currentPrice - b.currentPrice
          break
        case 'change_24h':
          comparison = a.priceChange24h - b.priceChange24h
          break
        case 'volume':
          comparison = a.totalVolume - b.totalVolume
          break
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
      }
      return filterState.sortDirection === 'desc' ? -comparison : comparison
    })

    return result
  }, [tokens, filterState])

  // ─── Handlers ────────────────────────────────────────────────
  const setSearchQuery = (query: string) =>
    setFilterState((prev) => ({ ...prev, searchQuery: query }))

  const setSortField = (field: SortField) =>
    setFilterState((prev) => ({
      ...prev,
      sortField: field,
      // Toggle direction nếu click vào cùng field
      sortDirection:
        prev.sortField === field && prev.sortDirection === 'desc' ? 'asc' : 'desc',
    }))

  const setFilterPreset = (preset: FilterPreset) =>
    setFilterState((prev) => ({ ...prev, filterPreset: preset }))

  const resetFilters = () => setFilterState(defaultFilterState)

  // ─── Stats ───────────────────────────────────────────────────
  const stats = useMemo(() => {
    if (!tokens.length) return null

    const totalMarketCap = tokens.reduce((sum, t) => sum + t.marketCap, 0)
    const totalVolume = tokens.reduce((sum, t) => sum + t.totalVolume, 0)
    const avgChange = tokens.reduce((sum, t) => sum + t.priceChange24h, 0) / tokens.length
    const topGainer = tokens.reduce((top, t) =>
      t.priceChange24h > (top?.priceChange24h ?? -Infinity) ? t : top,
    )
    const topLoser = tokens.reduce((bottom, t) =>
      t.priceChange24h < (bottom?.priceChange24h ?? Infinity) ? t : bottom,
    )

    return { totalMarketCap, totalVolume, avgChange, topGainer, topLoser }
  }, [tokens])

  return {
    // State
    ...filterState,
    filteredTokens,
    stats,

    // Handlers
    setSearchQuery,
    setSortField,
    setFilterPreset,
    resetFilters,
  }
}
