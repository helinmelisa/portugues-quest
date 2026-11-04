import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Card } from '../../components/common'
import { useProgress } from '../../hooks/useProgress'

export default function PasswordPage() {
  const { cloud } = useProgress()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (busy) return
    if (password !== confirm) { setError('The passwords don’t match. Try again.'); return }
    setError(null)
    setBusy(true)
    try {
      const err = await cloud.setPassword(password)
      if (err) setError(err)
      else { cloud.finishPasswordRecovery(); setSaved(true) }
    } catch { setError('Couldn’t save your password. Check your connection and try again.') }
    finally { setPassword(''); setConfirm(''); setBusy(false) }
  }
  const field = 'w-full rounded-2xl border border-line bg-cream px-4 py-3'
  return (
    <main className="grid min-h-dvh place-items-center px-4 py-10">
      <Card className="w-full max-w-md space-y-4">
        <h1 className="font-display text-3xl">{saved ? 'Password saved!' : 'Set your password'}</h1>
        {saved ? <><p role="status">Next time, sign in with your email and password. Your existing progress stays with this account.</p><Button className="w-full" onClick={() => navigate('/app', { replace: true })}>Continue learning</Button></> : <>
          <p className="text-sm opacity-80">For <strong>{cloud.email}</strong>. Choose a password of at least 8 characters. You’ll stay signed in on this device.</p>
          <form onSubmit={submit} className="space-y-4">
            <input type="text" autoComplete="username" value={cloud.email ?? ''} readOnly className="sr-only" aria-label="Account email" />
            <div className="space-y-1"><label htmlFor="new-password" className="text-sm font-medium">New password</label><input id="new-password" type="password" required minLength={8} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className={field} /></div>
            <div className="space-y-1"><label htmlFor="confirm-new-password" className="text-sm font-medium">Confirm password</label><input id="confirm-new-password" type="password" required minLength={8} autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={field} /></div>
            <Button type="submit" className="w-full" disabled={busy}>{busy ? 'Saving…' : 'Save password'}</Button>
            {error && <p role="alert" className="text-sm text-terracotta-dark">{error}</p>}
          </form>
          <Link to="/app" onClick={cloud.finishPasswordRecovery} className="block text-center text-sm opacity-70 underline">Do this later</Link>
        </>}
      </Card>
    </main>
  )
}
