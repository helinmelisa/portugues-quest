import { Check, X } from 'lucide-react'
import type { MultipleChoiceExercise } from '../../types'
import { cn } from '../../utils/cn'

interface Props {
  exercise: MultipleChoiceExercise
  selected: number | null
  checked: boolean
  onSelect: (index: number) => void
}

export function MultipleChoice({ exercise, selected, checked, onSelect }: Props) {
  return (
    <fieldset>
      <legend className="mb-6 font-display text-2xl md:text-3xl">{exercise.prompt}</legend>
      <div className="grid gap-3">
        {exercise.options.map((option, i) => {
          const isAnswer = i === exercise.answer
          const isSelected = i === selected
          return (
            <button
              key={option}
              type="button"
              disabled={checked}
              aria-pressed={isSelected}
              onClick={() => onSelect(i)}
              className={cn(
                'flex items-center justify-between rounded-2xl border-2 bg-card px-5 py-4 text-left text-lg transition',
                !checked && (isSelected ? 'border-terracotta bg-terracotta/10' : 'border-line hover:border-sage'),
                checked && isAnswer && 'border-sage bg-sage/20',
                checked && isSelected && !isAnswer && 'border-terracotta bg-terracotta/10',
                checked && !isAnswer && !isSelected && 'border-line opacity-60',
              )}
            >
              {option}
              {checked && isAnswer && <Check className="size-5" aria-label="Correct answer" />}
              {checked && isSelected && !isAnswer && <X className="size-5 text-terracotta-dark" aria-label="Your answer" />}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
