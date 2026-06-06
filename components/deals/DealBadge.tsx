import { Badge } from '@/components/ui/badge'
import type { CabinClass } from '@/types'

const CABIN_LABELS: Record<CabinClass, string> = {
  premium_economy: 'Premium Economy',
  business: 'Business',
  first: 'First Class',
}

const CABIN_COLORS: Record<CabinClass, string> = {
  premium_economy: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  business: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  first: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
}

export function DealBadge({ cabin }: { cabin: CabinClass }) {
  return (
    <Badge
      variant="outline"
      className={`text-xs font-medium ${CABIN_COLORS[cabin]}`}
    >
      {CABIN_LABELS[cabin]}
    </Badge>
  )
}

export function SavingsBadge({ percentage }: { percentage: number }) {
  return (
    <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
      -{percentage}%
    </Badge>
  )
}

export function ErrorFareBadge() {
  return (
    <Badge className="bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-semibold">
      Error Fare
    </Badge>
  )
}