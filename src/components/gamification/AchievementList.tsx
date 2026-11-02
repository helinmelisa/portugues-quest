import { achievements } from '../../features/achievements/achievements'
import { cn } from '../../utils/cn'

export function AchievementList({ unlocked }: { unlocked: string[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {achievements.map((a) => {
        const earned = unlocked.includes(a.id)
        return (
          <li key={a.id} className={cn('rounded-2xl border border-line p-3 text-center', earned ? 'bg-sun/20' : 'opacity-50 grayscale')}>
            <span className="text-3xl" aria-hidden>{a.icon}</span>
            <p className="mt-1 text-sm font-medium">{a.title}</p>
            <p className="text-xs opacity-75">{earned ? a.description : `Locked · ${a.description}`}</p>
          </li>
        )
      })}
    </ul>
  )
}
