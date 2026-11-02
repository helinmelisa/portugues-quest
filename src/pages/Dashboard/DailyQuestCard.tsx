import { CheckCircle2, Clock, Gauge, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Badge, Button } from '../../components/common'
import { getLesson } from '../../data/curriculum'
import type { DailyQuest } from '../../types'

export function DailyQuestCard({ quest, claimed }: { quest: DailyQuest; claimed: boolean }) {
  const navigate = useNavigate()
  const lesson = getLesson(quest.lessonId)
  if (!lesson) return null

  return (
    <section aria-labelledby="quest-title" className="relative overflow-hidden rounded-[2rem] bg-terracotta p-6 text-white shadow-soft md:p-8">
      <div aria-hidden className="absolute -right-10 -top-10 size-40 rounded-full bg-sun/40" />
      <div aria-hidden className="absolute -bottom-16 right-16 size-32 rounded-full bg-white/10" />
      <div className="relative">
        <p className="text-sm font-medium uppercase tracking-wide opacity-90">Daily quest</p>
        <h2 id="quest-title" className="mt-1 font-display text-3xl md:text-4xl">{quest.title}</h2>
        <p className="mt-2 max-w-md opacity-90">{quest.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge className="bg-white/20 text-white"><Clock className="size-3.5" aria-hidden /> {lesson.minutes} min</Badge>
          <Badge className="bg-white/20 text-white"><Gauge className="size-3.5" aria-hidden /> {quest.difficulty}</Badge>
          <Badge className="bg-white/20 text-white"><Sparkles className="size-3.5" aria-hidden /> {lesson.xp} + {quest.bonusXp} bonus XP</Badge>
          {lesson.skills.map((s) => <Badge key={s} className="bg-white/20 capitalize text-white">{s}</Badge>)}
        </div>
        {claimed ? (
          <p className="mt-6 flex items-center gap-2 font-medium"><CheckCircle2 className="size-5" aria-hidden /> Quest complete — até amanhã!</p>
        ) : (
          <Button variant="secondary" size="lg" className="mt-6" onClick={() => navigate(`/lesson/${lesson.id}`)}>Start quest</Button>
        )}
      </div>
    </section>
  )
}
