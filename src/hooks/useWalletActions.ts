import { useConnect, useDisconnect, useSwitchChain } from "wagmi";

export const useWalletActions = () => {
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  return {
    connect,
    disconnect,
    switchChain,
    connectors,
    isPending,
    isSwitching,
  };
};
