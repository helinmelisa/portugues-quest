import { Compass, Footprints, Map, MessageCircle, Sparkles, Trophy } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Card } from '../../components/common'
import { useProgress } from '../../hooks/useProgress'
import { HeroArt } from './HeroArt'

const features = [
  { icon: Compass, title: 'Explore as you learn', text: 'Travel from Lisboa to Porto and beyond. Every place unlocks real situations you will actually meet.' },
  { icon: Footprints, title: 'Play in small steps', text: 'Quests take three to seven minutes. A little each day goes a long way.' },
  { icon: MessageCircle, title: 'Speak with confidence', text: 'Order a coffee, ask for directions, meet your neighbours — in the Portuguese spoken in Portugal.' },
]

const steps = [
  { icon: Map, title: 'Pick a destination', text: 'Start in Lisboa with your very first “Olá”.' },
  { icon: Sparkles, title: 'Complete little quests', text: 'Learn useful words and practise them in real moments.' },
  { icon: Trophy, title: 'Earn XP and unlock places', text: 'Grow your streak gently and travel further across Portugal.' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const { profile } = useProgress()
  const start = () => navigate(profile.onboarded ? '/app' : '/onboarding')

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 md:px-8">
        <Link to="/" className="font-display text-xl md:text-2xl">
          Português <span className="text-terracotta">Quest</span>
        </Link>
        <Button size="sm" variant="secondary" onClick={start}>Open app</Button>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-10 md:grid-cols-2 md:px-8 md:py-20">
          <div>
            <p className="mb-4 inline-block rounded-full bg-sage/25 px-3 py-1 text-sm font-medium">European Portuguese 🇵🇹</p>
            <h1 className="font-display text-4xl leading-tight md:text-6xl">
              Fall in love with Portuguese, one little adventure at a time.
            </h1>
            <p className="mt-5 max-w-lg text-lg opacity-80">
              Learn the language people speak in Portugal through cozy quests, real-life moments and friendly practice.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" onClick={start}>Start your journey</Button>
              <Button size="lg" variant="secondary" onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}>
                See how it works
              </Button>
            </div>
          </div>
          <Card className="p-3 md:p-4">
            <HeroArt />
          </Card>
        </section>

        <section aria-labelledby="features-title" className="mx-auto max-w-6xl px-4 py-12 md:px-8">
          <h2 id="features-title" className="mb-8 text-center font-display text-3xl md:text-4xl">Not homework. A journey.</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {features.map(({ icon: Icon, title, text }) => (
              <Card key={title}>
                <Icon className="mb-4 size-8 text-terracotta" aria-hidden />
                <h3 className="font-display text-xl">{title}</h3>
                <p className="mt-2 opacity-80">{text}</p>
              </Card>
            ))}
          </div>
        </section>

        <section id="how" aria-labelledby="how-title" className="mx-auto max-w-4xl scroll-mt-6 px-4 py-12 md:px-8">
          <h2 id="how-title" className="mb-8 text-center font-display text-3xl md:text-4xl">How the adventure works</h2>
          <ol className="space-y-4">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="flex items-start gap-4 rounded-3xl border border-line bg-card p-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-sun/40 font-display text-lg">{i + 1}</span>
                <div>
                  <h3 className="flex items-center gap-2 font-medium">
                    <Icon className="size-4 text-terracotta" aria-hidden /> {title}
                  </h3>
                  <p className="mt-1 opacity-80">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 md:px-8">
          <div className="rounded-[2rem] bg-terracotta px-6 py-12 text-center text-white md:py-16">
            <h2 className="font-display text-3xl md:text-4xl">Your first “Bom dia” is waiting.</h2>
            <p className="mx-auto mt-3 max-w-md opacity-90">Five minutes today. A little more Portugal tomorrow.</p>
            <Button size="lg" variant="secondary" className="mt-8" onClick={start}>Start your journey</Button>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-4 py-8 text-center text-sm opacity-70 md:px-8">
        Português Quest · Made with saudade · Feito com carinho
      </footer>
    </div>
  )
}
