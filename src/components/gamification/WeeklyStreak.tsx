import { Check } from 'lucide-react'
import { addDays, dayKey } from '../../utils/date'
import { cn } from '../../utils/cn'

const LABELS = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'] // segunda … domingo

export function WeeklyStreak({ activeDays }: { activeDays: string[] }) {
  const today = new Date()
  const monday = addDays(today, -((today.getDay() + 6) % 7))
  const active = new Set(activeDays)

  return (
    <ol className="grid grid-cols-7 gap-1.5" aria-label="This week's activity">
      {LABELS.map((label, i) => {
        const date = addDays(monday, i)
        const key = dayKey(date)
        const done = active.has(key)
        const isToday = key === dayKey(today)
        return (
          <li key={key} className="flex flex-col items-center gap-1 text-xs">
            <span
              aria-label={`${date.toLocaleDateString('en', { weekday: 'long' })}: ${done ? 'practised' : 'no practice'}`}
              className={cn(
                'grid size-9 place-items-center rounded-full border-2',
                done ? 'border-terracotta bg-terracotta text-white' : 'border-line bg-card',
                isToday && !done && 'border-sun',
              )}
            >
              {done && <Check className="size-4" aria-hidden />}
            </span>
            <span className={cn(isToday && 'font-bold')}>{label}</span>
          </li>
        )
      })}
    </ol>
  )
}
