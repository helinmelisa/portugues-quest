import { Badge, Button, Card, ProgressBar } from './components/common'
import { StreakChip, XpChip } from './components/gamification/StatChip'

export default function App() {
  return (
    <main className="mx-auto max-w-3xl space-y-8 p-6 md:py-12">
      <header className="text-center">
        <h1 className="font-display text-4xl md:text-5xl">Português Quest</h1>
        <p className="mt-3 text-lg opacity-80">
          Fall in love with Portuguese, one little adventure at a time.
        </p>
      </header>

      <Card className="space-y-4">
        <h2 className="font-display text-2xl">Design system preview</h2>
        <div className="flex flex-wrap gap-3">
          <Button>Start your journey</Button>
          <Button variant="secondary">See how it works</Button>
          <Button variant="ghost">Skip</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone="terracotta">A1</Badge>
          <Badge tone="sage">Café</Badge>
          <Badge tone="sun">+20 XP</Badge>
          <Badge tone="sky">Listening</Badge>
          <Badge>Locked</Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          <XpChip xp={120} />
          <StreakChip days={3} />
        </div>
        <ProgressBar value={60} label="Progress to A1" />
        <ProgressBar value={2} max={5} label="Daily goal" color="sage" />
      </Card>
    </main>
  )
}
