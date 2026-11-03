import { Info, MessageCircle, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge, Card } from '../../components/common'
import { createAiTutor } from '../../features/tutor/aiTutor'
import { scenarios } from '../../features/tutor/scenarios'
import { createScriptedTutor } from '../../features/tutor/scriptedTutor'
import { useProgress } from '../../hooks/useProgress'
import { ChatView } from './ChatView'

export default function TutorPage() {
  const { cloud, profile } = useProgress()
  const [activeId, setActiveId] = useState<string | null>(null)
  const ai = cloud.email !== null
  const active = scenarios.find((s) => s.id === activeId)

  if (active) {
    const createSession = () => (ai ? createAiTutor(active, profile.level) : createScriptedTutor(active))
    return <ChatView key={active.id} scenario={active} createSession={createSession} voice={ai} onBack={() => setActiveId(null)} />
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-3xl md:text-4xl">Chat with Inês</h1>
      <p className="mt-2 opacity-80">Inês is your friendly conversation partner from Lisboa. Pick a situation and practise speaking.</p>

      <p className="my-6 flex gap-2 rounded-2xl border border-sky bg-sky/20 p-4 text-sm">
        {ai ? <Sparkles className="mt-0.5 size-4 shrink-0" aria-hidden /> : <Info className="mt-0.5 size-4 shrink-0" aria-hidden />}
        <span>
          {ai ? (
            'AI mode: Inês replies freely and adapts to your level. She can still make mistakes. Up to 50 messages a day.'
          ) : (
            <>
              Demo mode: Inês follows a short script.{' '}
              <Link to="/app/settings" className="font-medium underline">Sign in</Link> to unlock free conversations with AI Inês and every scenario.
            </>
          )}
        </span>
      </p>

      <ul className="grid gap-4 sm:grid-cols-2">
        {scenarios.map((s) => {
          const playable = ai || s.steps !== undefined
          const content = (
            <Card className={`h-full transition ${playable ? 'hover:-translate-y-0.5 hover:border-sage' : 'opacity-60'}`}>
              <MessageCircle className="size-7 text-terracotta" aria-hidden />
              <h2 className="mt-3 font-display text-xl">{s.title}</h2>
              <p className="mt-1 opacity-80">{s.description}</p>
              <div className="mt-4 flex gap-2">
                <Badge tone="terracotta">{s.level}</Badge>
                {!playable && <Badge>Sign in to unlock</Badge>}
              </div>
            </Card>
          )
          return (
            <li key={s.id}>
              {playable ? (
                <button type="button" onClick={() => setActiveId(s.id)} className="block h-full w-full rounded-3xl text-left">{content}</button>
              ) : (
                content
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
