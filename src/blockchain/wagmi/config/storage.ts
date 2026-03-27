import { createStorage } from 'wagmi'

/**
 * Wagmi storage configuration.
 *
 * Custom key prefix để tránh xung đột với các app khác
 * cùng chạy trên localhost trong quá trình development.
 *
 * Wagmi dùng storage để persist:
 * - Connected wallet state
 * - Last connected connector
 * - Chain selection
 */
export const wagmiStorage = createStorage({
  key: 'crypto-dashboard',
  storage: typeof window !== 'undefined' ? window.localStorage : undefined,
})
