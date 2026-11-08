import { ExerciseFrame } from './ExerciseFrame'
import { useState } from 'react'
import type { MultipleChoiceExercise } from '../../types'
import { OptionButton, optionState } from './OptionButton'
import type { ExerciseProps } from './types'

export function MultipleChoice({ exercise, checked, onChange }: ExerciseProps<MultipleChoiceExercise>) {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <ExerciseFrame prompt={exercise.prompt}>
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
