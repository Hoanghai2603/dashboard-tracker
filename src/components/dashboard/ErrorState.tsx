import React from 'react'
import { AlertCircle, RefreshCcw, WifiOff } from 'lucide-react'
import { isApiError } from '@/api/core'

interface ErrorStateProps {
  error: unknown
  onRetry?: () => void
  title?: string
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry, title }) => {
  const apiError = isApiError(error) ? error : null

  let displayTitle = title || 'Something went wrong'
  let description = 'An unexpected error occurred. Please try again.'
  let icon = <AlertCircle className="w-10 h-10 text-red-500/80" />

  if (apiError) {
    if (apiError.isRateLimited) {
      displayTitle = 'Rate Limited'
      description = 'Too many requests. Please wait a moment and try again.'
      icon = <AlertCircle className="w-10 h-10 text-yellow-500/80" />
    } else if (apiError.isNetworkError) {
      displayTitle = 'Network Error'
      description = 'Unable to connect. Check your internet connection.'
      icon = <WifiOff className="w-10 h-10 text-red-500/80" />
    } else if (apiError.isTimeout) {
      displayTitle = 'Request Timeout'
      description = 'The request took too long. Please try again.'
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
      <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10">
        {icon}
      </div>
      <div className="space-y-1.5">
        <h3 className="text-lg font-semibold text-foreground">{displayTitle}</h3>
        <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
        >
          <RefreshCcw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  )
}

export default ErrorState
