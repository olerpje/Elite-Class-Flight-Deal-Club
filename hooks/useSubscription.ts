'use client'

import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types'

async function fetchProfile(): Promise<Profile | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return data
}

export function useSubscription() {
  const { data: profile, isLoading, mutate } = useSWR<Profile | null>(
    'profile',
    fetchProfile,
    { revalidateOnFocus: false }
  )

  const tier = profile?.subscription_tier ?? 'free'
  const isPremium = tier === 'premium_monthly' || tier === 'premium_annual'

  return { profile, tier, isPremium, isLoading, mutate }
}