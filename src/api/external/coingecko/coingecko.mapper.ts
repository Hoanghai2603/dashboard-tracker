import type {
  CoinGeckoMarketItem,
  CoinGeckoDetailResponse,
  CoinGeckoMarketChartResponse,
  TokenMarketData,
  TokenDetailData,
  TokenChartDataPoint,
  CoinGeckoGlobalResponse,
  GlobalMarketData,
} from './coingecko.types'

/**
 * Map raw CoinGecko market item → app-friendly TokenMarketData.
 * Chuyển đổi snake_case → camelCase, handle null safety.
 */
export function mapMarketItem(item: CoinGeckoMarketItem): TokenMarketData {
  return {
    id: item.id,
    symbol: item.symbol,
    name: item.name,
    image: item.image,
    currentPrice: item.current_price,
    priceChange24h: item.price_change_percentage_24h ?? 0,
    marketCap: item.market_cap,
    marketCapRank: item.market_cap_rank,
    totalVolume: item.total_volume,
    high24h: item.high_24h,
    low24h: item.low_24h,
    circulatingSupply: item.circulating_supply,
    totalSupply: item.total_supply,
    maxSupply: item.max_supply,
    ath: item.ath,
    athChangePercentage: item.ath_change_percentage,
    atl: item.atl,
    atlChangePercentage: item.atl_change_percentage,
    lastUpdated: item.last_updated,
    sparkline: item.sparkline_in_7d?.price ?? [],
  }
}

/**
 * Map raw CoinGecko market chart → array of TokenChartDataPoint.
 */
export function mapMarketChart(response: CoinGeckoMarketChartResponse): TokenChartDataPoint[] {
  return response.prices.map(([timestamp, price]) => ({
    timestamp,
    price,
  }))
}

/**
 * Map raw CoinGecko coin detail → app-friendly TokenDetailData.
 */
export function mapCoinDetail(data: CoinGeckoDetailResponse): TokenDetailData {
  return {
    id: data.id,
    symbol: data.symbol,
    name: data.name,
    description: data.description.en,
    image: data.image.large,
    currentPrice: data.market_data.current_price.usd,
    marketCap: data.market_data.market_cap.usd,
    totalVolume: data.market_data.total_volume.usd,
    high24h: data.market_data.high_24h.usd,
    low24h: data.market_data.low_24h.usd,
    priceChange24h: data.market_data.price_change_percentage_24h,
    priceChange7d: data.market_data.price_change_percentage_7d,
    priceChange30d: data.market_data.price_change_percentage_30d,
    circulatingSupply: data.market_data.circulating_supply,
    totalSupply: data.market_data.total_supply,
    maxSupply: data.market_data.max_supply,
    ath: data.market_data.ath.usd,
    atl: data.market_data.atl.usd,
    marketCapRank: data.market_cap_rank,
    homepageUrl: data.links.homepage?.[0] || null,
    lastUpdated: data.last_updated,
  }
}

/**
 * Map raw CoinGecko global → app-friendly GlobalMarketData.
 */
export function mapGlobalData(response: CoinGeckoGlobalResponse): GlobalMarketData {
  const { data } = response

  return {
    activeCryptocurrencies: data.active_cryptocurrencies,
    upcomingIcos: data.upcoming_icos,
    ongoingIcos: data.ongoing_icos,
    endedIcos: data.ended_icos,
    markets: data.markets,
    totalMarketCap: data.total_market_cap,
    totalVolume: data.total_volume,
    marketCapPercentage: data.market_cap_percentage,
    marketCapChangePercentage24hUsd: data.market_cap_change_percentage_24h_usd,
    volumeChangePercentage24hUsd: data.volume_change_percentage_24h_usd,
    updatedAt: data.updated_at,
  }
}
