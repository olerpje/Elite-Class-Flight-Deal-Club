import { createClient } from '@/lib/supabase/server'
import { PremiumDashboard } from '@/components/deals/PremiumDashboard'

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

  return <PremiumDashboard isPremium={isPremium} />
}