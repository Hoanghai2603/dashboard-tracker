// ─── Raw API Response Types (snake_case - đúng format CoinGecko) ─────

/** Response item từ /coins/markets */
export interface CoinGeckoMarketItem {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  price_change_percentage_24h: number | null
  market_cap: number
  market_cap_rank: number | null
  total_volume: number
  high_24h: number | null
  low_24h: number | null
  circulating_supply: number | null
  total_supply: number | null
  max_supply: number | null
  ath: number | null
  ath_change_percentage: number | null
  ath_date: string | null
  atl: number | null
  atl_change_percentage: number | null
  atl_date: string | null
  last_updated: string
  sparkline_in_7d?: {
    price: number[]
  }
}

/** Response từ /coins/{id}/market_chart */
export interface CoinGeckoMarketChartResponse {
  prices: [number, number][]        // [timestamp, price]
  market_caps: [number, number][]   // [timestamp, market_cap]
  total_volumes: [number, number][] // [timestamp, volume]
}

/** Response từ /global */
export interface CoinGeckoGlobalResponse {
  data: {
    active_cryptocurrencies: number
    upcoming_icos: number
    ongoing_icos: number
    ended_icos: number
    markets: number
    total_market_cap: Record<string, number>
    total_volume: Record<string, number>
    market_cap_percentage: Record<string, number>
    market_cap_change_percentage_24h_usd: number
    volume_change_percentage_24h_usd: number
    updated_at: number
  }
}

/** Response từ /coins/{id} */
export interface CoinGeckoDetailResponse {
  id: string
  symbol: string
  name: string
  description: {
    en: string
  }
  image: {
    thumb: string
    small: string
    large: string
  }
  market_data: {
    current_price: { usd: number }
    market_cap: { usd: number }
    total_volume: { usd: number }
    high_24h: { usd: number }
    low_24h: { usd: number }
    price_change_percentage_24h: number | null
    price_change_percentage_7d: number | null
    price_change_percentage_30d: number | null
    circulating_supply: number | null
    total_supply: number | null
    max_supply: number | null
    ath: { usd: number }
    atl: { usd: number }
  }
  market_cap_rank: number | null
  links: {
    homepage: string[]
    blockchain_site: string[]
  }
  last_updated: string
}

// ─── Params Types ──────────────────────────────────────────────

export interface CoinGeckoMarketsParams {
  vs_currency: string
  order?: string
  per_page?: number
  page?: number
  sparkline?: boolean
  price_change_percentage?: string
  ids?: string
}

export interface CoinGeckoMarketChartParams {
  vs_currency: string
  days: string | number
  interval?: string
}

// ─── App-Friendly Types (camelCase - dùng trong toàn bộ app) ────

export interface TokenMarketData {
  id: string
  symbol: string
  name: string
  image: string
  currentPrice: number
  priceChange24h: number
  marketCap: number
  marketCapRank: number | null
  totalVolume: number
  high24h: number | null
  low24h: number | null
  circulatingSupply: number | null
  totalSupply: number | null
  maxSupply: number | null
  ath: number | null
  athChangePercentage: number | null
  atl: number | null
  atlChangePercentage: number | null
  lastUpdated: string
  sparkline: number[]
}

export interface TokenChartDataPoint {
  timestamp: number
  price: number
}

export interface TokenDetailData {
  id: string
  symbol: string
  name: string
  description: string
  image: string
  currentPrice: number
  marketCap: number
  totalVolume: number
  high24h: number
  low24h: number
  priceChange24h: number | null
  priceChange7d: number | null
  priceChange30d: number | null
  circulatingSupply: number | null
  totalSupply: number | null
  maxSupply: number | null
  ath: number
  atl: number
  marketCapRank: number | null
  homepageUrl: string | null
  lastUpdated: string
}

export interface GlobalMarketData {
  activeCryptocurrencies: number
  upcomingIcos: number
  ongoingIcos: number
  endedIcos: number
  markets: number
  totalMarketCap: Record<string, number>
  totalVolume: Record<string, number>
  marketCapPercentage: Record<string, number>
  marketCapChangePercentage24hUsd: number
  volumeChangePercentage24hUsd: number
  updatedAt: number
}
