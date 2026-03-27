import { createConfig } from 'wagmi'
import { supportedChains } from './chains'
import { transports } from './transports'
import { wagmiStorage } from './storage'
import { walletConnectors } from '../connectors'

/**
 * Wagmi configuration tổng hợp.
 *
 * File này là "main board" nối tất cả module:
 * - chains.ts     → Mạng blockchain nào được hỗ trợ
 * - transports.ts → RPC endpoint cho mỗi chain
 * - storage.ts    → Persist wallet state
 * - connectors/   → Danh sách wallet connectors
 *
 * Import config này trong main.tsx để pass vào WagmiProvider.
 */
export const wagmiConfig = createConfig({
  chains: supportedChains,
  connectors: walletConnectors,
  transports,
  storage: wagmiStorage,
})
