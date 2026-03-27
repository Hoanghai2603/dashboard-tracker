import { getTokenDetail } from '@/api/external/coingecko'
import { queryKeys } from '@/api/shared/query-keys'
import { useQuery } from '@tanstack/react-query'

/**
 * Hook lấy chi tiết 1 token từ CoinGecko.
 *
 * @param coinId - ID CoinGecko (e.g. 'bitcoin')
 * @returns React Query result với data: TokenDetailData
 */
export const useTokenDetail = (coinId: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.tokens.detail(coinId ?? ''),
    queryFn: () => getTokenDetail(coinId!),
    enabled: !!coinId,
    staleTime: 2 * 60_000, // 2 phút
    refetchOnWindowFocus: false,
    retry: 2,
  })
}
