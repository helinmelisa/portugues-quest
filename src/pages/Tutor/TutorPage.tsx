import { PageHeader } from '../../components/common/PageHeader'
import { MessageCircle, PenLine } from 'lucide-react'
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

  if (!online && ai && !active)
    return (
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl">Inês is online-only</h1>
        <p className="my-4 opacity-80">
          Reconnect for conversations, transcription and calls. Your lessons and reading are ready offline after
          download.
        </p>
        <Link to="/app/practice" className="font-medium text-terracotta-dark underline">
          Open Practice Corner →
        </Link>
      </div>
    )

  if (active) {
    const learner: LearnerContext = {
      name: profile.name,
      interests: profile.interests,
      motivation: onboardingSteps
        .find((s) => s.key === 'motivation')
        ?.options.find((o) => o.value === profile.motivation)?.label,
      mistakes: progress.mistakes.slice(-5).map((m) => `“${m.said}” → “${m.better}”`),
    }
    const createSession = () =>
      ai
        ? createAiTutor(active, active.level === 'A2' ? 'A2' : profile.level, learner, callMode)
        : createScriptedTutor(active)
    if (callMode && canCall)
      return (
        <CallView
          key={active.id}
          scenario={active}
          createSession={createSession}
          onBack={() => setActiveId(null)}
          onChat={() => setCallMode(false)}
        />
      )
    return (
      <ChatView
        key={active.id}
        scenario={active}
        createSession={createSession}
        voice={ai}
        onBack={() => setActiveId(null)}
      />
    )
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
      <PageHeader
        eyebrow="Your conversation partner"
        title="Practise with Inês"
        description={
          <>Inês is your friendly conversation partner from Lisboa. Pick a situation and practise speaking.</>
        }
      />

      <details className="mb-5 rounded-2xl border border-line bg-card p-4 text-sm">
        <summary className="font-medium">
          {ai ? 'About your AI conversation partner' : 'About demo conversations'}
        </summary>
        <p className="mt-3 text-ink/75">
          {ai
            ? 'Inês adapts to your level and recent practice. She can make mistakes. Up to 50 messages a day; use invented personal details.'
            : 'Demo conversations follow a short script. Sign in for free conversations.'}
        </p>
      </details>
      {ai && (
        <Card className="mb-5 space-y-3">
          <h2 className="font-display text-xl">How would you like to practise?</h2>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Conversation mode">
            <Button
              variant={!callMode ? 'primary' : 'secondary'}
              aria-pressed={!callMode}
              onClick={() => setCallMode(false)}
            >
              Chat with Inês
            </Button>
            <Button
              variant={callMode ? 'primary' : 'secondary'}
              aria-pressed={callMode}
              disabled={!canCall}
              onClick={() => setCallMode(true)}
            >
              Phone call
            </Button>
          </div>
          <p className="text-sm text-ink/75">
            {callMode
              ? 'Speak after Inês replies. A short silence sends your turn. Choose a phone scenario below.'
              : 'Type or record a reply, reveal translations, and take your time.'}
          </p>
          {!canCall && (
            <p className="text-sm text-ink/75">
              Calls need microphone recording and audio support. Chat is available on this browser.
            </p>
          )}
        </Card>
      )}

      {ai && (
        <details className="mb-4 rounded-3xl border border-line bg-sun/10 p-5">
          <summary className="font-medium">Rehearse your own situation</summary>
          <div className="mt-4 space-y-3">
            <h2 className="flex items-center gap-2 font-display text-xl">
              <PenLine className="size-5 text-terracotta" aria-hidden /> Practise your own situation
            </h2>
            <p className="text-sm opacity-80">
              About to face something real? Describe it and Inês will role-play it with you.
            </p>
            {writing ? (
              <form onSubmit={startCustom} className="space-y-2">
                <label htmlFor="situation" className="sr-only">
                  Your situation
                </label>
                <textarea
                  id="situation"
                  rows={2}
                  value={situation}
                  onChange={(e) => setSituation(e.target.value)}
                  placeholder="e.g. Tomorrow I have to call my landlord because the heating is broken."
                  className="w-full resize-none rounded-2xl border border-line bg-card px-4 py-3"
                />
                <Button type="submit" disabled={!situation.trim()}>
                  Start role-play
                </Button>
              </form>
            ) : (
              <Button variant="secondary" onClick={() => setWriting(true)}>
                Describe a situation
              </Button>
            )}
          </div>
        </details>
      )}

      <h2 className="mb-4 mt-7 font-display text-2xl">
        {callMode ? 'Choose a phone scenario' : 'Choose a conversation'}
      </h2>
      <ul className="grid gap-4 sm:grid-cols-2">
        {scenarios
          .filter((s) => !callMode || s.call)
          .map((s) => {
            const playable = ai || s.steps !== undefined
            const content = (
              <Card
                className={`activity-card h-full transition ${playable ? 'hover:-translate-y-0.5 hover:border-sage' : 'opacity-60'}`}
              >
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
                  <button
                    type="button"
                    onClick={() => setActiveId(s.id)}
                    className="block h-full w-full rounded-3xl text-left"
                  >
                    {content}
                  </button>
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
