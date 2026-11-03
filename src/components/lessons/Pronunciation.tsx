import { Loader2, Mic, Snail, Square } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProgress } from '../../hooks/useProgress'
import { recorderSupported, useRecorder } from '../../hooks/useRecorder'
import { speech } from '../../services/speech'
import { transcribe } from '../../services/transcribe'
import type { PronunciationExercise } from '../../types'
import { cn } from '../../utils/cn'
import { matchedWords, similarity } from '../../utils/text'
import { ProgressBar, SpeakButton } from '../common'
import type { ExerciseProps } from './types'

const PASS = 0.75

function verdict(score: number) {
  if (score >= 0.9) return 'Perfeito! That sounded great.'
  if (score >= PASS) return 'Muito bem! Very close.'
  if (score >= 0.5) return 'Quase lá! Listen again and focus on the highlighted words.'
  return 'Let’s try that again — listen first, then speak slowly.'
}

export function Pronunciation({ exercise, checked, onChange }: ExerciseProps<PronunciationExercise>) {
  const { cloud } = useProgress()
  const [result, setResult] = useState<{ heard: string; score: number } | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [skipped, setSkipped] = useState(false)
  const canRecord = recorderSupported && cloud.email !== null

  const recorder = useRecorder(async (audio) => {
    setBusy(true)
    const r = await transcribe(audio)
    setBusy(false)
    if (!r.text) return setError(r.error ?? 'I didn’t catch that. Try again a bit closer to the mic.')
    const score = similarity(r.text, exercise.phrase)
    setError(null)
    setResult({ heard: r.text, score })
    onChange({ ready: true, correct: score >= PASS, note: `${Math.round(score * 100)}% match. ${verdict(score)}` })
  }, 10)

  const skip = () => {
    setSkipped(true)
    onChange({ ready: true, correct: true, note: 'Skipped — no problem. Try it out loud next time!' })
  }

  return (
    <fieldset>
      <legend className="mb-6 font-display text-2xl md:text-3xl">{exercise.prompt}</legend>

      <div className="mb-6 rounded-3xl bg-sun/20 p-5">
        <div className="flex items-center gap-3">
          <p className="flex-1 font-display text-2xl">
            {result
              ? matchedWords(result.heard, exercise.phrase).map(({ word, ok }, i) => (
                  <span key={i} className={cn(!ok && 'rounded bg-terracotta/20 text-terracotta-dark')}>{word} </span>
                ))
              : exercise.phrase}
          </p>
          <SpeakButton text={exercise.phrase} />
          {speech.supported && (
            <button type="button" onClick={() => speech.speak(exercise.phrase, speech.rate * 0.65)} aria-label="Listen slowly" className="grid size-9 place-items-center rounded-full bg-line hover:bg-sky/40">
              <Snail className="size-4" aria-hidden />
            </button>
          )}
        </div>
        <p className="mt-1 opacity-70">{exercise.translation}</p>
      </div>

      {canRecord && !skipped && (
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            disabled={checked || busy}
            onClick={recorder.recording ? recorder.stop : recorder.start}
            aria-label={recorder.recording ? 'Stop recording' : 'Record yourself'}
            className={cn(
              'grid size-20 place-items-center rounded-full text-white shadow-soft transition active:scale-95 disabled:opacity-50',
              recorder.recording ? 'animate-pulse bg-terracotta-dark' : 'bg-terracotta',
            )}
          >
            {busy ? <Loader2 className="size-8 animate-spin" aria-hidden /> : recorder.recording ? <Square className="size-8" aria-hidden /> : <Mic className="size-8" aria-hidden />}
          </button>
          <p className="text-sm opacity-75">
            {recorder.recording ? 'Listening… tap ■ when you’re done.' : busy ? 'Checking…' : result ? 'Tap to try again' : 'Listen first, then tap and speak'}
          </p>
        </div>
      )}

      {result && (
        <div className="mt-6 space-y-2">
          <p className="text-sm">I heard: <strong>“{result.heard}”</strong></p>
          <ProgressBar value={result.score * 100} label="Pronunciation match" color={result.score >= PASS ? 'sage' : 'terracotta'} />
          {!checked && <p className="text-sm opacity-80">{verdict(result.score)}</p>}
        </div>
      )}

      {(recorder.error ?? error) && <p role="alert" className="mt-4 text-sm text-terracotta-dark">{recorder.error ?? error}</p>}

      {!canRecord && (
        <p className="mb-4 rounded-2xl bg-line/60 p-3 text-sm">
          {recorderSupported ? (
            <><Link to="/app/settings" className="font-medium underline">Sign in</Link> to get feedback on your pronunciation. For now, listen and repeat out loud!</>
          ) : (
            'Recording isn’t supported in this browser. Listen and repeat out loud!'
          )}
        </p>
      )}

      {!checked && !skipped && !result && (
        <button type="button" onClick={skip} className="mt-4 block text-sm underline opacity-70 hover:opacity-100">
          {canRecord ? 'I can’t speak right now' : 'I said it out loud'}
        </button>
      )}
    </fieldset>
  )
}
