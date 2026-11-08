import { LockKeyhole, Mail } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Button, Card } from '../../components/common'
import { useProgress } from '../../hooks/useProgress'

type Mode = 'password' | 'signup' | 'reset' | 'link'
const titles: Record<Mode, string> = { password: 'Bem-vindo de volta!', signup: 'Start your journey', reset: 'Set or reset your password', link: 'Email me a sign-in link' }

export default function LoginPage() {
  const { cloud } = useProgress()
  const [mode, setMode] = useState<Mode>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [link, setLink] = useState('')
  const [error, setError] = useState<string | null>(null)
  if (!cloud.ready) return <main className="grid min-h-dvh place-items-center p-6" role="status">Checking your saved session…</main>
  if (cloud.passwordRecovery) return <Navigate to="/password" replace />
  if (cloud.status === 'off' || cloud.email) return <Navigate to="/app" replace />

  const changeMode = (next: Mode) => { setMode(next); setError(null); setSent(false); setPassword(''); setConfirm(''); setLink('') }
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (sending) return
    setError(null)
    if (mode === 'signup' && password !== confirm) { setError('The passwords don’t match. Try again.'); return }
    setSending(true)
    try {
      if (mode === 'password') setError(await cloud.signInPassword(email.trim(), password))
      else if (mode === 'signup') {
        const result = await cloud.signUp(email.trim(), password)
        if (result.error) setError(result.error)
        else if (result.confirmationRequired) setSent(true)
      } else {
        const err = await (mode === 'reset' ? cloud.resetPassword(email.trim()) : cloud.signIn(email.trim()))
        if (err) setError(err)
        else setSent(true)
      }
    } catch { setError('Couldn’t connect. Check your connection and try again.') }
    finally { setSending(false); setPassword(''); setConfirm('') }
  }
  const passwordMode = mode === 'password' || mode === 'signup'
  const field = 'w-full rounded-2xl border border-line bg-cream px-4 py-3'
  return (
    <main className="auth-screen grid min-h-dvh place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 block text-center font-display text-2xl">Português <span className="text-terracotta">Quest</span></Link>
        <Card className="space-y-5 p-6 md:p-8">
          {sent ? (
            <div className="space-y-4">
              <h1 className="font-display text-2xl">Check your email</h1>
              <p className="opacity-80">{mode === 'reset' ? <>If an account exists for <strong>{email}</strong>, we’ll email a link to set your password. After that, sign in here with your email and password.</> : mode === 'signup' ? <>If confirmation is required, check <strong>{email}</strong> to confirm your account. Then return here and sign in with your password.</> : <>Check <strong>{email}</strong> for your sign-in link.</>}</p>
              {mode === 'link' && <details className="rounded-2xl border border-line p-3 text-sm">
                <summary className="cursor-pointer font-medium">Signing in to the home-screen app?</summary>
                <p className="my-3 opacity-80">If the email opens Safari, copy a fresh, unopened sign-in link and paste it here.</p>
                <form onSubmit={async (e) => { e.preventDefault(); setSending(true); setError(null); try { setError(await cloud.redeemLink(link)) } catch { setError('Couldn’t sign in. Request a fresh link and try again.') } finally { setSending(false); setLink('') } }} className="space-y-2">
                  <label htmlFor="sign-in-link">Sign-in link</label>
                  <input id="sign-in-link" type="password" value={link} onChange={(e) => setLink(e.target.value)} autoComplete="off" className={field} />
                  <Button type="submit" disabled={sending || !link.trim()}>Sign in to this app</Button>
                </form>
              </details>}
              <Button className="w-full" variant="secondary" onClick={() => changeMode('password')}>Back to password sign-in</Button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-terracotta-dark">Your next little adventure</p><h1 className="font-display text-3xl">{titles[mode]}</h1>
              <p className="text-sm opacity-80">{mode === 'password' ? 'Use your email and password. You’ll stay signed in on this device.' : mode === 'reset' ? 'Already used email links? Set a password for that same email to keep your existing progress.' : mode === 'signup' ? 'One account for the website and your iPhone app.' : 'A sign-in link is still available if you prefer.'}</p>
              <div className="space-y-1"><label htmlFor="login-email" className="text-sm font-medium">Email</label><input id="login-email" type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className={field} placeholder="you@example.com" /></div>
              {passwordMode && <div className="space-y-1"><label htmlFor="login-password" className="text-sm font-medium">Password</label><input id="login-password" type="password" required minLength={mode === 'signup' ? 8 : undefined} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} value={password} onChange={(e) => setPassword(e.target.value)} className={field} />{mode === 'signup' && <p className="text-xs opacity-70">At least 8 characters.</p>}</div>}
              {mode === 'signup' && <div className="space-y-1"><label htmlFor="confirm-password" className="text-sm font-medium">Confirm password</label><input id="confirm-password" type="password" required minLength={8} autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={field} /></div>}
              <Button type="submit" size="lg" className="w-full" disabled={sending}>{passwordMode ? <LockKeyhole className="size-5" aria-hidden /> : <Mail className="size-5" aria-hidden />}{sending ? 'Please wait…' : mode === 'password' ? 'Sign in' : mode === 'signup' ? 'Create account' : mode === 'reset' ? 'Send password setup link' : 'Send sign-in link'}</Button>
              {mode === 'password' && <button type="button" onClick={() => changeMode('reset')} className="block w-full text-sm text-terracotta-dark underline">Set a password or forgot password?</button>}
            </form>
          )}
          {error && <p role="alert" className="text-sm text-terracotta-dark">{error}</p>}
          {!sent && <div className="space-y-2 border-t border-line pt-3 text-center text-sm">
            <button type="button" disabled={sending} onClick={() => changeMode(mode === 'password' ? 'signup' : 'password')} className="block w-full underline">{mode === 'password' ? 'New here? Create an account' : 'Back to password sign-in'}</button>
            {mode === 'password' && <button type="button" disabled={sending} onClick={() => changeMode('link')} className="block w-full opacity-70 underline">Email a sign-in link instead</button>}
          </div>}
        </Card>
      </div>
    </main>
  )
}
