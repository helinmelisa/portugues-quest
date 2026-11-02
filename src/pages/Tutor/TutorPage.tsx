import { Info, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { Badge, Card } from '../../components/common'
import { scenarios, upcomingScenarios } from '../../features/tutor/scenarios'
import { ChatView } from './ChatView'

export default function TutorPage() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const active = scenarios.find((s) => s.id === activeId)

  if (active) return <ChatView key={active.id} scenario={active} onBack={() => setActiveId(null)} />

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-3xl md:text-4xl">Chat with Inês</h1>
      <p className="mt-2 opacity-80">Inês is your friendly conversation partner from Lisboa. Pick a situation and practise speaking.</p>

      <p className="my-6 flex gap-2 rounded-2xl border border-sky bg-sky/20 p-4 text-sm">
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
        Demo mode: Inês follows a short script and checks your replies with simple rules. Free-form AI conversations are planned for a future version.
      </p>

      <ul className="grid gap-4 sm:grid-cols-2">
        {scenarios.map((s) => (
          <li key={s.id}>
            <button type="button" onClick={() => setActiveId(s.id)} className="block h-full w-full rounded-3xl text-left">
              <Card className="h-full transition hover:-translate-y-0.5 hover:border-sage">
                <MessageCircle className="size-7 text-terracotta" aria-hidden />
                <h2 className="mt-3 font-display text-xl">{s.title}</h2>
                <p className="mt-1 opacity-80">{s.description}</p>
                <Badge tone="terracotta" className="mt-4">{s.level}</Badge>
              </Card>
            </button>
          </li>
        ))}
        {upcomingScenarios.map((title) => (
          <li key={title}>
            <Card className="flex h-full items-center justify-between gap-3 opacity-60">
              <span className="font-medium">{title}</span>
              <Badge>Coming soon</Badge>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  )
}
