import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/common'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <main className="grid min-h-screen place-items-center p-6 text-center">
      <div className="max-w-xl">
        <h1 className="font-display text-4xl md:text-5xl">Português Quest</h1>
        <p className="mt-4 text-lg opacity-80">Fall in love with Portuguese, one little adventure at a time.</p>
        <Button size="lg" className="mt-8" onClick={() => navigate('/app')}>
          Start your journey
        </Button>
      </div>
    </main>
  )
}
