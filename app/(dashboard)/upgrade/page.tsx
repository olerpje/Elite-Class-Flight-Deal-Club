'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

export default function UpgradePage() {
  const [loading, setLoading] = useState<'monthly' | 'annual' | null>(null)

  async function handleCheckout(plan: 'monthly' | 'annual') {
    setLoading(plan)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: plan === 'monthly'
            ? process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY
            : process.env.NEXT_PUBLIC_STRIPE_PRICE_ANNUAL,
        }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else toast.error('Could not start checkout. Please try again.')
    } catch {
      toast.error('Something went wrong.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-3">Upgrade to Premium</h1>
        <p className="text-zinc-400">
          Get instant access to every deal the moment it drops.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly */}
        <div className="rounded-xl border border-amber-500/30 bg-zinc-900 p-8 flex flex-col gap-6">
          <div>
            <p className="text-zinc-400 text-sm mb-1">Monthly</p>
            <p className="text-4xl font-bold">€49
              <span className="text-lg font-normal text-zinc-400">/month</span>
            </p>
          </div>
          <ul className="flex flex-col gap-3 flex-1">
            {[
              'Instant deal alerts',
              'Full routes & airlines revealed',
              'Direct booking links',
              'Price history graphs',
              'Cancel anytime',
            ].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-zinc-300">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          <Button
            className="bg-amber-500 hover:bg-amber-400 text-black font-semibold h-11 w-full"
            onClick={() => handleCheckout('monthly')}
            disabled={loading !== null}
          >
            {loading === 'monthly' ? 'Loading...' : 'Start Monthly — €49/mo'}
          </Button>
        </div>

        {/* Annual */}
        <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-8 flex flex-col gap-6 relative">
          <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-xs font-semibold px-3">
            Save €189
          </Badge>
          <div>
            <p className="text-zinc-400 text-sm mb-1">Annual</p>
            <p className="text-4xl font-bold">€499
              <span className="text-lg font-normal text-zinc-400">/year</span>
            </p>
            <p className="text-emerald-400 text-xs mt-1">€33/month — 2 months free</p>
          </div>
          <ul className="flex flex-col gap-3 flex-1">
            {[
              'Everything in Monthly',
              'Best value per deal found',
              '2 months free vs monthly',
              'Priority email support',
            ].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-zinc-300">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          <Button
            variant="outline"
            className="border-zinc-600 text-white hover:bg-zinc-800 h-11 w-full font-semibold"
            onClick={() => handleCheckout('annual')}
            disabled={loading !== null}
          >
            {loading === 'annual' ? 'Loading...' : 'Start Annual — €499/yr'}
          </Button>
        </div>
      </div>
    </div>
  )
}