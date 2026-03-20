import { getTopTokens } from '@/services/coingeckoService/coingeckoService'
import { useQuery } from '@tanstack/react-query'

export const useTokens = (limit = 10) => {
  return useQuery({
    queryKey: ['topTokens', limit],
    queryFn: () => getTopTokens(limit),
    refetchInterval: 60 * 1000,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  })
}
