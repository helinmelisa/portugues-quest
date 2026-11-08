import { Trophy } from 'lucide-react'
import { WEEKLY_BONUS_XP, weeklyStatus } from '../../features/progress/weekly'
import type { LearningProgress } from '../../types'
import { Badge, ProgressBar } from '../common'

export function WeeklyChallengeCard({ progress }: { progress: LearningProgress }) {
  const { challenge, goals, claimed } = weeklyStatus(progress)

  return (
    <div className="space-y-3 rounded-2xl bg-sky/15 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 font-medium">
          <Trophy className="size-4 text-sun" aria-hidden /> Weekly challenge: {challenge.title}
        </h3>
        <Badge tone={claimed ? 'sage' : 'sun'}>{claimed ? 'Complete!' : `+${WEEKLY_BONUS_XP} XP`}</Badge>
      </div>
      <p className="text-sm opacity-75">{challenge.description}</p>
      {goals.map((g) => (
        <div key={g.kind}>
          <div className="mb-1 flex justify-between text-sm"><span>{g.label}</span><span>{g.current}/{g.target}</span></div>
          <ProgressBar value={g.current} max={g.target} label={g.label} color="sky" />
        </div>
      ))}
    </div>
  )
}
