import { useState } from 'react'
import type { SentenceBuildExercise } from '../../types'
import { cn } from '../../utils/cn'
import { shuffle } from '../../utils/shuffle'
import type { ExerciseProps } from './types'

export function SentenceBuild({ exercise, checked, onChange }: ExerciseProps<SentenceBuildExercise>) {
  const [tiles] = useState(() => shuffle([...exercise.words, ...exercise.distractors]))
  const [chosen, setChosen] = useState<number[]>([])

  const update = (next: number[]) => {
    setChosen(next)
    const sentence = next.map((i) => tiles[i]).join(' ')
    onChange({ ready: next.length > 0, correct: sentence === exercise.words.join(' ') })
  }

  const tileClass = 'rounded-xl border-2 border-line bg-card px-3 py-2 text-lg shadow-soft transition active:scale-95 disabled:shadow-none'

  return (
    <fieldset>
      <legend className="mb-2 font-display text-2xl md:text-3xl">{exercise.prompt}</legend>
      <p className="mb-6 opacity-70">“{exercise.translation}”</p>

      <div aria-label="Your sentence" className="mb-6 flex min-h-16 flex-wrap gap-2 border-b-2 border-line pb-3">
        {chosen.map((i, pos) => (
          <button key={i} type="button" disabled={checked} className={tileClass} onClick={() => update(chosen.filter((_, p) => p !== pos))}>
            {tiles[i]}
          </button>
        ))}
      </div>

      <div aria-label="Word bank" className="flex flex-wrap gap-2">
        {tiles.map((word, i) => {
          const used = chosen.includes(i)
          return (
            <button
              key={i}
              type="button"
              disabled={checked || used}
              aria-hidden={used}
              className={cn(tileClass, used && 'border-dashed bg-transparent text-transparent')}
              onClick={() => update([...chosen, i])}
            >
              {word}
            </button>
          )
        })}
      </div>
      {checked && <p className="mt-6 font-medium">Answer: {exercise.words.join(' ')}</p>}
    </fieldset>
  )
}
