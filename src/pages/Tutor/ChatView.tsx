import { ArrowLeft, Lightbulb, Loader2, Mic, Send, Square, Volume2, VolumeX } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Button, SpeakButton } from '../../components/common'
import type { LessonResult } from '../../features/progress/progressContext'
import type { ConversationSummary, Scenario, TutorMessage, TutorSession } from '../../features/tutor/types'
import { useProgress } from '../../hooks/useProgress'
import { recorderSupported, useRecorder } from '../../hooks/useRecorder'
import { speech } from '../../services/speech'
import { transcribe } from '../../services/transcribe'
import { WrapUp } from './WrapUp'
import { cn } from '../../utils/cn'

function TutorBubble({ message }: { message: TutorMessage }) {
  const [showEnglish, setShowEnglish] = useState(false)
  return (
    <li className="flex max-w-[85%] gap-2">
      <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full bg-terracotta font-display text-white">I</span>
      <div className="space-y-2">
        {message.tip && (
          <p className="flex gap-2 rounded-2xl bg-sage/25 px-3 py-2 text-sm">
            <Lightbulb className="mt-0.5 size-4 shrink-0" aria-hidden /> {message.tip}
          </p>
        )}
        <div className="rounded-2xl rounded-tl-sm border border-line bg-card px-4 py-3">
          <div className="flex items-start gap-2">
            <p className="flex-1 text-lg">{message.text}</p>
            <SpeakButton text={message.text} className="size-8" />
          </div>
          {message.translation && (
            <button type="button" onClick={() => setShowEnglish(!showEnglish)} className="mt-1 text-left text-sm opacity-70 hover:opacity-100">
              {showEnglish ? message.translation : 'Show English'}
            </button>
          )}
        </div>
      </div>
    </li>
  )
}

interface ChatViewProps {
  scenario: Scenario
  createSession: () => TutorSession
  voice?: boolean // AI mode: microphone input and spoken replies
  onBack: () => void
}

