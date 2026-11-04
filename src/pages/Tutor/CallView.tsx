import { ArrowLeft, Loader2, Mic, Pause, Phone, PhoneOff, Play, Volume2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button, Card } from '../../components/common'
import type { LessonResult } from '../../features/progress/progressContext'
import type { ConversationSummary, Scenario, TutorMessage, TutorReply, TutorSession } from '../../features/tutor/types'
import { useOnline } from '../../hooks/useOnline'
import { useCallRecorder } from '../../hooks/useCallRecorder'
import { useProgress } from '../../hooks/useProgress'
import { speech } from '../../services/speech'
import { transcribe } from '../../services/transcribe'
import { WrapUp } from './WrapUp'

type Phase = 'ready' | 'waiting' | 'speaking' | 'listening' | 'transcribing' | 'paused' | 'ending' | 'done'
const labels: Record<Phase, string> = {
  ready: 'Ready when you are', waiting: 'Inês is thinking…', speaking: 'Inês is speaking…', listening: 'Your turn — speak, then pause briefly',
  transcribing: 'Understanding your reply…', paused: 'Call paused', ending: 'Preparing your feedback…', done: 'Call complete',
}

interface Props {
  scenario: Scenario
  createSession: () => TutorSession
  onBack: () => void
  onChat: () => void
}

