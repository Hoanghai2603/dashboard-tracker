import axios from 'axios'

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3'

export interface TokenPriceData {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  price_change_percentage_24h?: number
  market_cap: number
  total_volume: number
  sparkline_in_7d?: {
    price: number[]
  }
}

export const getTopTokens = async (limit = 10): Promise<TokenPriceData[]> => {
  const response = await axios.get(`${COINGECKO_API_URL}/coins/markets`, {
    params: {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: limit,
      page: 1,
      sparkline: true,
      price_change_percentage: '24h',
    },
  })

  return response.data
}
