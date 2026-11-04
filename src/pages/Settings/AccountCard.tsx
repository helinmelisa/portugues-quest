import { Cloud, CloudOff, LogOut } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card } from '../../components/common'
import { useProgress } from '../../hooks/useProgress'

const statusText = {
  off: 'Sync is not configured.',
  loading: '',
  'signed-out': '',
  syncing: 'Syncing…',
  synced: 'All progress synced.',
  saved: 'Saved on this device. Waiting to sync.',
  'storage-error': 'Device storage is unavailable. Export a backup before closing this app.',
  error: 'Couldn’t sync right now. Your progress is still saved on this device.',
}

export function AccountCard() {
  const { cloud } = useProgress()
  const [error, setError] = useState<string | null>(null)

  if (cloud.status === 'off') return null

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
          {['error', 'saved'].includes(cloud.status) && <Button size="sm" variant="secondary" onClick={cloud.retry}>Retry sync</Button>}
          {error && <p role="alert" className="text-sm text-terracotta-dark">{error}</p>}
          <Link to="/password" className="inline-block rounded-full border border-line bg-card px-4 py-3 text-sm font-medium hover:border-sage">Set or change password</Link>
          <Button variant="secondary" size="sm" onClick={() => { void cloud.signOut().catch(() => setError('Couldn’t finish sign-out. Reconnect and try again.')) }}><LogOut className="size-4" aria-hidden /> Sign out</Button>
        </>
      ) : (
        <Link to="/login" className="inline-block font-medium text-terracotta-dark underline">Sign in with email and password →</Link>
      )}
    </Card>
  )
}
