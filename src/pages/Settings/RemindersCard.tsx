import { Bell, BellOff } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button, Card } from '../../components/common'
import {
  disableReminder,
  enableReminder,
  getReminder,
  installedOnApple,
  reminderConfig,
  reminderSupport,
} from '../../features/reminders/client'
import { useProgress } from '../../hooks/useProgress'
import { useOnline } from '../../hooks/useOnline'

export function RemindersCard() {
  const { cloud } = useProgress()
  const online = useOnline()
  const supported = reminderSupport()
  const installed = installedOnApple()
  const [key, setKey] = useState('')
  const [time, setTime] = useState('20:00')
  const [enabled, setEnabled] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let alive = true
    if (!supported || !installed || !cloud.email || !online) return
    Promise.all([reminderConfig(), getReminder()])
      .then(([publicKey, current]) => {
        if (!alive) return
        setKey(publicKey)
        setEnabled(!!current)
        if (current) setTime(current.remind_at.slice(0, 5))
      })
      .catch(() => {
        if (alive) setMessage('Reminders aren’t available right now. You can keep learning normally.')
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [cloud.email, supported, installed, online])
  const enable = async () => {
    if (!cloud.email || !key || !online) return
    setBusy(true)
    setMessage('')
    try {
      await enableReminder(key, time, cloud.email)
      setEnabled(true)
      setMessage('Reminder saved for this device. Delivery depends on your device and connection.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Couldn’t enable reminders.')
    } finally {
      setBusy(false)
    }
  }
  const disable = async () => {
    setBusy(true)
    try {
      await disableReminder()
      setEnabled(false)
      setMessage('Reminders turned off on this device.')
    } catch {
      setMessage('Couldn’t turn off reminders. Check your connection or device notification settings.')
    } finally {
      setBusy(false)
    }
  }
  return (
    <Card className="space-y-3">
      <h2 className="flex items-center gap-2 font-display text-xl">
        <Bell className="size-5 shrink-0 text-terracotta" aria-hidden /> A gentle daily reminder
      </h2>
      <p className="text-sm opacity-80">
        Optional, once a day, only on this device. We skip it if your synced progress already shows practice today. The
        notification contains no account or learning details.
      </p>
      {!supported ? (
        <p className="text-sm opacity-70">Push notifications aren’t supported in this browser.</p>
      ) : !installed ? (
        <p className="text-sm opacity-70">
          On iPhone, add Português Quest to your Home Screen, open that icon and return here to enable reminders.
        </p>
      ) : !cloud.email ? (
        <p className="text-sm opacity-70">Sign in to choose a reminder.</p>
      ) : (
        <>
          <label className="block space-y-1">
            <span className="text-sm font-medium">
              Reminder time · {Intl.DateTimeFormat().resolvedOptions().timeZone}
            </span>
            <input
              type="time"
              step={900}
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="block rounded-xl border border-line bg-cream px-3 py-2"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" disabled={busy || loading || !online || !key || !time} onClick={enable}>
              {busy ? 'Saving…' : enabled ? 'Update reminder' : 'Enable reminders'}
            </Button>
            {enabled && (
              <Button variant="ghost" disabled={busy} onClick={disable}>
                <BellOff className="size-4" aria-hidden /> Turn off
              </Button>
            )}
          </div>
          <p className="text-xs opacity-70">
            The time zone is saved with the reminder. Update it here after travelling. Offline practice may not reach
            the server before a reminder is sent.
          </p>
        </>
      )}
      {message && (
        <p role="status" className="text-sm opacity-80">
          {message}
        </p>
      )}
    </Card>
  )
}
