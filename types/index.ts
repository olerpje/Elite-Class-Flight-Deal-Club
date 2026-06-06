export type SubscriptionTier = 'free' | 'premium_monthly' | 'premium_annual'
export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'paused'
export type DealStatus = 'active' | 'sold_out' | 'expired' | 'archived'
export type CabinClass = 'premium_economy' | 'business' | 'first'
export type NotificationStatus = 'queued' | 'sent' | 'skipped' | 'failed'

export type Profile = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  subscription_tier: SubscriptionTier
  subscription_status: SubscriptionStatus | null
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  current_period_end: string | null
  notify_email: boolean
  notify_webhook_url: string | null
  created_at: string
  updated_at: string
}

export type DealPublicView = {
  id: string
  origin_city: string | null
  origin: string | null
  destination_city: string | null
  destination: string | null
  airline: string | null
  airline_code: string | null
  deal_price: number
  original_price: number
  savings_percentage: number
  currency: string
  cabin_class: CabinClass
  travel_window_start: string | null
  travel_window_end: string | null
  min_nights: number | null
  is_error_fare: boolean
  tags: string[]
  booking_url: string | null
  booking_deadline: string | null
  status: DealStatus
  created_at: string
  updated_at: string
  expires_at: string | null
}

export type IngestDealPayload = {
  origin: string
  origin_city: string
  destination: string
  destination_city: string
  airline: string
  airline_code?: string
  original_price: number
  deal_price: number
  currency?: string
  cabin_class: CabinClass
  booking_url: string
  travel_window_start?: string
  travel_window_end?: string
  min_nights?: number
  is_error_fare?: boolean
  tags?: string[]
  booking_deadline?: string
  expires_at?: string
}