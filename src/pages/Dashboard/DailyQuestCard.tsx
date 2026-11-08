import { CheckCircle2, Clock, Gauge, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Badge, Button } from '../../components/common'
import { getLesson } from '../../data/curriculum'
import { CONVERSATION_XP } from '../../features/progress/progress'
import type { DailyQuest } from '../../types'

export function DailyQuestCard({ quest, claimed }: { quest: DailyQuest; claimed: boolean }) {
  const navigate = useNavigate()
  const lesson = quest.lessonId ? getLesson(quest.lessonId) : undefined
  const minutes = lesson?.minutes ?? 5
  const xp = lesson?.xp ?? CONVERSATION_XP
  const skills = lesson?.skills ?? ['speaking']
  const target = lesson ? `/lesson/${lesson.id}` : `/app/tutor?scenario=${quest.scenarioId ?? 'coffee'}`
  const chip = 'bg-card text-ink'

  return (
    <section aria-labelledby="quest-title" className="relative overflow-hidden rounded-[2rem] bg-sky/20 p-6 text-ink shadow-soft md:p-8">
      <div aria-hidden className="absolute -right-10 -top-10 size-40 rounded-full bg-sun/40" />
      <div aria-hidden className="absolute -bottom-16 right-16 size-32 rounded-full bg-white/10" />
      <div className="relative">
        <p className="text-sm font-medium uppercase tracking-wide opacity-80">Daily quest</p>
        <h2 id="quest-title" className="mt-1 font-display text-2xl md:text-3xl">{quest.title}</h2>
        <p className="mt-2 max-w-md opacity-80">{quest.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge className={chip}><Clock className="size-3.5" aria-hidden /> {minutes} min</Badge>
          <Badge className={chip}><Gauge className="size-3.5" aria-hidden /> {quest.difficulty}</Badge>
          <Badge className={chip}><Sparkles className="size-3.5" aria-hidden /> {xp} + {quest.bonusXp} bonus XP</Badge>
          {skills.map((s) => <Badge key={s} className={`${chip} capitalize`}>{s}</Badge>)}
        </div>
        {claimed ? (
          <p className="mt-6 flex items-center gap-2 font-medium"><CheckCircle2 className="size-5" aria-hidden /> Quest complete — até amanhã!</p>
        ) : (
          <Button variant="secondary" size="lg" className="mt-6" onClick={() => navigate(target)}>Start quest</Button>
        )}
      </div>
    </section>
  )
}
