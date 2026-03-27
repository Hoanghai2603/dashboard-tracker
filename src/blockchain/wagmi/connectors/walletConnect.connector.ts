import { walletConnect } from 'wagmi/connectors'

export const walletConnectConnector = walletConnect({
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
})
