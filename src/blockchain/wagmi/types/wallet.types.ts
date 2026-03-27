// ─── Supported Wallet Enum ───────────────────────────────────────
export enum SupportedWallet {
  METAMASK = 'metamask',
  INJECTED = 'injected',
  COINBASE = 'coinbase',
  WALLET_CONNECT = 'walletConnect',
}

// ─── Wallet Metadata ─────────────────────────────────────────────
export interface WalletInfo {
  id: SupportedWallet
  name: string
  iconUrl?: string
  description: string
  isEnabled: boolean
}

// ─── Chain Types ─────────────────────────────────────────────────
export interface SupportedChainConfig {
  chainId: number
  name: string
  isTestnet: boolean
  rpcUrl: string
  blockExplorerUrl: string
}

// ─── Connector Result ────────────────────────────────────────────
export interface WalletConnectionResult {
  address: string
  chainId: number
  connector: string
}

// ─── Storage Config ──────────────────────────────────────────────
export interface WagmiStorageConfig {
  keyPrefix: string
  storage: Storage
}
