import { http } from 'wagmi'
import { sepolia, mainnet, bsc, bscTestnet } from 'wagmi/chains'

const ALCHEMY_KEY = import.meta.env.VITE_ALCHEMY_API_KEY

/**
 * RPC Transport configuration cho từng chain.
 *
 * Mỗi chain cần 1 transport entry trỏ tới RPC node.
 * Hiện tại dùng Alchemy cho Sepolia & Mainnet.
 *
 * Khi thêm chain mới, thêm 1 entry vào object này.
 * Nếu chain không có RPC riêng, wagmi sẽ fallback về public RPC.
 */
export const transports = {
  [sepolia.id]: http(`https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`),
  [mainnet.id]: http(`https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`),
  [bsc.id]: http(`https://bnb-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`),
  [bscTestnet.id]: http(`https://bnb-testnet.g.alchemy.com/v2/${ALCHEMY_KEY}`),
} as const
