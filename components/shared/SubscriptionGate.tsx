'use client'

import { useSubscription } from '@/hooks/useSubscription'
import type { SubscriptionTier } from '@/types'

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
  requiredTier?: SubscriptionTier
}

export function SubscriptionGate({ children, fallback, requiredTier = 'premium_monthly' }: Props) {
  const { isPremium, isLoading } = useSubscription()

  if (isLoading) return null
  if (!isPremium) return fallback ? <>{fallback}</> : null

  return <>{children}</>
}