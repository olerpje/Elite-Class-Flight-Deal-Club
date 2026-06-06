'use client'

import { BlurOverlay } from '@/components/shared/BlurOverlay'
import { DealBadge, SavingsBadge, ErrorFareBadge } from './DealBadge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, Clock } from 'lucide-react'
import { useSubscription } from '@/hooks/useSubscription'
import type { DealPublicView } from '@/types'

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price)
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const hours = Math.floor(diff / 3600000)
  const mins = Math.floor(diff / 60000)
  if (hours >= 24) return `${Math.floor(hours / 24)}d ago`
  if (hours >= 1) return `${hours}h ago`
  return `${mins}m ago`
}

export function DealCard({ deal }: { deal: DealPublicView }) {
  const { isPremium } = useSubscription()

  const routeContent = (
    <div className="flex items-center gap-2 text-sm">
      <span className="font-mono text-white">
        {deal.origin ?? '✦✦✦'}
      </span>
      <span className="text-zinc-500">→</span>
      <span className="font-mono text-white">
        {deal.destination ?? '✦✦✦'}
      </span>
      {deal.origin_city && deal.destination_city && (
        <span className="text-zinc-400 text-xs">
          ({deal.origin_city} → {deal.destination_city})
        </span>
      )}
    </div>
  )

  const airlineContent = (
    <p className="text-xs text-zinc-400">
      {deal.airline ?? 'Premium Airline'}
    </p>
  )

  return (
    <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <DealBadge cabin={deal.cabin_class} />
          <SavingsBadge percentage={deal.savings_percentage} />
          {deal.is_error_fare && <ErrorFareBadge />}
        </div>
        <div className="flex items-center gap-1 text-zinc-500 text-xs shrink-0">
          <Clock className="h-3 w-3" />
          {timeAgo(deal.created_at)}
        </div>
      </div>

      {/* Route */}
      {isPremium ? (
        <div className="space-y-1">
          {routeContent}
          {airlineContent}
        </div>
      ) : (
        <BlurOverlay label="Upgrade to see route">
          <div className="space-y-1">
            {routeContent}
            {airlineContent}
          </div>
        </BlurOverlay>
      )}

      {/* Price */}
      <div className="flex items-end gap-3">
        <span className="text-2xl font-bold text-white">
          {formatPrice(deal.deal_price, deal.currency)}
        </span>
        <span className="text-sm text-zinc-500 line-through mb-0.5">
          {formatPrice(deal.original_price, deal.currency)}
        </span>
      </div>

      {/* Travel window */}
      {deal.travel_window_start && (
        <p className="text-xs text-zinc-500">
          Travel: {deal.travel_window_start}
          {deal.travel_window_end ? ` – ${deal.travel_window_end}` : ''}
        </p>
      )}

      {/* CTA */}
      {isPremium && deal.booking_url ? (
        <Button
          className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm"
          onClick={() => window.open(deal.booking_url!, '_blank')}
        >
          Book Now <ExternalLink className="h-3 w-3 ml-1" />
        </Button>
      ) : (
        <Button
          variant="outline"
          className="w-full border-zinc-700 text-zinc-400 text-sm"
          onClick={() => window.location.href = '/upgrade'}
        >
          <Lock className="h-3 w-3 mr-1" /> Unlock Booking Link
        </Button>
      )}
    </Card>
  )
}

// missing import
import { Lock } from 'lucide-react'