import { injectedConnector } from './injected.connector'
import { walletConnectConnector } from './walletConnect.connector'

/**
 * Registry tất cả wallet connectors được hỗ trợ.
 *
 * Khi cần thêm connector mới:
 * 1. Tạo file mới: metaMask.connector.ts, walletConnect.connector.ts, ...
 * 2. Import và thêm vào mảng này
 *
 * @example
 * // Thêm WalletConnect:
 * import { walletConnectConnector } from './walletConnect.connector'
 * export const walletConnectors = [injectedConnector, walletConnectConnector]
 */
export const walletConnectors = [injectedConnector, walletConnectConnector]
