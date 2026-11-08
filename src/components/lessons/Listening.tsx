import { ExerciseFrame } from './ExerciseFrame'
import { Snail, Volume2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { speech } from '../../services/speech'
import type { ListeningExercise } from '../../types'
import { OptionButton, optionState } from './OptionButton'
import type { ExerciseProps } from './types'

export function Listening({ exercise, checked, onChange }: ExerciseProps<ListeningExercise>) {
  const [selected, setSelected] = useState<number | null>(null)

  useEffect(() => {
    const t = setTimeout(() => speech.speak(exercise.audioText), 300)
    return () => clearTimeout(t)
  }, [exercise.audioText])

  return (
    <ExerciseFrame prompt={exercise.prompt}>
      {speech.supported ? (
        <div className="mb-8 flex items-center gap-3">
          <button type="button" onClick={() => speech.speak(exercise.audioText)} aria-label="Play audio" className="grid size-20 place-items-center rounded-full bg-sky/40 transition hover:bg-sky/60 active:scale-95">
            <Volume2 className="size-9" aria-hidden />
          </button>
          <button type="button" onClick={() => speech.speak(exercise.audioText, speech.rate * 0.65)} aria-label="Play slowly" className="grid size-12 place-items-center rounded-full bg-line transition hover:bg-sky/40">
            <Snail className="size-5" aria-hidden />
          </button>
        </div>
      ) : (
        <p className="mb-6 rounded-2xl bg-line/60 p-3">Audio isn’t supported in this browser. The phrase is: <strong>{exercise.audioText}</strong></p>
      )}
      {checked && <p className="mb-4">Transcript: <strong>{exercise.audioText}</strong></p>}
      <div className="grid gap-3">
        {exercise.options.map((option, i) => (
          <OptionButton
            key={option}
            disabled={checked}
            state={optionState(i, selected, exercise.answer, checked)}
            onClick={() => {
              setSelected(i)
              onChange({ ready: true, correct: i === exercise.answer })
            }}
          >
            {option}
          </OptionButton>
        ))}
      </div>
    </ExerciseFrame>
  )
}
