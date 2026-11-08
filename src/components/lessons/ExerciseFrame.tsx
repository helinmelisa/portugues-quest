import { useId, type ReactNode } from 'react'
import { cn } from '../../utils/cn'

// A normal heading avoids mobile WebKit's intrinsic fieldset/legend sizing.
export function ExerciseFrame({ prompt, compact = false, children }: { prompt: string; compact?: boolean; children: ReactNode }) {
  const titleId = useId()
  const paragraphs = prompt.split(/\n\s*\n/)
  const question = paragraphs.at(-1)!
  const passage = paragraphs.slice(0, -1).join('\n\n')
  return (
    <section aria-labelledby={titleId} className="w-full min-w-0 max-w-full">
      <h1 id={titleId} tabIndex={-1} className={cn('w-full min-w-0 max-w-full whitespace-pre-line font-display text-2xl leading-snug [overflow-wrap:anywhere] md:text-3xl', compact ? 'mb-2' : 'mb-6')}>{question}</h1>
      {passage && <div className="mb-5 rounded-2xl border border-line bg-card p-4"><p className="whitespace-pre-line leading-relaxed [overflow-wrap:anywhere]">{passage}</p></div>}
      {children}
    </section>
  )
}
