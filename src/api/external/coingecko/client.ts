import { HttpClient, createHttpClient } from '../../core'

/**
 * CoinGecko API Client.
 * - baseURL: Free API v3
 * - timeout: 15s (external API có thể chậm hơn internal)
 * - Không cần auth header
 */
const coingeckoAxiosInstance = createHttpClient({
  baseURL: 'https://api.coingecko.com/api/v3',
  timeout: 15000,
})

export const coingeckoClient = new HttpClient(coingeckoAxiosInstance)
