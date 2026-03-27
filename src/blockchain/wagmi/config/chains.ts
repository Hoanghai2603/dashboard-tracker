import { sepolia, mainnet, bsc, bscTestnet, } from 'wagmi/chains'

const isProduction = import.meta.env.MODE === 'production'

/**
 * Danh sách các chain được hỗ trợ.
 *
 * - Development: Sepolia testnet (an toàn, không mất tiền thật)
 * - Production:  Ethereum mainnet (cần cẩn thận)
 *
 * Khi thêm chain mới (BSC, Polygon, Arbitrum...) chỉ cần
 * import và thêm vào mảng tương ứng.
 */
export const supportedChains = isProduction
  ? [mainnet, bsc] as const
  : [sepolia, bscTestnet] as const

export const defaultChain = isProduction ? mainnet : sepolia
