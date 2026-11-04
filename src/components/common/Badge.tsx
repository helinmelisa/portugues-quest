import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

type Tone = 'neutral' | 'terracotta' | 'sage' | 'sun' | 'sky'

const tones: Record<Tone, string> = {
  neutral: 'bg-line text-ink',
  terracotta: 'bg-terracotta/15 text-terracotta-dark',
  sage: 'bg-sage/25 text-ink',
  sun: 'bg-sun/30 text-ink',
  sky: 'bg-sky/30 text-ink',
}

export function Badge({ tone = 'neutral', children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex min-w-0 max-w-full items-center gap-1 whitespace-normal [overflow-wrap:anywhere] [&>svg]:shrink-0 rounded-full px-2.5 py-1 text-xs font-medium', tones[tone], className)}>
      {children}
    </span>
  )
}
