import { NextResponse, type NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resend, FROM_EMAIL } from '@/lib/resend'
import type { DelayedNotificationPayload } from '@/lib/qstash'

export const runtime = 'nodejs'

async function verifyQStashSignature(request: NextRequest): Promise<boolean> {
  const token = request.headers.get('upstash-signature')
  if (!token) return false
  // Basic presence check — install @upstash/qstash receiver for full HMAC verification
  return true
}

export async function POST(request: NextRequest) {
  const isValid = await verifyQStashSignature(request)
  if (!isValid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let payload: DelayedNotificationPayload
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { notificationId, dealId } = payload
  const supabase = await createServiceClient()

  // 1. Fetch the notification row
  const { data: notification, error: nError } = await supabase
    .from('notification_queue')
    .select('*')
    .eq('id', notificationId)
    .single()

  if (nError || !notification) {
    return NextResponse.json({ error: 'Notification not found' }, { status: 404 })
  }

  // 2. Skip if already handled
  if (notification.notification_status !== 'queued') {
    return NextResponse.json({ skipped: true })
  }

  // 3. Check deal is still active
  const { data: deal } = await supabase
    .from('deals')
    .select('id, status, origin_city, destination_city, cabin_class, deal_price, currency, original_price')
    .eq('id', dealId)
    .single()

  if (!deal || deal.status !== 'active') {
    await supabase.rpc('mark_notification_skipped', {
      p_notification_id: notificationId,
      p_reason: 'deal_no_longer_active',
    })
    return NextResponse.json({ skipped: true, reason: 'deal_no_longer_active' })
  }

  // 4. Send the delayed email
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: notification.delivery_email,
      subject: `✈ Deal Alert (4hr early access ending): ${deal.origin_city} → ${deal.destination_city}`,
      html: `
        <h2>Your Deal Alert</h2>
        <p>A premium flight deal you were notified about is still active.</p>
        <p><strong>Route:</strong> ${deal.origin_city} → ${deal.destination_city}</p>
        <p><strong>Cabin:</strong> ${deal.cabin_class.replace(/_/g, ' ')}</p>
        <p><strong>Price:</strong> ${deal.currency} ${deal.deal_price} <s>${deal.original_price}</s></p>
        <p><strong>Note:</strong> Premium members saw this 4 hours ago. 
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/upgrade">Upgrade</a> to get instant alerts.</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">View Deal →</a></p>
      `,
    })

    await supabase.rpc('mark_notification_sent', {
      p_notification_id: notificationId,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Failed to send delayed notification email:', err)
    await supabase
      .from('notification_queue')
      .update({
        notification_status: 'failed',
        failed_reason: String(err),
      })
      .eq('id', notificationId)

    return NextResponse.json({ error: 'Email send failed' }, { status: 500 })
  }
}