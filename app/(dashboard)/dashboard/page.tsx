import { DealFeed } from '@/components/deals/DealFeed'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier')
    .eq('id', user!.id)
    .single()

  const isPremium =
    profile?.subscription_tier === 'premium_monthly' ||
    profile?.subscription_tier === 'premium_annual'

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Deal Feed</h1>
          <p className="text-zinc-400 text-sm mt-1">
            {isPremium
              ? 'You have instant access to all deals.'
              : 'Free tier — deals shown 4 hours after Premium members.'}
          </p>
        </div>
      </div>
      <DealFeed />
    </div>
  )
}