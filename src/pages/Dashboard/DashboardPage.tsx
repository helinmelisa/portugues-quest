import { BookOpen, Flame, Leaf, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge, Card, ProgressBar } from '../../components/common'
import { WeeklyStreak } from '../../components/gamification/WeeklyStreak'
import { isLessonAvailable, lessons } from '../../data/curriculum'
import { questForDay } from '../../data/quests'
import { rankFor } from '../../features/progress/progress'
import { useProgress } from '../../hooks/useProgress'
import { dayKey } from '../../utils/date'
import { DailyQuestCard } from './DailyQuestCard'

const DAILY_GOAL_MINUTES = 10 // replaced by the onboarding choice in step 11

function greeting() {
  const h = new Date().getHours()
  if (h < 13) return 'Bom dia'
  if (h < 20) return 'Boa tarde'
  return 'Boa noite'
}

export default function DashboardPage() {
  const { progress, stats } = useProgress()
  const today = dayKey()
  const quest = questForDay(today)
  const { next } = rankFor(stats.totalXp)
  const minutesToday = progress.minutesByDay[today] ?? 0

  const a0Lessons = lessons.filter((l) => ['lisboa', 'porto'].includes(l.destinationId))
  const a0Done = a0Lessons.filter((l) => l.id in progress.completedLessons).length
  const nextLesson = lessons.find((l) => isLessonAvailable(l) && !(l.id in progress.completedLessons))
  const lastDoneId = Object.entries(progress.completedLessons).sort(([, a], [, b]) => b.localeCompare(a))[0]?.[0]
  const lastDone = lessons.find((l) => l.id === lastDoneId)

  const statItems = [
    { icon: Sparkles, label: 'Total XP', value: stats.totalXp, tone: 'text-sun' },
    { icon: Flame, label: 'Day streak', value: stats.streak, tone: 'text-terracotta' },
    { icon: BookOpen, label: 'Lessons', value: stats.lessonsCompleted, tone: 'text-sky' },
    { icon: Leaf, label: 'Words', value: stats.wordsLearned, tone: 'text-sage' },
  ]

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="font-display text-3xl md:text-4xl">{greeting()}, explorer ☀️</h1>
        <p className="mt-2 opacity-80">Ready to make a little Portuguese progress today?</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge tone="terracotta">{stats.rank}</Badge>
          <Badge tone="sky">Level A0</Badge>
        </div>
      </header>

      <DailyQuestCard quest={quest} claimed={progress.questDays.includes(today)} />

      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {statItems.map(({ icon: Icon, label, value, tone }) => (
          <li key={label}>
            <Card className="p-4 md:p-5">
              <Icon className={`size-5 ${tone}`} aria-hidden />
              <p className="mt-2 font-display text-3xl">{value}</p>
              <p className="text-sm opacity-75">{label}</p>
            </Card>
          </li>
        ))}
      </ul>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-3">
          <h2 className="font-display text-xl">Continue learning</h2>
          {nextLesson ? (
            <Link to={`/lesson/${nextLesson.id}`} className="block rounded-2xl border border-line p-4 hover:border-sage">
              <p className="text-sm opacity-70">Up next</p>
              <p className="font-medium">{nextLesson.title}</p>
            </Link>
          ) : (
            <p className="opacity-80">You’ve finished every available lesson. New ones are on the way!</p>
          )}
          {lastDone && <p className="text-sm opacity-70">Last completed: {lastDone.title}</p>}
          <Link to="/app/explore" className="inline-block text-sm font-medium text-terracotta-dark hover:underline">Open the map →</Link>
        </Card>

        <Card className="space-y-4">
          <div>
            <div className="mb-1.5 flex justify-between"><h2 className="font-display text-xl">Daily goal</h2><span className="text-sm">{Math.min(minutesToday, DAILY_GOAL_MINUTES)}/{DAILY_GOAL_MINUTES} min</span></div>
            <ProgressBar value={minutesToday} max={DAILY_GOAL_MINUTES} label="Daily goal" color="sage" />
          </div>
          <div>
            <div className="mb-1.5 flex justify-between"><h2 className="font-display text-xl">Road to A1</h2><span className="text-sm">{a0Done}/{a0Lessons.length} lessons</span></div>
            <ProgressBar value={a0Done} max={a0Lessons.length} label="Progress to A1" />
          </div>
          {next && <p className="text-sm opacity-70">{next.minXp - stats.totalXp} XP until {next.name}</p>}
        </Card>
      </div>

      <Card className="space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 className="font-display text-xl">This week</h2>
          <p className="text-sm opacity-70">Missed a day? No problem — just pick up where you left off.</p>
        </div>
        <WeeklyStreak activeDays={progress.activeDays} />
      </Card>
    </div>
  )
}
