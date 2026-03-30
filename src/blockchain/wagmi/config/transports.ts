import { http } from 'wagmi'
import { sepolia, mainnet, bsc, bscTestnet, avalanche, avalancheFuji, arbitrum, arbitrumSepolia } from 'wagmi/chains'

const ALCHEMY_KEY = import.meta.env.VITE_ALCHEMY_API_KEY

export const transports = {
  // Mainnet
  [mainnet.id]: http(`https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`),
  [bsc.id]: http(`https://bnb-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`),
  [avalanche.id]: http(`https://avax-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`),
  [arbitrum.id]: http(`https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`),

  // Testnet
  [sepolia.id]: http(`https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`),
  [bscTestnet.id]: http(`https://bnb-testnet.g.alchemy.com/v2/${ALCHEMY_KEY}`),
  [avalancheFuji.id]: http(`https://avax-fuji.g.alchemy.com/v2/${ALCHEMY_KEY}`),
  [arbitrumSepolia.id]: http(`https://arb-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`),
} as const
