import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia',
  typescript: true,
})

export const STRIPE_PRICES = {
  monthly: process.env.STRIPE_PRICE_MONTHLY!,
  annual: process.env.STRIPE_PRICE_ANNUAL!,
} as const

export const SUBSCRIPTION_TIER_MAP: Record<string, 'premium_monthly' | 'premium_annual'> = {
  [process.env.STRIPE_PRICE_MONTHLY!]: 'premium_monthly',
  [process.env.STRIPE_PRICE_ANNUAL!]: 'premium_annual',
}