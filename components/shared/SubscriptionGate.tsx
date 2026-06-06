'use client'

import { useSubscription } from '@/hooks/useSubscription'

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function SubscriptionGate({ children, fallback, }: Props) {
  const { isPremium, isLoading } = useSubscription()

  if (isLoading) return null
  if (!isPremium) return fallback ? <>{fallback}</> : null

  return <>{children}</>
}