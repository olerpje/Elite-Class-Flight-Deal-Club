'use client'

import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'
import type { DealPublicView } from '@/types'

async function fetchDeals(): Promise<DealPublicView[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('deals_public_view')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) throw error
  return (data ?? []) as DealPublicView[]
}

export function useDeals() {
  const { data, isLoading, error, mutate } = useSWR<DealPublicView[]>(
    'deals',
    fetchDeals,
    { revalidateOnFocus: false }
  )

  return {
    deals: data ?? [],
    isLoading,
    error,
    mutate,
  }
}