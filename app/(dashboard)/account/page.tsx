'use client'

import { useSubscription } from '@/hooks/useSubscription'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { useState } from 'react'

export default function AccountPage() {
  const { profile, isPremium, isLoading } = useSubscription()
  const [portalLoading, setPortalLoading] = useState(false)

  async function handlePortal() {
    setPortalLoading(true)
    try {
      const res = await fetch('/api/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else toast.error('Could not open billing portal.')
    } catch {
      toast.error('Something went wrong.')
    } finally {
      setPortalLoading(false)
    }
  }

  if (isLoading) {
    return <div className="text-zinc-400 text-sm">Loading...</div>
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-8">Account</h1>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-400 mb-1">Email</p>
            <p className="text-white font-medium">{profile?.email}</p>
          </div>
        </div>

        <div className="h-px bg-zinc-800" />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-400 mb-1">Plan</p>
            <div className="flex items-center gap-2">
              {isPremium ? (
                <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">
                  {profile?.subscription_tier === 'premium_annual' ? 'Premium Annual' : 'Premium Monthly'}
                </Badge>
              ) : (
                <Badge variant="outline" className="border-zinc-700 text-zinc-400">
                  Free
                </Badge>
              )}
              {profile?.subscription_status && (
                <span className="text-xs text-zinc-500 capitalize">
                  {profile.subscription_status}
                </span>
              )}
            </div>
          </div>
          {!isPremium && (
            <Button
              size="sm"
              className="bg-amber-500 hover:bg-amber-400 text-black font-semibold"
              onClick={() => window.location.href = '/upgrade'}
            >
              Upgrade
            </Button>
          )}
        </div>

        {profile?.current_period_end && isPremium && (
          <>
            <div className="h-px bg-zinc-800" />
            <div>
              <p className="text-sm text-zinc-400 mb-1">Next billing date</p>
              <p className="text-white">
                {new Date(profile.current_period_end).toLocaleDateString('en-EU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </>
        )}

        {isPremium && (
          <>
            <div className="h-px bg-zinc-800" />
            <Button
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 w-full"
              onClick={handlePortal}
              disabled={portalLoading}
            >
              {portalLoading ? 'Loading...' : 'Manage subscription'}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}