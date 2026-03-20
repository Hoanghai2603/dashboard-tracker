import { shortAddress } from '@/utils/utils'
import { useBalance, useConnection } from 'wagmi'

export const useWallet = () => {
  const { address, isConnected, chainId, chain, isConnecting, isDisconnected, isReconnecting } = useConnection()
  const { data } = useBalance({
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
    isWalletLoading: isConnecting || isDisconnected || isReconnecting,
    balance: data,
  }
}
