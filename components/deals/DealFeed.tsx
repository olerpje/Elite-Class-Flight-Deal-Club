'use client'

import { useDeals } from '@/hooks/useDeals'
import { DealCard } from './DealCard'
import { Skeleton } from '@/components/ui/skeleton'
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function DealFeed() {
  const { deals, isLoading, mutate } = useDeals()

  // Realtime: prepend new deals as they arrive
  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel('deals-feed')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'deals' },
        () => {
          mutate()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [mutate])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-56 rounded-xl bg-zinc-800" />
        ))}
      </div>
    )
  }

  if (deals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-zinc-500">
        <p className="text-lg font-medium">No active deals right now.</p>
        <p className="text-sm mt-1">Check back soon — new deals drop daily.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {deals.map((deal) => (
        <DealCard key={deal.id} deal={deal} />
      ))}
    </div>
  )
}