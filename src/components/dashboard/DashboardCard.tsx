import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

interface DashboardCardProps {
  title: string
  description?: string
  content: React.ReactNode
  icon?: React.ReactNode
  isLoading?: boolean
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, description, content, icon, isLoading }) => {
  return (
    <Card className="h-full w-full shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {description && <CardDescription className="text-xs">{description}</CardDescription>}
        </div>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2 mt-3">
            <Skeleton className="h-8 w-[60%]" />
          </div>
        ) : (
          <div className="text-2xl font-bold mt-1">{content}</div>
        )}
      </CardContent>
    </Card>
  )
}

export default DashboardCard
