'use client'

import { useDeals } from '@/hooks/useDeals'
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { DealPublicView } from '@/types'

interface Props {
  isPremium: boolean
}

export function PremiumDashboard({ isPremium }: Props) {
  const { deals, isLoading, mutate } = useDeals()

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel('deals-feed')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'deals' },
        () => mutate()
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [mutate])

  return (
    <div className="min-h-screen" style={{ background: 'radial-gradient(ellipse at top, #0f0f0f 0%, #090909 100%)' }}>
      {/* Header */}
      <div className="border-b border-white/5 px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[10px] tracking-[0.25em] text-amber-400/80 uppercase font-medium">
                Live Intelligence Feed
              </span>
            </div>
            <h1 className="text-2xl font-light text-white tracking-tight">
              Premium Flight Deals
            </h1>
          </div>
          <div className="text-right">
            {isPremium ? (
              <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-xs text-amber-400 font-medium tracking-wide">Elite Member</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                <span className="text-xs text-zinc-400 tracking-wide">Free Tier</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Free tier banner */}
      {!isPremium && (
        <div className="border-b border-amber-500/10 bg-amber-500/5 px-8 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <p className="text-xs text-amber-400/70">
              You are viewing deals <span className="text-amber-400 font-medium">4 hours after</span> Elite Members receive them.
            </p>
            
              href="/upgrade"
              className="text-xs text-amber-400 border border-amber-400/30 rounded-full px-3 py-1 hover:bg-amber-400/10 transition-colors">
              Upgrade now →
            </a>
          </div>
        </div>
      )}

      {/* Deal grid */}
      <div className="max-w-7xl mx-auto px-8 py-10">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-64 rounded-2xl bg-white/3 border border-white/5 animate-pulse"
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
        ) : deals.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {deals.map((deal, i) => (
              <DealCard key={deal.id} deal={deal} isPremium={isPremium} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-4">
      <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center mb-2">
        <span className="text-2xl">✦</span>
      </div>
      <p className="text-white/60 text-lg font-light">No active deals at this moment</p>
      <p className="text-white/30 text-sm">Our scanners are active. New deals surface daily.</p>
    </div>
  )
}

const CABIN_CONFIG = {
  first: { label: 'First Class', color: 'text-amber-300', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  business: { label: 'Business', color: 'text-violet-300', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
  premium_economy: { label: 'Prem. Economy', color: 'text-blue-300', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const hours = Math.floor(diff / 3600000)
  const mins = Math.floor(diff / 60000)
  if (hours >= 24) return `${Math.floor(hours / 24)}d ago`
  if (hours >= 1) return `${hours}h ago`
  return `${mins}m ago`
}

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency, maximumFractionDigits: 0 }).format(price)
}

function DealCard({ deal, isPremium, index }: { deal: DealPublicView; isPremium: boolean; index: number }) {
  const cabin = CABIN_CONFIG[deal.cabin_class] ?? CABIN_CONFIG.business

  return (
    <div
      className="group relative rounded-2xl border border-white/8 overflow-hidden transition-all duration-300 hover:border-white/15 hover:-translate-y-0.5"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
        animationDelay: `${index * 50}ms`,
      }}
    >
      {/* Top accent line */}
      <div className={`h-px w-full ${deal.cabin_class === 'first' ? 'bg-gradient-to-r from-transparent via-amber-400/50 to-transparent' : deal.cabin_class === 'business' ? 'bg-gradient-to-r from-transparent via-violet-400/50 to-transparent' : 'bg-gradient-to-r from-transparent via-blue-400/50 to-transparent'}`} />

      <div className="p-6 flex flex-col gap-5">
        {/* Header row */}
        <div className="flex items-start justify-between">
          <div className="flex gap-2 flex-wrap">
            <span className={`text-[10px] font-medium tracking-wider uppercase px-2.5 py-1 rounded-full border ${cabin.bg} ${cabin.border} ${cabin.color}`}>
              {cabin.label}
            </span>
            {deal.is_error_fare && (
              <span className="text-[10px] font-medium tracking-wider uppercase px-2.5 py-1 rounded-full border bg-red-500/10 border-red-500/20 text-red-300">
                Error Fare
              </span>
            )}
          </div>
          <span className="text-[10px] text-white/25 shrink-0">{timeAgo(deal.created_at)}</span>
        </div>

        {/* Route — gated */}
        {isPremium ? (
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <div className="text-center">
                <p className="text-xl font-light text-white tracking-widest font-mono">{deal.origin}</p>
                <p className="text-[10px] text-white/40 mt-0.5">{deal.origin_city}</p>
              </div>
              <div className="flex-1 flex items-center gap-1.5 px-2">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-white/20 text-xs">✈</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
              <div className="text-center">
                <p className="text-xl font-light text-white tracking-widest font-mono">{deal.destination}</p>
                <p className="text-[10px] text-white/40 mt-0.5">{deal.destination_city}</p>
              </div>
            </div>
            <p className="text-xs text-white/30">{deal.airline}</p>
          </div>
        ) : (
          <div className="relative">
            {/* Blurred route preview */}
            <div className="blur-sm opacity-40 pointer-events-none select-none">
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <p className="text-xl font-light text-white tracking-widest font-mono">XXX</p>
                  <p className="text-[10px] text-white/40 mt-0.5">Hidden City</p>
                </div>
                <div className="flex-1 flex items-center gap-1.5 px-2">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-white/20 text-xs">✈</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>
                <div className="text-center">
                  <p className="text-xl font-light text-white tracking-widest font-mono">XXX</p>
                  <p className="text-[10px] text-white/40 mt-0.5">Hidden City</p>
                </div>
              </div>
            </div>
            {/* Lock overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-4">
                <div className="w-6 h-6 rounded-full border border-amber-400/40 flex items-center justify-center mx-auto mb-2">
                  <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-[10px] text-amber-400/80 font-medium leading-relaxed">
                  Exclusive Premium Data Locked
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Price */}
        <div className="flex items-end gap-3">
          <span className="text-3xl font-light text-white">
            {formatPrice(deal.deal_price, deal.currency)}
          </span>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm text-white/25 line-through">
              {formatPrice(deal.original_price, deal.currency)}
            </span>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              -{deal.savings_percentage}%
            </span>
          </div>
        </div>

        {/* Travel window */}
        {deal.travel_window_start && (
          <p className="text-[11px] text-white/25">
            Travel window: {deal.travel_window_start}{deal.travel_window_end ? ` — ${deal.travel_window_end}` : ''}
          </p>
        )}

        {/* CTA */}
        {isPremium ? (
          
            href={deal.booking_url!}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center text-sm font-medium py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black transition-colors"
          >
            Book Now — Before It Sells Out
          </a>
        ) : (
          
            href="/upgrade"
            className="w-full text-center text-xs py-3 rounded-xl border border-white/10 text-white/40 hover:border-amber-400/30 hover:text-amber-400/70 transition-all"
          >
            Instant real-time access is restricted to Elite Members.{' '}
            <span className="underline underline-offset-2">Upgrade to unlock →</span>
          </a>
        )}
      </div>
    </div>
  )
}