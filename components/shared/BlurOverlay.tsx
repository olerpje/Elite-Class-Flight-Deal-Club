'use client'

import { Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface Props {
  children: React.ReactNode
  label?: string
}

export function BlurOverlay({ children, label = 'Upgrade to reveal' }: Props) {
  const router = useRouter()

  return (
    <div className="relative">
      <div className="pointer-events-none select-none blur-sm opacity-60">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <div className="flex items-center gap-2 rounded-full bg-black/80 border border-white/10 px-4 py-2">
          <Lock className="h-3 w-3 text-amber-400" />
          <span className="text-xs font-medium text-white">{label}</span>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="text-xs border-amber-400/40 text-amber-400 hover:bg-amber-400/10"
          onClick={() => router.push('/upgrade')}
        >
          Upgrade to Premium
        </Button>
      </div>
    </div>
  )
}