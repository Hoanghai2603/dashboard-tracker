import { coingeckoClient } from './client'
import { mapMarketItem, mapMarketChart, mapCoinDetail, mapGlobalData } from './coingecko.mapper'
import type {
  CoinGeckoMarketItem,
  CoinGeckoMarketChartResponse,
  CoinGeckoDetailResponse,
  TokenMarketData,
  TokenChartDataPoint,
  TokenDetailData,
  CoinGeckoGlobalResponse,
  GlobalMarketData,
} from './coingecko.types'

/**
 * Lấy danh sách token top market cap.
 */
export async function getTopTokens(limit = 20, page = 1): Promise<TokenMarketData[]> {
  const data = await coingeckoClient.get<CoinGeckoMarketItem[]>('/coins/markets', {
    params: {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: limit,
      page: page,
      sparkline: true,
      price_change_percentage: '24h',
    },
  })

  return data.map(mapMarketItem)
}

/**
 * Lấy chart data cho token theo khoảng thời gian.
 */
export async function getTokenMarketChart(coinId: string, days: number | string = 7): Promise<TokenChartDataPoint[]> {
  const data = await coingeckoClient.get<CoinGeckoMarketChartResponse>(`/coins/${coinId}/market_chart`, {
    params: {
      vs_currency: 'usd',
      days: days.toString(),
    },
  })

  return mapMarketChart(data)
}

/**
 * Lấy chi tiết 1 token (dùng cho trang Token Detail).
 *
 * @param coinId - ID CoinGecko (e.g. 'bitcoin')
 * @returns TokenDetailData - Thông tin chi tiết đã map sang camelCase
 */
export async function getTokenDetail(coinId: string): Promise<TokenDetailData> {
  const data = await coingeckoClient.get<CoinGeckoDetailResponse>(`/coins/${coinId}`, {
    params: {
      localization: false,
      tickers: false,
      market_data: true,
      community_data: false,
      developer_data: false,
      sparkline: false,
    },
  })

  return mapCoinDetail(data)
}

/**
 * Tìm kiếm token theo query string.
 */
export async function searchTokens(query: string): Promise<{
  coins: Array<{
    id: string
    name: string
    symbol: string
    market_cap_rank: number | null
    thumb: string
    large: string
  }>
}> {
  return coingeckoClient.get('/search', {
    params: { query },
  })
}

/**
 * Lấy thông tin thị trường toàn cầu.
 */
export async function getGlobalTokens(): Promise<GlobalMarketData> {
  const data = await coingeckoClient.get<CoinGeckoGlobalResponse>('/global')
  return mapGlobalData(data)
}
