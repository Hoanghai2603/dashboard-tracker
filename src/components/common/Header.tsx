import React from 'react'
import { APP_NAME } from '@/constants'
import ConnectButton from '@/components/wallet/ConnectButton'
import { Hexagon } from 'lucide-react'

const Header: React.FC = () => {
  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur-md sticky top-0 z-50 w-full px-6">
      <div className="flex items-center justify-between h-full max-w-full mx-auto">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Hexagon className="h-5 w-5 fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-primary to-blue-400">
            {APP_NAME}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <ConnectButton />
        </div>
      </div>
    </header>
  )
}

export default Header
