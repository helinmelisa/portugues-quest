import { createClient } from 'npm:@supabase/supabase-js@2'
import webpush from 'npm:web-push@3.6.7'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
}
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } })
const publicKey = Deno.env.get('VAPID_PUBLIC_KEY') ?? ''
const privateKey = Deno.env.get('VAPID_PRIVATE_KEY') ?? ''
const cronSecret = Deno.env.get('REMINDER_CRON_SECRET') ?? ''
const allowedHost = (host: string) =>
  ['push.apple.com', 'fcm.googleapis.com', 'push.services.mozilla.com', 'wns.windows.com'].some(
    (suffix) => host === suffix || host.endsWith(`.${suffix}`),
  )
const validEndpoint = (value: string) => {
  try {
    const url = new URL(value)
    return (
      url.protocol === 'https:' &&
      !url.username &&
      !url.password &&
      (!url.port || url.port === '443') &&
      allowedHost(url.hostname)
    )
  } catch {
    return false
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)
  if (!publicKey || !privateKey || !cronSecret) return json({ error: 'Reminders are not configured.' }, 503)
  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const body = await req.json().catch(() => ({}))
  if (body.action === 'config') {
    const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer /, '')
    const {
      data: { user },
    } = await admin.auth.getUser(token)
    return user ? json({ publicKey }) : json({ error: 'Sign in first.' }, 401)
  }
  if (req.headers.get('x-reminder-secret') !== cronSecret) return json({ error: 'Unauthorized' }, 401)
  const { data: subscriptions, error } = await admin.rpc('claim_due_reminders', { batch_size: 10 })
  if (error) return json({ error: 'Could not claim reminder batch.' }, 500)
  let sent = 0
  for (const subscription of subscriptions ?? []) {
    if (!validEndpoint(subscription.endpoint)) {
      await admin.from('push_subscriptions').delete().eq('id', subscription.id)
      continue
    }
    try {
      await webpush.sendNotification(
        { endpoint: subscription.endpoint, keys: subscription.keys },
        JSON.stringify({
          title: 'A little Portuguese today?',
          body: 'Five gentle minutes. Your next little adventure is ready.',
        }),
        {
          TTL: 1800,
          timeout: 10000,
          vapidDetails: {
            subject: Deno.env.get('VAPID_SUBJECT') ?? 'https://portugues-quest.vercel.app',
            publicKey,
            privateKey,
          },
        },
      )
      sent++
    } catch (error) {
      const status = (error as { statusCode?: number }).statusCode
      if (status === 404 || status === 410) await admin.from('push_subscriptions').delete().eq('id', subscription.id)
      // Never log endpoints or subscription keys.
      console.error('Reminder delivery failed', status ?? 'network')
    }
  }
  return json({ claimed: subscriptions?.length ?? 0, sent })
})
