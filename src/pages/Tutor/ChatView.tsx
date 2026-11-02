import { ArrowLeft, Lightbulb, Send } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Button, SpeakButton } from '../../components/common'
import type { Scenario, TutorMessage, TutorSession } from '../../features/tutor/types'
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
  onBack: () => void
}

export function ChatView({ scenario, createSession, onBack }: ChatViewProps) {
  const [session] = useState(createSession)
  const [messages, setMessages] = useState<TutorMessage[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [typing, setTyping] = useState(true)
  const [done, setDone] = useState(false)
  const [input, setInput] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

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
      <h1 className="font-display text-2xl md:text-3xl">{scenario.title}</h1>
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
        <div className="mt-8 rounded-3xl bg-sun/25 p-6 text-center">
          <p className="font-display text-2xl">Conversa completa! 🎉</p>
          <p className="mt-1 opacity-80">You just had a real Portuguese exchange.</p>
          <Button className="mt-4" onClick={onBack}>Try another scenario</Button>
        </div>
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
            <Button type="submit" aria-label="Send" disabled={typing || !input.trim()} className={cn('px-4')}>
              <Send className="size-5" aria-hidden />
            </Button>
          </form>
        </div>
      )}
    </div>
  )
}