export function CallView({ scenario, createSession, onBack, onChat }: Props) {
  const online = useOnline()
  const [session] = useState(createSession)
  const { completeConversation, addMistakes } = useProgress()
  const [networkBusy, setNetworkBusy] = useState(false)
  const [phase, setPhase] = useState<Phase>('ready')
  const [messages, setMessages] = useState<TutorMessage[]>([])
  const [error, setError] = useState<string | null>(null)
  const [summary, setSummary] = useState<ConversationSummary | null>(null)
  const [reward, setReward] = useState<LessonResult | null>(null)
  const alive = useRef(true)
  const running = useRef(false)
  const started = useRef(false)
  const pending = useRef(false)
  const rewarded = useRef(false)
  const watchdog = useRef<number | undefined>(undefined)
  const listenRef = useRef<() => void>(() => {})
  const playback = useRef(0)
  const receiveRef = useRef<(reply: TutorReply) => void>(() => {})
  const pauseRef = useRef<(reason?: string) => void>(() => {})
  const userTurns = messages.filter((m) => m.from === 'user').length

  const recorder = useCallRecorder(async (audio) => {
    if (!running.current) return
    pending.current = true
    setNetworkBusy(true)
    setPhase('transcribing')
    try {
      const result = await transcribe(audio)
      if (!alive.current) return
      if (!running.current) return
      if (result.error || !result.text?.trim()) {
        pauseRef.current(result.error ?? 'I didn’t catch that. Resume to try your reply again.')
        return
      }
      setMessages((m) => [...m, { id: crypto.randomUUID(), from: 'user', text: result.text! }])
      setPhase('waiting')
      const reply = await session.reply(result.text)
      if (!alive.current) return
      receiveRef.current(reply)
    } catch {
      if (alive.current) pauseRef.current('The connection was interrupted. Resume to try again, or end the call.')
    } finally {
      pending.current = false
      if (alive.current) setNetworkBusy(false)
    }
  }, (message) => pauseRef.current(message))

  const pause = (reason?: string) => {
    running.current = false
    playback.current++
    window.clearTimeout(watchdog.current)
    recorder.cancel()
    speech.cancel()
    if (alive.current) {
      setPhase('paused')
      if (reason) setError(reason)
    }
  }
  useEffect(() => { pauseRef.current = pause })

  const listen = () => {
    if (!alive.current || !running.current) return
    setPhase('listening')
    void recorder.start()
  }
  useEffect(() => { listenRef.current = listen })

  const receive = (reply: TutorReply, replay = false) => {
    if (!replay) setMessages((m) => [...m, ...reply.messages])
    if (reply.error) { pause(reply.error); return }
    if (!running.current) return
    const text = reply.messages.filter((m) => m.from === 'tutor').map((m) => m.text).join(' ')
    if (!text) { pause('Inês’s reply was empty. Resume to continue.'); return }
    const turn = ++playback.current
    setPhase('speaking')
    // Some devices silently block playback. Never open the mic over a stuck reply.
    watchdog.current = window.setTimeout(() => pauseRef.current('Audio did not finish. Resume to replay Inês’s reply, or switch to chat.'), 45000)
    speech.speak(text, undefined, () => {
      if (turn !== playback.current) return
      window.clearTimeout(watchdog.current)
      listenRef.current()
    }, () => {
      if (turn === playback.current && running.current) pauseRef.current('Audio could not play. Resume to retry, or use chat instead.')
    })
  }

  useEffect(() => { receiveRef.current = receive })

  const begin = async () => {
    if (pending.current) return
    if (!online) { setError('Reconnect to start a call. Lessons and reading are available offline.'); return }
    speech.unlock()
    setError(null)
    running.current = true
    if (started.current) {
      const last = messages.findLast((m) => m.from === 'tutor')
      if (last) receive({ messages: [last], suggestions: [], done: false }, true)
      else listen()
      return
    }
    started.current = true
    pending.current = true
    setNetworkBusy(true)
    setPhase('waiting')
    try {
      const reply = await session.start()
      if (reply.error) started.current = false
      if (alive.current) receive(reply)
    } catch {
      if (alive.current) { started.current = false; pause('Couldn’t reach Inês. Try starting the call again.') }
    } finally {
      pending.current = false
      if (alive.current) setNetworkBusy(false)
    }
  }

  const end = async () => {
    if (pending.current) return
    pause()
    setPhase('ending')
    pending.current = true
    setNetworkBusy(true)
    try {
      const result = await session.summarize?.()
      if (!alive.current) return
      if (result && !('error' in result)) {
        setSummary(result)
        // Complete the activity before queuing functional progress updates.
        if (!rewarded.current) { rewarded.current = true; setReward(completeConversation()) }
        addMistakes(result.corrections)
      } else {
        setError(result && 'error' in result ? result.error : 'Feedback is unavailable this time.')
        if (!rewarded.current) { rewarded.current = true; setReward(completeConversation()) }
      }
    } catch {
      if (alive.current) setError('Couldn’t prepare feedback. You can try another call when the connection returns.')
    } finally {
      pending.current = false
      if (alive.current) setNetworkBusy(false)
      if (alive.current) setPhase('done')
    }
  }

  useEffect(() => {
    alive.current = true
    const hide = () => { if (document.hidden && running.current) pauseRef.current('Call paused while the app was in the background.') }
    const disconnected = () => pauseRef.current('Your connection dropped. Reconnect, then resume or use chat.')
    window.addEventListener('offline', disconnected)
    document.addEventListener('visibilitychange', hide)
    return () => {
      alive.current = false
      running.current = false
      window.clearTimeout(watchdog.current)
      speech.cancel()
      window.removeEventListener('offline', disconnected)
      document.removeEventListener('visibilitychange', hide)
    }
  }, [])

  return (
    <div className="mx-auto max-w-2xl">
      <button type="button" onClick={onBack} className="mb-4 inline-flex items-center gap-1 text-sm opacity-70 hover:opacity-100"><ArrowLeft className="size-4" aria-hidden /> All scenarios</button>
      <h1 className="font-display text-3xl">{scenario.title}</h1>
      <p className="mb-6 mt-2 opacity-75">{scenario.description}</p>
      <Card className="space-y-5 bg-sky/15 text-center">
        <div className="mx-auto grid size-20 place-items-center rounded-full bg-terracotta text-white">
          {phase === 'listening' ? <Mic className="size-8 animate-pulse" aria-hidden /> : phase === 'speaking' ? <Volume2 className="size-8" aria-hidden /> : <Phone className="size-8" aria-hidden />}
        </div>
        <h2 className="font-display text-2xl">Inês</h2>
        <p role="status" aria-live="polite">{labels[phase]}</p>
        <p className="text-sm opacity-75">Hands-free practice: speak after Inês finishes. A short silence sends your turn. Your recording is sent for transcription, just like voice input in chat. Use invented personal details.</p>
        <div className="flex flex-wrap justify-center gap-3">
          {(phase === 'ready' || phase === 'paused') && <Button disabled={networkBusy || !online} onClick={begin}><Play className="size-4" aria-hidden /> {phase === 'ready' ? 'Start call' : 'Resume call'}</Button>}
          {['listening', 'speaking', 'waiting', 'transcribing'].includes(phase) && <Button variant="secondary" onClick={() => pause()}><Pause className="size-4" aria-hidden /> Pause</Button>}
          {userTurns >= 2 && phase !== 'done' && <Button variant="secondary" disabled={networkBusy || phase === 'ending'} onClick={end}>{phase === 'ending' ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <PhoneOff className="size-4" aria-hidden />} End call & get feedback</Button>}
        </div>
        {userTurns < 2 && phase !== 'ready' && <p className="text-xs opacity-70">Try at least two replies to get your call feedback.</p>}
      </Card>
      <Button className="mt-4" variant="ghost" onClick={onChat}>Use chat instead</Button>
      {error && <p role="alert" className="mt-4 text-sm text-terracotta-dark">{error}</p>}
      {messages.length > 0 && <details className="mt-5 rounded-2xl border border-line p-4"><summary className="cursor-pointer font-medium">Call transcript</summary><ol className="mt-3 space-y-3">{messages.map((m, i) => <li key={`${m.id}-${i}`}><p className="text-xs font-medium opacity-60">{m.from === 'tutor' ? 'Inês' : 'You'}</p><p lang="pt-PT">{m.text}</p>{m.translation && <p className="text-sm opacity-70">{m.translation}</p>}</li>)}</ol></details>}
      {phase === 'done' && <WrapUp summary={summary} reward={reward} onBack={onBack} />}
    </div>
  )
}
