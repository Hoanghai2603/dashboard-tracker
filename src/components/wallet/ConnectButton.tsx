import { Button } from '@/components/ui/button'
import { SUPPORTED_CHAIN_ID } from '@/constants'
import { useWallet } from '@/hooks/useWallet'
import { useWalletActions } from '@/hooks/useWalletActions'
import React, { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Wallet, LogOut, ChevronDown } from 'lucide-react'
import type { Connector } from 'wagmi'
import { formatUnits } from 'viem'
import { formatNumber } from '@/utils/utils'
import { CopyButton } from '../ui/copy-button'
const ConnectButtonTemp: React.FC = () => {
  const { isConnected, chainId, shortenAddress, balance, address } = useWallet()
  const { connectors, isPending, connect, disconnect, switchChain } = useWalletActions()
  const [open, setOpen] = useState(false)

  const handleConnect = (connector: Connector) => {
    connect({ connector })
    setOpen(false)
  }

  const renderConnectButton = () => {
    if (isConnected) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 border-primary/20 hover:bg-primary/10 transition-colors">
              <Wallet className="w-4 h-4 text-primary" />
              <DropdownMenuLabel inert={false}>My Account</DropdownMenuLabel>
              <ChevronDown className="w-4 h-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 mt-1">
            <div className="px-2 py-1.5 text-sm text-muted-foreground flex items-center justify-between">
              <span>Address</span>
              <span className="font-medium text-foreground flex items-center gap-2">
                {shortenAddress}{' '}
                <CopyButton
                  value={address || ''}
                  className="h-5 w-5 bg-transparent hover:bg-muted text-muted-foreground hover:text-foreground"
                />
              </span>
            </div>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5 text-sm text-muted-foreground flex items-center justify-between">
              <span>Balance</span>
              <span className="font-medium text-foreground">
                {balance ? `${formatNumber(Number(formatUnits(balance.value, balance.decimals)))} ${balance.symbol}` : '0.00'}
              </span>
            </div>

            {chainId !== SUPPORTED_CHAIN_ID && (
              <>
                <DropdownMenuSeparator />
                <div className="p-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full font-semibold"
                    onClick={() => switchChain({ chainId: SUPPORTED_CHAIN_ID })}
                  >
                    Switch to Sepolia
                  </Button>
                </div>
              </>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => disconnect()}
              className="text-red-500 focus:bg-red-500/10 focus:text-red-500 font-medium cursor-pointer hover:text-red-500"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button disabled={isPending} className="gap-2 font-semibold">
            <Wallet className="w-4 h-4" />
            <span>Connect Wallet</span>
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Connect Wallet</DialogTitle>
            <DialogDescription>Choose a wallet out of the available options below to connect to the tracker.</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 py-4">
            {connectors.map((connector) => (
              <Button
                key={connector.uid}
                variant="outline"
                className="justify-start h-14 text-base font-semibold px-4 hover:border-primary/50 hover:bg-primary/5 transition-all"
                onClick={() => handleConnect(connector)}
                disabled={isPending}
              >
                <div className="w-8 h-8 mr-3 bg-secondary rounded-full flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-secondary-foreground" />
                </div>
                <span className="flex-1 text-left">{connector.name}</span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {renderConnectButton()}

      {isConnected && chainId !== SUPPORTED_CHAIN_ID && (
        <Button variant="destructive" className="font-semibold" onClick={() => switchChain({ chainId: SUPPORTED_CHAIN_ID })}>
          Switch to Sepolia
        </Button>
      )}
    </div>
  )
}

export default ConnectButtonTemp
