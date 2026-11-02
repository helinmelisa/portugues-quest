import { Check, X } from 'lucide-react'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

type State = 'idle' | 'selected' | 'correct' | 'wrong' | 'muted'

const styles: Record<State, string> = {
  idle: 'border-line hover:border-sage',
  selected: 'border-terracotta bg-terracotta/10',
  correct: 'border-sage bg-sage/20',
  wrong: 'border-terracotta bg-terracotta/10',
  muted: 'border-line opacity-60',
}

export function OptionButton({ state, className, children, ...props }: { state: State } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-pressed={state === 'selected'}
      className={cn('flex items-center justify-between gap-3 rounded-2xl border-2 bg-card px-5 py-4 text-left text-lg transition', styles[state], className)}
      {...props}
    >
      {children}
      {state === 'correct' && <Check className="size-5 shrink-0" aria-label="Correct" />}
      {state === 'wrong' && <X className="size-5 shrink-0 text-terracotta-dark" aria-label="Incorrect" />}
    </button>
  )
}

export function optionState(i: number, selected: number | null, answer: number, checked: boolean): State {
  if (!checked) return i === selected ? 'selected' : 'idle'
  if (i === answer) return 'correct'
  return i === selected ? 'wrong' : 'muted'
}