export function ChatView({ scenario, createSession, voice = false, onBack }: ChatViewProps) {
  const [session] = useState(createSession)
  const [messages, setMessages] = useState<TutorMessage[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [typing, setTyping] = useState(true)
  const [done, setDone] = useState(false)
  const [input, setInput] = useState('')
  const endRef = useRef<HTMLDivElement>(null)
  const { profile, updateProfile, completeConversation, addMistakes } = useProgress()
  const [summary, setSummary] = useState<ConversationSummary | null>(null)
  const [reward, setReward] = useState<LessonResult | null>(null)
  const [ending, setEnding] = useState(false)
  const [endError, setEndError] = useState<string | null>(null)
  const rewarded = useRef(false)
  const userTurns = messages.filter((m) => m.from === 'user').length

  const finish = () => {
    if (rewarded.current) return
    rewarded.current = true
    setReward(completeConversation())
  }

  const end = async () => {
    if (!session.summarize) return
    setEnding(true)
    const result = await session.summarize()
    setEnding(false)
    if ('error' in result) setEndError(result.error)
    else {
      setSummary(result)
      finish()
      addMistakes(result.corrections)
    }
    finish()
    setDone(true)
  }
  const [transcribing, setTranscribing] = useState(false)
  const [micHint, setMicHint] = useState<string | null>(null)
  const spokenId = useRef<string | null>(null)
  const readAloud = voice && profile.tutorVoice === true

  const recorder = useRecorder(async (audio) => {
    setTranscribing(true)
    const result = await transcribe(audio)
    setTranscribing(false)
    if (result.text) setInput((current) => (current ? `${current} ${result.text}` : result.text!))
    setMicHint(result.error ?? (result.text ? null : 'I didn’t catch that. Try again a bit closer to the mic.'))
  })

  useEffect(() => {
    const last = messages.findLast((m) => m.from === 'tutor')
    if (!readAloud || !last || last.id === spokenId.current) return
    spokenId.current = last.id
    speech.speak(last.text)
  }, [messages, readAloud])

  useEffect(() => {
    session.start().then((r) => {
      setMessages(r.messages)
      setSuggestions(r.suggestions)
      setTyping(false)
    })
  }, [session])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, typing])

  const send = async (text: string) => {
    if (!text.trim() || typing || done) return
    setInput('')
    setMessages((m) => [...m, { id: crypto.randomUUID(), from: 'user', text }])
    setTyping(true)
    const reply = await session.reply(text)
    setMessages((m) => [...m, ...reply.messages])
    setSuggestions(reply.suggestions)
    setDone(reply.done)
    if (reply.done) finish()
    setTyping(false)
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    send(input)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <button type="button" onClick={onBack} className="mb-4 inline-flex items-center gap-1 text-sm opacity-70 hover:opacity-100">
        <ArrowLeft className="size-4" aria-hidden /> All scenarios
      </button>
      <div className="flex items-start justify-between gap-3">
        <h1 className="font-display text-2xl md:text-3xl">{scenario.title}</h1>
        {voice && speech.supported && (
          <button
            type="button"
            onClick={() => {
              // iOS only allows speech that starts from a tap, so speak right away to unlock it.
              const last = messages.findLast((m) => m.from === 'tutor')
              if (!readAloud && last) {
                spokenId.current = last.id
                speech.speak(last.text)
              }
              updateProfile({ tutorVoice: !readAloud })
            }}
            aria-pressed={readAloud}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1.5 text-sm hover:border-sage"
          >
            {readAloud ? <Volume2 className="size-4" aria-hidden /> : <VolumeX className="size-4" aria-hidden />}
            {readAloud ? 'Voice on' : 'Voice off'}
          </button>
        )}
      </div>
      <p className="mb-6 opacity-75">{scenario.description}</p>

      <ol aria-live="polite" className="space-y-4">
        {messages.map((m) =>
          m.from === 'tutor' ? (
            <TutorBubble key={m.id} message={m} />
          ) : (
            <li key={m.id} className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-tr-sm bg-terracotta px-4 py-3 text-lg text-white">{m.text}</li>
          ),
        )}
        {typing && <li className="ml-11 text-sm opacity-60">Inês is typing…</li>}
      </ol>
      <div ref={endRef} />

      {done ? (
        <>
          {endError && <p role="alert" className="mt-6 text-sm text-terracotta-dark">{endError}</p>}
          <WrapUp summary={summary} reward={reward} onBack={onBack} />
        </>
      ) : (
        <div className="sticky bottom-20 mt-6 space-y-3 bg-cream py-3 md:bottom-0">
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button key={s} type="button" disabled={typing} onClick={() => send(s)} className="rounded-full border border-line bg-card px-3 py-1.5 text-sm hover:border-sage disabled:opacity-50">
                {s}
              </button>
            ))}
          </div>
          <form onSubmit={submit} className="flex gap-2">
            <label htmlFor="chat-input" className="sr-only">Your reply in Portuguese</label>
            <input
              id="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escreve aqui… (type in Portuguese)"
              autoComplete="off"
              className="min-w-0 flex-1 rounded-full border border-line bg-card px-4 py-3"
            />
            {voice && recorderSupported && (
              <Button
                type="button"
                variant={recorder.recording ? 'primary' : 'secondary'}
                aria-label={recorder.recording ? 'Stop recording' : 'Speak your reply'}
                disabled={typing || transcribing}
                onClick={recorder.recording ? recorder.stop : recorder.start}
                className={cn('px-4', recorder.recording && 'animate-pulse')}
              >
                {transcribing ? <Loader2 className="size-5 animate-spin" aria-hidden /> : recorder.recording ? <Square className="size-5" aria-hidden /> : <Mic className="size-5" aria-hidden />}
              </Button>
            )}
            <Button type="submit" aria-label="Send" disabled={typing || !input.trim()} className={cn('px-4')}>
              <Send className="size-5" aria-hidden />
            </Button>
          </form>
          {session.summarize && userTurns >= 2 && (
            <Button variant="ghost" size="sm" disabled={typing || ending} onClick={end}>
              {ending ? <><Loader2 className="size-4 animate-spin" aria-hidden /> Preparing your feedback…</> : 'End conversation & get feedback'}
            </Button>
          )}
          {recorder.recording && <p className="text-sm opacity-75">Listening… tap ■ when you’re done.</p>}
          {(recorder.error ?? micHint) && <p role="alert" className="text-sm text-terracotta-dark">{recorder.error ?? micHint}</p>}
        </div>
      )}
    </div>
  )
}
