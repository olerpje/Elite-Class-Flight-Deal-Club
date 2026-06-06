'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Plane, Lock, Zap, Clock } from 'lucide-react'
import { toast } from 'sonner'

export default function LandingPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    setLoading(false)
    if (error) {
      toast.error('Something went wrong. Please try again.')
      return
    }
    setSubmitted(true)
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <nav className="border-b border-zinc-800/50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-amber-400 font-bold tracking-tight text-lg">
            ✦ ELITE FLIGHT CLUB
          </span>
          <a href="/login" className="text-sm text-zinc-400 hover:text-white transition-colors">
            Sign in
          </a>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
        <Badge className="mb-6 bg-amber-500/10 text-amber-400 border-amber-500/20 text-xs px-3 py-1">
          Limited membership open
        </Badge>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-none mb-6">
          Business Class.{' '}
          <span className="text-amber-400">Economy Price.</span>
        </h1>

        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
          We scan thousands of fares daily and surface only the best
          Business and First Class deals — error fares, flash sales, and
          hidden gems most travelers never see.
        </p>

        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <CheckCircle className="h-12 w-12 text-emerald-400" />
            <p className="text-xl font-semibold">Check your email</p>
            <p className="text-zinc-400 text-sm">
              We sent a magic link to <strong>{email}</strong>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSignUp} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 h-11"
            />
            <Button
              type="submit"
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-400 text-black font-semibold h-11 px-6 shrink-0"
            >
              {loading ? 'Sending...' : 'Get Free Access'}
            </Button>
          </form>
        )}

        <p className="text-zinc-600 text-xs mt-4">
          Free tier gets deal alerts 4 hours after Premium members. No credit card required.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-20 border-t border-zinc-800/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col gap-3">
            <Zap className="h-6 w-6 text-amber-400" />
            <h3 className="font-semibold text-white">Instant Premium Alerts</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Premium members get notified the moment a deal is found — before anyone else sees it.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Plane className="h-6 w-6 text-amber-400" />
            <h3 className="font-semibold text-white">Business and First Only</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              We don't waste your time with economy deals. Every alert is Premium Economy, Business, or First Class.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Lock className="h-6 w-6 text-amber-400" />
            <h3 className="font-semibold text-white">Error Fares Included</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              We flag airline pricing mistakes the moment they appear — deals that disappear within hours.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-20 border-t border-zinc-800/50">
        <h2 className="text-3xl font-bold text-center mb-12">Simple pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 flex flex-col gap-4">
            <div>
              <p className="text-sm text-zinc-400 mb-1">Free</p>
              <p className="text-3xl font-bold">€0</p>
            </div>
            <ul className="flex flex-col gap-2 text-sm text-zinc-400 flex-1">
              <li className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-zinc-500" />
                Deals 4 hours delayed
              </li>
              <li className="flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 text-zinc-500" />
                Routes hidden
              </li>
              <li className="flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 text-zinc-500" />
                No booking links
              </li>
            </ul>
            <Button
              variant="outline"
              className="border-zinc-700 text-zinc-300 w-full"
              onClick={() => document.querySelector('input')?.focus()}
            >
              Get started free
            </Button>
          </div>

          <div className="rounded-xl border border-amber-500/30 bg-zinc-900 p-6 flex flex-col gap-4 relative">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-xs font-semibold px-3">
              Most Popular
            </Badge>
            <div>
              <p className="text-sm text-zinc-400 mb-1">Premium Monthly</p>
              <p className="text-3xl font-bold">
                €49<span className="text-base font-normal text-zinc-400">/mo</span>
              </p>
            </div>
            <ul className="flex flex-col gap-2 text-sm text-white flex-1">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                Instant deal alerts
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                Full routes and airlines
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                Direct booking links
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                Price history graphs
              </li>
            </ul>
            <Button
              className="bg-amber-500 hover:bg-amber-400 text-black font-semibold w-full"
              onClick={() => window.location.href = '/upgrade'}
            >
              Start Premium
            </Button>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 flex flex-col gap-4">
            <div>
              <p className="text-sm text-zinc-400 mb-1">Premium Annual</p>
              <p className="text-3xl font-bold">
                €399<span className="text-base font-normal text-zinc-400">/yr</span>
              </p>
              <p className="text-xs text-emerald-400 mt-1">Save €189 vs monthly</p>
            </div>
            <ul className="flex flex-col gap-2 text-sm text-white flex-1">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                Everything in Monthly
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                2 months free
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                Priority support
              </li>
            </ul>
            <Button
              variant="outline"
              className="border-zinc-700 text-zinc-300 w-full"
              onClick={() => window.location.href = '/upgrade'}
            >
              Get Annual
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-800/50 py-8 text-center text-zinc-600 text-xs">
        © {new Date().getFullYear()} Elite Flight Club. All rights reserved.
      </footer>
    </main>
  )
}