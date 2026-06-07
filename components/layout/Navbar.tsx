'use client'

import Link from 'next/link'
import { useSubscription } from '@/hooks/useSubscription'
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
    <nav className="border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3">
          <span className="text-amber-400 text-sm tracking-[0.2em] font-medium">✦ ELITE</span>
          <span className="text-white/30 text-xs tracking-widest hidden sm:block uppercase">Flight Club</span>
        </Link>

        <div className="flex items-center gap-4">
          {!isLoading && !isPremium && (
            
              href="/upgrade"
              className="text-xs text-amber-400 border border-amber-400/30 rounded-full px-4 py-1.5 hover:bg-amber-400/10 transition-colors tracking-wide"
            >
              Upgrade to Elite
            </a>
          )}
          <Link
            href="/account"
            className="text-xs text-white/30 hover:text-white/60 transition-colors tracking-wide"
          >
            Account
          </Link>
          <button
            onClick={handleSignOut}
            className="text-xs text-white/20 hover:text-white/40 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  )
}