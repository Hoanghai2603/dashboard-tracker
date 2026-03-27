import { shortAddress } from '@/utils/utils'
import { useBalance, useAccount } from 'wagmi'

export const useWallet = () => {
  const { address, isConnected, chainId, chain, isConnecting, isReconnecting } = useAccount()
  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    address,
    query: {
      enabled: !!address,
    },
  })

  return {
    address,
    shortenAddress: shortAddress(address),
    isConnected,
    chainId,
    chain,
    isWalletLoading: isConnecting || isReconnecting,
    isBalanceLoading,
    balance,
  }
}
