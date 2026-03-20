import DashboardCard from '@/components/dashboard/DashboardCard'
import MenuChart from '@/components/dashboard/MenuChart'
import { useTokens } from '@/hooks/useTokens'
import { useWallet } from '@/hooks/useWallet'
import { formatNumber, shortAddress } from '@/utils/utils'
import { Wallet, Globe, Coins, Target } from 'lucide-react'
import React from 'react'
import { formatUnits } from 'viem'

const Dashboard: React.FC = () => {
  const { isConnected, balance, address, chain, isWalletLoading } = useWallet()
  const { data: tokens, isLoading: isTokensLoading } = useTokens()

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground">Welcome back to your crypto control center.</p>
      </div>

      {isConnected && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard
            title="Total Balance"
            description="Native wallet balance"
            content={`${balance ? `${formatNumber(Number(formatUnits(balance.value, balance.decimals)))} ${balance.symbol}` : '0.00'}`}
            icon={<Wallet className="h-5 w-5 text-primary" />}
            isLoading={isWalletLoading}
          />
          <DashboardCard
            title="Network"
            description="Connected blockchain"
            content={chain?.name || 'Unknown'}
            icon={<Globe className="h-5 w-5 text-blue-500" />}
            isLoading={isWalletLoading}
          />
          <DashboardCard
            title="Account Address"
            description="Current active wallet"
            content={shortAddress(address) || 'No Address'}
            icon={<Target className="h-5 w-5 text-orange-500" />}
            isLoading={isWalletLoading}
          />
          <DashboardCard
            title="Tracked Assets"
            description="Available from Market"
            content={(tokens?.length || 0).toString()}
            icon={<Coins className="h-5 w-5 text-yellow-500" />}
            isLoading={isTokensLoading}
          />
        </div>
      )}

      <MenuChart data={tokens || []} isLoading={isTokensLoading} />
    </div>
  )
}

export default Dashboard
