import { Flame, Sparkles } from 'lucide-react'

export function XpChip({ xp }: { xp: number }) {
  return (
    <span className="inline-flex max-w-full items-center gap-1.5 whitespace-nowrap rounded-full border border-line bg-card px-3 py-1.5 text-sm font-medium">
      <Sparkles className="size-4 shrink-0 text-sun" aria-hidden />
      {xp} XP
    </span>
  )
}

export function StreakChip({ days }: { days: number }) {
  return (
    <span className="inline-flex max-w-full items-center gap-1.5 whitespace-nowrap rounded-full border border-line bg-card px-3 py-1.5 text-sm font-medium">
      <Flame className="size-4 shrink-0 text-terracotta" aria-hidden />
      {days} {days === 1 ? 'day' : 'days'}
    </span>
  )
}
