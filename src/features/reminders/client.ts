import { supabase } from '../../services/supabase'

export const reminderSupport = () => 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
export const installedOnApple = () => {
  const apple =
    /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  return (
    !apple ||
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}
export function decodePublicKey(key: string): Uint8Array<ArrayBuffer> {
  const base64 = key.replace(/-/g, '+').replace(/_/g, '/')
  return Uint8Array.from(atob(base64 + '='.repeat((4 - (base64.length % 4)) % 4)), (c) => c.charCodeAt(0))
}
export async function reminderConfig() {
  if (!supabase) throw new Error('Sign in to use reminders.')
  const { data, error } = await supabase.functions.invoke<{ publicKey?: string }>('reminders', {
    body: { action: 'config' },
  })
  if (error || !data?.publicKey) throw new Error('Reminders aren’t available yet. Please try again later.')
  return data.publicKey
}
export async function getReminder() {
  const registration = await navigator.serviceWorker.getRegistration()
  const subscription = await registration?.pushManager.getSubscription()
  if (!subscription || !supabase) return null
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) return null
  const { data, error } = await supabase
    .from('push_subscriptions')
    .select('remind_at, timezone')
    .eq('user_id', session.user.id)
    .eq('endpoint', subscription.endpoint)
    .maybeSingle()
  if (error) throw error
  return data as { remind_at: string; timezone: string } | null
}
export async function enableReminder(publicKey: string, time: string, email: string) {
  // This function is called only after a learner presses Enable. Keep the permission request in that gesture.
  const permission = await Notification.requestPermission()
  if (permission !== 'granted')
    throw new Error('Notifications were not allowed. You can change permission in your device settings.')
  const registration = await navigator.serviceWorker.getRegistration()
  if (!registration?.active || !supabase) throw new Error('Reopen the installed app online, then try again.')
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session || session.user.email !== email)
    throw new Error('Your account changed. Sign in again to set a reminder.')
  let subscription = await registration.pushManager.getSubscription()
  const existing = await getReminder()
  if (subscription && !existing) {
    await subscription.unsubscribe()
    subscription = null
  }
  subscription ??= await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: decodePublicKey(publicKey),
  })
  const serialized = subscription.toJSON()
  const { error } = await supabase
    .from('push_subscriptions')
    .upsert(
      {
        user_id: session.user.id,
        endpoint: subscription.endpoint,
        keys: serialized.keys,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        remind_at: time,
      },
      { onConflict: 'endpoint' },
    )
    .setHeader('Authorization', `Bearer ${session.access_token}`)
  if (error) {
    await subscription.unsubscribe()
    throw new Error('Couldn’t save the reminder. Please try again.')
  }
}
export async function disableReminder() {
  if (!reminderSupport()) return
  const subscription = await (await navigator.serviceWorker.getRegistration())?.pushManager.getSubscription()
  if (!subscription) return
  // Unsubscribe on the device first, including if the network is unavailable during sign-out.
  await subscription.unsubscribe()
  if (supabase) {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (session)
      await supabase
        .from('push_subscriptions')
        .delete()
        .eq('user_id', session.user.id)
        .eq('endpoint', subscription.endpoint)
        .setHeader('Authorization', `Bearer ${session.access_token}`)
  }
}
