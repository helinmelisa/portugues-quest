import { Mail } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Button, Card } from '../../components/common'
import { useProgress } from '../../hooks/useProgress'

export default function LoginPage() {
  const { cloud } = useProgress()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (cloud.status === 'off' || cloud.email) return <Navigate to="/app" replace />

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setSending(true)
    setError(null)
    const err = await cloud.signIn(email.trim())
    setSending(false)
    if (err) setError(err)
    else setSent(true)
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 block text-center font-display text-2xl">
          Português <span className="text-terracotta">Quest</span>
        </Link>
        <Card className="space-y-5 p-6 md:p-8">
          {sent ? (
            <div className="space-y-3 text-center" role="status">
              <p className="text-5xl" aria-hidden>📬</p>
              <h1 className="font-display text-2xl">Check your email</h1>
              <p className="opacity-80">We sent a sign-in link to <strong>{email}</strong>. Tap it to start learning — you’ll stay signed in on this device.</p>
              <button type="button" onClick={() => setSent(false)} className="text-sm underline opacity-70 hover:opacity-100">Use a different email</button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <h1 className="font-display text-3xl">Olá! 👋</h1>
                <p className="mt-2 opacity-80">Sign in with your email. Your progress, words and streak are saved to your account on every device. No password needed.</p>
              </div>
              <label htmlFor="login-email" className="sr-only">Email</label>
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-full border border-line bg-cream px-4 py-3"
              />
              <Button type="submit" size="lg" className="w-full" disabled={sending}>
                <Mail className="size-5" aria-hidden /> {sending ? 'Sending…' : 'Send me a sign-in link'}
              </Button>
              {error && <p role="alert" className="text-sm text-terracotta-dark">{error}</p>}
            </form>
          )}
        </Card>
      </div>
    </main>
  )
}
