import { getTokenMarketChart } from '@/api/external/coingecko'
import { queryKeys } from '@/api/shared/query-keys'
import { useQuery } from '@tanstack/react-query'

export type TimeRange = '1' | '7' | '30' | '90' | '365'

/**
 * Hook lấy chart data cho 1 token theo khoảng thời gian.
 *
 * @param coinId - ID CoinGecko (e.g. 'bitcoin')
 * @param days - Khoảng thời gian: '1' | '7' | '30' | '90' | '365'
 *
 * @example
 * ```tsx
 * const { data: chartData, isLoading } = useTokenChart('bitcoin', '7')
 * // chartData = [{ timestamp: 1711123200000, price: 67000 }, ...]
 * ```
 */
export const useTokenChart = (coinId: string | null, days: TimeRange = '7') => {
  return useQuery({
    queryKey: queryKeys.tokens.chart(coinId ?? '', days),
    queryFn: () => getTokenMarketChart(coinId!, Number(days)),
    enabled: !!coinId,
    staleTime: 5 * 60_000, // 5 phút
    refetchOnWindowFocus: false,
    retry: 1,
  })
}
