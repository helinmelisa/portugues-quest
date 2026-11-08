import { ExerciseFrame } from './ExerciseFrame'
import { useState } from 'react'
import type { MatchingExercise } from '../../types'
import { cn } from '../../utils/cn'
import { shuffle } from '../../utils/shuffle'
import type { ExerciseProps } from './types'

export function Matching({ exercise, checked, onChange }: ExerciseProps<MatchingExercise>) {
  const [left] = useState(() => shuffle(exercise.pairs.map((_, i) => i)))
  const [right] = useState(() => shuffle(exercise.pairs.map((_, i) => i)))
  const [active, setActive] = useState<number | null>(null)
  const [matched, setMatched] = useState(new Set<number>())
  const [wrong, setWrong] = useState<number | null>(null)

  const pickRight = (pair: number) => {
    if (active === null) return
    if (pair === active) {
      const next = new Set(matched).add(pair)
      setMatched(next)
      setActive(null)
      if (next.size === exercise.pairs.length) onChange({ ready: true, correct: true })
    } else {
      setWrong(pair)
      setTimeout(() => setWrong(null), 600)
    }
  }

  const tile = (pair: number, side: 0 | 1, onClick: () => void, selected: boolean) => (
    <button
      key={`${side}-${pair}`}
      type="button"
      disabled={checked || matched.has(pair)}
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        'min-w-0 max-w-full rounded-2xl border-2 bg-card px-3 py-3 text-left [overflow-wrap:anywhere] transition sm:px-4',
        matched.has(pair) ? 'border-sage bg-sage/20 opacity-70' : 'border-line hover:border-sage',
        selected && 'border-terracotta bg-terracotta/10',
        wrong === pair && side === 1 && 'animate-[shake_0.3s] border-terracotta',
      )}
    >
      {exercise.pairs[pair][side]}
    </button>
  )

  return (
    <ExerciseFrame prompt={exercise.prompt} compact>
      <p className="mb-6 opacity-70">Tap a Portuguese word, then its meaning.</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="grid min-w-0 gap-3">{left.map((p) => tile(p, 0, () => setActive(p), active === p))}</div>
        <div className="grid min-w-0 gap-3">{right.map((p) => tile(p, 1, () => pickRight(p), false))}</div>
      </div>
    </ExerciseFrame>
  )
}
