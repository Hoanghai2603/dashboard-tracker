// ─── Config ──────────────────────────────────────────────────────
export { wagmiConfig } from './config/wagmi.config'
export { supportedChains, defaultChain } from './config/chains'
export { transports } from './config/transports'
export { wagmiStorage } from './config/storage'

// ─── Connectors ──────────────────────────────────────────────────
export { walletConnectors } from './connectors'

// ─── Types ───────────────────────────────────────────────────────
export type {
  SupportedChainConfig,
  WalletInfo,
  WalletConnectionResult,
  WagmiStorageConfig,
} from './types/wallet.types'
export { SupportedWallet } from './types/wallet.types'
