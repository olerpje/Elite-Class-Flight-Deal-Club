import { NextResponse, type NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { enqueueDelayedNotification } from '@/lib/qstash'
import { resend, FROM_EMAIL } from '@/lib/resend'
import { z } from 'zod'

const IngestSchema = z.object({
  origin: z.string().length(3),
  origin_city: z.string(),
  destination: z.string().length(3),
  destination_city: z.string(),
  airline: z.string(),
  airline_code: z.string().optional(),
  original_price: z.number().positive(),
  deal_price: z.number().positive(),
  currency: z.string().length(3).default('EUR'),
  cabin_class: z.enum(['premium_economy', 'business', 'first']),
  booking_url: z.string().url(),
  travel_window_start: z.string().optional(),
  travel_window_end: z.string().optional(),
  min_nights: z.number().optional(),
  is_error_fare: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  booking_deadline: z.string().optional(),
  expires_at: z.string().optional(),
})

export async function POST(request: NextRequest) {
  // 1. Verify API key
  const apiKey = request.headers.get('x-api-key')
  if (apiKey !== process.env.INGEST_API_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Parse and validate body
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = IngestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.issues },
      { status: 422 }
    )
  }

  const payload = parsed.data
  const supabase = await createServiceClient()

  // 3. Insert deal + enqueue free-user notification rows atomically
  const { data: dealId, error: rpcError } = await supabase.rpc('ingest_deal', {
    p_origin: payload.origin,
    p_origin_city: payload.origin_city,
    p_destination: payload.destination,
    p_destination_city: payload.destination_city,
    p_airline: payload.airline,
    p_airline_code: payload.airline_code ?? null,
    p_original_price: payload.original_price,
    p_deal_price: payload.deal_price,
    p_currency: payload.currency,
    p_cabin_class: payload.cabin_class,
    p_booking_url: payload.booking_url,
    p_travel_window_start: payload.travel_window_start ?? null,
    p_travel_window_end: payload.travel_window_end ?? null,
    p_min_nights: payload.min_nights ?? null,
    p_is_error_fare: payload.is_error_fare,
    p_tags: payload.tags,
    p_booking_deadline: payload.booking_deadline ?? null,
    p_expires_at: payload.expires_at ?? null,
    p_delay_minutes: 240,
  })

  if (rpcError || !dealId) {
    console.error('ingest_deal RPC error:', rpcError)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  // 4. Notify premium users instantly via email
  const { data: premiumUsers } = await supabase
    .from('profiles')
    .select('id, email')
    .in('subscription_tier', ['premium_monthly', 'premium_annual'])
    .eq('notify_email', true)

  if (premiumUsers && premiumUsers.length > 0) {
    await Promise.allSettled(
      premiumUsers.map((user) =>
        resend.emails.send({
          from: FROM_EMAIL,
          to: user.email,
          subject: `✈ New ${payload.cabin_class.replace('_', ' ')} deal: ${payload.origin_city} → ${payload.destination_city} — ${payload.currency} ${payload.deal_price}`,
          html: `
            <h2>New Elite Deal Alert</h2>
            <p><strong>Route:</strong> ${payload.origin_city} (${payload.origin}) → ${payload.destination_city} (${payload.destination})</p>
            <p><strong>Airline:</strong> ${payload.airline}</p>
            <p><strong>Cabin:</strong> ${payload.cabin_class.replace(/_/g, ' ')}</p>
            <p><strong>Price:</strong> ${payload.currency} ${payload.deal_price} <s>${payload.original_price}</s></p>
            <p><a href="${payload.booking_url}">Book Now</a></p>
          `,
        })
      )
    )
  }

  // 5. Enqueue QStash delayed notifications for free users
  const { data: queuedNotifications } = await supabase
    .from('notification_queue')
    .select('id, user_id')
    .eq('deal_id', dealId)
    .eq('notification_status', 'queued')

  if (queuedNotifications && queuedNotifications.length > 0) {
    const qstashResults = await Promise.allSettled(
      queuedNotifications.map((n) =>
        enqueueDelayedNotification({
          notificationId: n.id,
          dealId: dealId as string,
          userId: n.user_id,
        })
      )
    )

    // Store QStash message IDs for idempotency
    await Promise.allSettled(
      qstashResults.map((result, i) => {
        if (result.status === 'fulfilled') {
          return supabase
            .from('notification_queue')
            .update({ qstash_message_id: result.value })
            .eq('id', queuedNotifications[i].id)
        }
      })
    )
  }

  return NextResponse.json({ success: true, dealId }, { status: 201 })
}