import { Info, MessageCircle, PenLine, Sparkles } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Badge, Button, Card } from '../../components/common'
import { createAiTutor, type LearnerContext } from '../../features/tutor/aiTutor'
import { scenarios } from '../../features/tutor/scenarios'
import { createScriptedTutor } from '../../features/tutor/scriptedTutor'
import type { Scenario } from '../../features/tutor/types'
import { useProgress } from '../../hooks/useProgress'
import { onboardingSteps } from '../Onboarding/steps'
import { speech } from '../../services/speech'
import { recorderSupported } from '../../hooks/useRecorder'
import { useOnline } from '../../hooks/useOnline'
import { CallView } from './CallView'
import { ChatView } from './ChatView'

export default function TutorPage() {
  const online = useOnline()
  const { cloud, profile, progress } = useProgress()
  const [params] = useSearchParams()
  const [activeId, setActiveId] = useState<string | null>(params.get('scenario'))
  const [custom, setCustom] = useState<Scenario | null>(null)
  const [callMode, setCallMode] = useState(false)
  const [writing, setWriting] = useState(false)
  const [situation, setSituation] = useState('')
  const ai = cloud.email !== null
  const canCall = ai && recorderSupported && speech.supported && typeof AudioContext !== 'undefined'
  const active = activeId === 'custom' ? custom : scenarios.find((s) => s.id === activeId && (ai || s.steps))

  if (!online && ai && !active) return <div className="mx-auto max-w-2xl"><h1 className="font-display text-3xl">Inês is online-only</h1><p className="my-4 opacity-80">Reconnect for conversations, transcription and calls. Your lessons and reading are ready offline after download.</p><Link to="/app/practice" className="font-medium text-terracotta-dark underline">Open Practice Corner →</Link></div>

  if (active) {
    const learner: LearnerContext = {
      name: profile.name,
      interests: profile.interests,
      motivation: onboardingSteps.find((s) => s.key === 'motivation')?.options.find((o) => o.value === profile.motivation)?.label,
      mistakes: progress.mistakes.slice(-5).map((m) => `“${m.said}” → “${m.better}”`),
    }
    const createSession = () => (ai ? createAiTutor(active, active.level === 'A2' ? 'A2' : profile.level, learner, callMode) : createScriptedTutor(active))
    if (callMode && canCall) return <CallView key={active.id} scenario={active} createSession={createSession} onBack={() => setActiveId(null)} onChat={() => setCallMode(false)} />
    return <ChatView key={active.id} scenario={active} createSession={createSession} voice={ai} onBack={() => setActiveId(null)} />
  }

  const startCustom = (e: FormEvent) => {
    e.preventDefault()
    const text = situation.trim()
    if (!text) return
    setCustom({
      id: 'custom',
      title: 'Your situation',
      description: text,
      level: profile.level,
      setting: `Help the learner rehearse a real situation they are about to face in Portugal: “${text}”. Play the other person in that situation, realistically but kindly.`,
    })
    setActiveId('custom')
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-3xl md:text-4xl">Chat with Inês</h1>
      <p className="mt-2 opacity-80">Inês is your friendly conversation partner from Lisboa. Pick a situation and practise speaking.</p>

      <p className="my-6 flex gap-2 rounded-2xl border border-sky bg-sky/20 p-4 text-sm">
        {ai ? <Sparkles className="mt-0.5 size-4 shrink-0" aria-hidden /> : <Info className="mt-0.5 size-4 shrink-0" aria-hidden />}
        <span>
          {ai ? (
            <>AI mode: Inês adapts to your level and remembers what you’ve told her. She can still make mistakes. Up to 50 messages a day. <Link to="/app/settings" className="underline">Tell her about you</Link></>
          ) : (
            <>Demo mode: Inês follows a short script. <Link to="/app/settings" className="font-medium underline">Sign in</Link> to unlock free conversations.</>
          )}
        </span>
      </p>

      {ai && (
        <Card className="mb-4 space-y-3 bg-sun/15">
          <h2 className="flex items-center gap-2 font-display text-xl"><PenLine className="size-5 text-terracotta" aria-hidden /> Practise your own situation</h2>
          <p className="text-sm opacity-80">About to face something real? Describe it and Inês will role-play it with you.</p>
          {writing ? (
            <form onSubmit={startCustom} className="space-y-2">
              <label htmlFor="situation" className="sr-only">Your situation</label>
              <textarea
                id="situation"
                rows={2}
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                placeholder="e.g. Tomorrow I have to call my landlord because the heating is broken."
                className="w-full resize-none rounded-2xl border border-line bg-card px-4 py-3"
              />
              <Button type="submit" disabled={!situation.trim()}>Start role-play</Button>
            </form>
          ) : (
            <Button variant="secondary" onClick={() => setWriting(true)}>Describe a situation</Button>
          )}
        </Card>
      )}

      {ai && (
        <Card className="mb-6 space-y-3 bg-sky/15">
          <h2 className="font-display text-xl">Call mode with Inês</h2>
          <p className="text-sm opacity-80">Practise a phone call: your microphone listens after each spoken reply and sends your turn after a short silence. Finish with two or more replies for feedback on your language.</p>
          {canCall ? <Button variant={callMode ? 'primary' : 'secondary'} aria-pressed={callMode} onClick={() => setCallMode(!callMode)}>{callMode ? 'Call mode on' : 'Turn on call mode'}</Button>
            : <p className="text-sm opacity-70">Call mode needs a browser with microphone recording, audio analysis and spoken replies. You can still practise every scenario in chat.</p>}
          {callMode && <p className="text-sm opacity-70">Choose a phone scenario below, or rehearse your own situation.</p>}
        </Card>
      )}
      <ul className="grid gap-4 sm:grid-cols-2">
        {scenarios.filter((s) => !callMode || s.call).map((s) => {
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
