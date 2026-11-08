import { AchievementIcon } from './AchievementIcon'
import { achievements } from '../../features/achievements/achievements'
import { cn } from '../../utils/cn'

export function AchievementList({ unlocked }: { unlocked: string[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {achievements.map((a) => {
        const earned = unlocked.includes(a.id)
        return (
          <li key={a.id} className={cn('rounded-2xl border border-line p-3 text-center', earned ? 'bg-sun/20' : 'bg-cream text-ink/65')}>
            <span className="mx-auto mb-3 grid size-12 place-items-center rounded-2xl border border-line bg-card text-terracotta-dark"><AchievementIcon name={a.icon} /></span>
            <p className="mt-1 text-sm font-medium">{a.title}</p>
            <p className="text-xs opacity-75">{earned ? a.description : `Locked · ${a.description}`}</p>
          </li>
        )
      })}
    </ul>
  )
}
