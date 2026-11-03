import { Cloud, CloudOff, LogOut, Mail } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Button, Card } from '../../components/common'
import { useProgress } from '../../hooks/useProgress'

const statusText = {
  off: 'Sync is not configured.',
  loading: '',
  'signed-out': '',
  syncing: 'Syncing…',
  synced: 'All progress synced.',
  error: 'Couldn’t sync right now. Your progress is still saved on this device.',
}

export function AccountCard() {
  const { cloud } = useProgress()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (cloud.status === 'off') return null

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    const err = await cloud.signIn(email.trim())
    if (err) setError(err)
    else setSent(true)
  }

  return (
    <Card className="space-y-3">
      <h2 className="flex items-center gap-2 font-display text-xl">
        {cloud.email ? <Cloud className="size-5 text-sky" aria-hidden /> : <CloudOff className="size-5 opacity-50" aria-hidden />}
        Account & sync
      </h2>
      {cloud.email ? (
        <>
          <p>Signed in as <strong>{cloud.email}</strong></p>
          <p role="status" className="text-sm opacity-75">{statusText[cloud.status]}</p>
          <Button variant="secondary" size="sm" onClick={cloud.signOut}><LogOut className="size-4" aria-hidden /> Sign out</Button>
        </>
      ) : sent ? (
        <p role="status">📬 Check <strong>{email}</strong> and tap the link to sign in. You can close this page.</p>
      ) : (
        <form onSubmit={submit} className="space-y-3">
          <p className="text-sm opacity-75">Sign in with your email to keep your progress safe and in sync on all your devices. No password needed.</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <label htmlFor="email" className="sr-only">Email</label>
            <input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="min-w-0 flex-1 rounded-full border border-line bg-card px-4 py-2.5" />
            <Button type="submit"><Mail className="size-4" aria-hidden /> Send sign-in link</Button>
          </div>
          {error && <p role="alert" className="text-sm text-terracotta-dark">{error}</p>}
        </form>
      )}
    </Card>
  )
}
