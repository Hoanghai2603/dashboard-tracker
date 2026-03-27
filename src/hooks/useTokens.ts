import { getGlobalTokens, getTopTokens } from '@/api/external/coingecko'
import { queryKeys } from '@/api/shared/query-keys'
import { useQuery } from '@tanstack/react-query'

/**
 * Hook lấy danh sách top tokens từ CoinGecko.
 *
 * @param limit - Số lượng token (default: 20)
 * @returns React Query result với data: TokenMarketData[]
 *
 * Đã sửa:
 * - Không nuốt lỗi nữa, error sẽ được throw đúng cách
 * - Trả về đầy đủ isError, error, refetch cho UI xử lý
 * - Dùng query key factory từ shared/query-keys
 */
export const useTokens = (limit = 20, page = 1) => {
  return useQuery({
    queryKey: queryKeys.tokens.list(limit, page),
    queryFn: () => getTopTokens(limit, page),
    refetchInterval: 60_000,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    retry: 2,
  })
}

export const useGlobalTokens = () => {
  return useQuery({
    queryKey: queryKeys.tokens.global(),
    queryFn: () => getGlobalTokens(),
    refetchInterval: 600_000,
    staleTime: 600_000,
    refetchOnWindowFocus: false,
    retry: 2,
  })
}
