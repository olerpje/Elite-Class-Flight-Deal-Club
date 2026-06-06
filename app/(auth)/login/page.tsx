'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
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
      toast.error('Could not send login link. Please try again.')
      return
    }

    setSubmitted(true)
  }

  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-amber-400 font-bold text-xl tracking-tight">
            ✦ ELITE FLIGHT CLUB
          </Link>
          <p className="text-zinc-400 text-sm mt-2">Sign in to your account</p>
        </div>

        {submitted ? (
          <div className="text-center flex flex-col items-center gap-3 py-8">
            <CheckCircle className="h-12 w-12 text-emerald-400" />
            <p className="text-lg font-semibold">Check your email</p>
            <p className="text-zinc-400 text-sm">
              We sent a magic link to <strong>{email}</strong>
            </p>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="flex flex-col gap-3">
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
              className="bg-amber-500 hover:bg-amber-400 text-black font-semibold h-11"
            >
              {loading ? 'Sending link...' : 'Send magic link'}
            </Button>
          </form>
        )}

        <p className="text-center text-zinc-600 text-xs mt-6">
          No account yet?{' '}
          <Link href="/" className="text-zinc-400 hover:text-white underline">
            Sign up free
          </Link>
        </p>
      </div>
    </main>
  )
}