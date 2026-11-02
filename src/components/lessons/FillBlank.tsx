import { useState } from 'react'
import type { FillBlankExercise } from '../../types'
import { cn } from '../../utils/cn'
import { OptionButton, optionState } from './OptionButton'
import type { ExerciseProps } from './types'

export function FillBlank({ exercise, checked, onChange }: ExerciseProps<FillBlankExercise>) {
  const [selected, setSelected] = useState<number | null>(null)
  const [before, after] = exercise.sentence.split('___')

  return (
    <fieldset>
      <legend className="mb-2 font-display text-2xl md:text-3xl">{exercise.prompt}</legend>
      <p className="mb-6 opacity-70">{exercise.translation}</p>
      <p className="mb-8 text-2xl">
        {before}
        <span className={cn('mx-1 inline-block min-w-16 border-b-2 px-2 text-center font-medium', selected === null ? 'border-ink/40' : 'border-terracotta text-terracotta-dark')}>
          {selected === null ? ' ' : exercise.options[selected]}
        </span>
        {after}
      </p>
      <div className="flex flex-wrap gap-3">
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
    </fieldset>
  )
}
