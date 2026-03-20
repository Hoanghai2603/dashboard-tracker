import * as React from 'react'
import { Check, Copy, Loader2 } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { buttonVariants } from '@/components/ui/button-variants'
import { type VariantProps } from 'class-variance-authority'

interface CopyButtonProps extends React.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  value: string
}

export function CopyButton({ value, className, variant = 'ghost', size = 'icon', ...props }: CopyButtonProps) {
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'copied'>('idle')

  React.useEffect(() => {
    if (status === 'copied') {
      const timeout = setTimeout(() => {
        setStatus('idle')
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [status])

  const copyToClipboard = React.useCallback(() => {
    setStatus('loading')
    navigator.clipboard.writeText(value)

    // Add a slight delay so the loading animation is visible before the Check icon appears
    setTimeout(() => {
      setStatus('copied')
    }, 400)
  }, [value])

  return (
    <Button
      size={size}
      variant={variant}
      className={cn('relative z-10 h-6 w-6 text-zinc-50 hover:bg-zinc-700 hover:text-zinc-50 [&_svg]:h-3 [&_svg]:w-3', className)}
      onClick={copyToClipboard}
      {...props}
    >
      <span className="sr-only">Copy</span>
      {status === 'loading' ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : status === 'copied' ? (
        <Check className="h-3 w-3 text-green-500" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </Button>
  )
}
