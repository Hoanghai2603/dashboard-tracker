import { injected } from 'wagmi/connectors'

/**
 * Injected wallet connector (MetaMask, Brave Wallet, etc.)
 *
 * shimDisconnect: true — Giúp xử lý case MetaMask không phát
 * event disconnect đúng cách khi user lock wallet.
 */
export const injectedConnector = injected({
  shimDisconnect: true,
})
