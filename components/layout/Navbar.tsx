'use client'

import Link from 'next/link'
import { useSubscription } from '@/hooks/useSubscription'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function Navbar() {
  const { isPremium, isLoading } = useSubscription()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-amber-400 font-bold tracking-tight">✦ ELITE</span>
          <span className="text-white font-light text-sm hidden sm:block">Flight Club</span>
        </Link>

        <div className="flex items-center gap-3">
          {!isLoading && (
            isPremium ? (
              <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-xs">
                Premium
              </Badge>
            ) : (
              <Button
                size="sm"
                className="bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold h-7 px-3"
                onClick={() => router.push('/upgrade')}
              >
                Upgrade
              </Button>
            )
          )}
          <Button
            size="sm"
            variant="ghost"
            className="text-zinc-400 hover:text-white text-xs h-7"
            onClick={handleSignOut}
          >
            Sign out
          </Button>
        </div>
      </div>
    </nav>
  )
}