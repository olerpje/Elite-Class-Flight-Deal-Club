import { Client } from '@upstash/qstash'

export const qstash = new Client({
  token: process.env.QSTASH_TOKEN!,
})

const RECEIVER_URL = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/qstash`
const FOUR_HOURS_SECONDS = 60 * 60 * 4

export interface DelayedNotificationPayload {
  notificationId: string
  dealId: string
  userId: string
}

export async function enqueueDelayedNotification(
  payload: DelayedNotificationPayload
): Promise<string> {
  const res = await qstash.publishJSON({
    url: RECEIVER_URL,
    body: payload,
    delay: FOUR_HOURS_SECONDS,
  })
  return res.messageId
}