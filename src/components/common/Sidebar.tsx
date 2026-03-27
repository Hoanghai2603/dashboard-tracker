import { cn } from '@/lib/utils'
import { LayoutDashboard } from 'lucide-react'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
  // Phase 5 routes (sẽ thêm sau):
  // { name: "Staking", icon: Coins, path: "/staking" },
]

const Sidebar: React.FC = () => {
  const location = useLocation()

  return (
    <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-sm flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      <div className="flex-1 py-6 px-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              location.pathname === item.path
                ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>
        ))}
      </div>
    </aside>
  )
}

export default Sidebar
