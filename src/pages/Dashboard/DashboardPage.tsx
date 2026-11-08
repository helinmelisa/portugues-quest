import { BookOpen, Flame, GraduationCap, Leaf, Lightbulb, RotateCcw, Sparkles, Sun } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Badge, Button, Card, ProgressBar } from '../../components/common'
import { AchievementList } from '../../components/gamification/AchievementList'
import { WeeklyChallengeCard } from '../../components/gamification/WeeklyChallengeCard'
import { WeeklyStreak } from '../../components/gamification/WeeklyStreak'
import { isLessonAvailable, lessons } from '../../data/curriculum'
import { destinations } from '../../data/destinations'
import { nextJourneyLesson } from '../../features/progress/journey'
import { isDestinationUnlocked } from '../../features/progress/destinationProgress'
import { vidaLessons } from '../../data/curriculum/vida'
import { questForDay } from '../../data/quests'
import { rankFor } from '../../features/progress/progress'
import { useProgress } from '../../hooks/useProgress'
import { dayKey } from '../../utils/date'
import { DailyQuestCard } from './DailyQuestCard'
import { noteForDay } from '../../data/ptNotes'
import { dueWordIds } from '../../features/vocabulary/srs'
import { a2CheckpointAvailable, checkpointAvailable } from '../../features/learning/practice'

function greeting() {
  const h = new Date().getHours()
  if (h < 13) return 'Bom dia'
  if (h < 20) return 'Boa tarde'
  return 'Boa noite'
}

export default function DashboardPage() {
  const { progress, stats, profile } = useProgress()
  const goal = profile.dailyGoalMinutes
  const navigate = useNavigate()
  const today = dayKey()
  const quest = questForDay(today)
  const dueCount = dueWordIds(progress, today).length
  const tip = noteForDay(today)
  const { next } = rankFor(stats.totalXp)
  const minutesToday = progress.minutesByDay[today] ?? 0

  const a0Lessons = lessons.filter((l) => ['lisboa', 'porto'].includes(l.destinationId) && l.level !== 'A2')
  const a0Done = a0Lessons.filter((l) => l.id in progress.completedLessons).length
  const nextLesson = lessons.find((l) => isLessonAvailable(l) && !(l.id in progress.completedLessons) && (l.destinationId === 'vida' || destinations.some((d) => d.id === l.destinationId && isDestinationUnlocked(d, progress))))
  const nextJourney = nextJourneyLesson(progress)
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
        <Sun className="mb-3 size-8 text-terracotta-dark" strokeWidth={1.5} aria-hidden /><h1 className="font-display text-3xl md:text-4xl">{greeting()}, explorer</h1>
        <p className="mt-2 opacity-80">Ready to make a little Portuguese progress today?</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge tone="terracotta">{stats.rank}</Badge>
          <Badge tone="sky">Level {profile.level}</Badge>
        </div>
      </header>

      <Card className="border-sage/60 bg-sage/10 p-5 md:p-7">
        <p className="text-sm font-medium text-terracotta-dark">Your next adventure</p>
        <h2 className="mt-2 font-display text-3xl">{nextJourney?.destination.name ?? 'Keep exploring'}</h2>
        <p className="mt-2 opacity-80">{nextJourney?.lesson.title ?? nextLesson?.title ?? 'Every available lesson complete. Revisit your favourite places or practise your words.'}</p>
        {(nextJourney?.lesson ?? nextLesson) && <Button className="mt-5 w-full sm:w-auto" onClick={() => navigate(`/lesson/${(nextJourney?.lesson ?? nextLesson)!.id}`)}>Continue learning →</Button>}
        <Link to="/app/explore" className="mt-3 flex min-h-11 items-center text-sm font-medium text-terracotta-dark hover:underline">See your journey →</Link>
        {lastDone && <p className="mt-1 text-sm opacity-70">Last completed: {lastDone.title}</p>}
      </Card>

      <DailyQuestCard quest={quest} claimed={progress.questDays.includes(today)} />

      {progress.learnedWords.length > 0 && (
        <Card className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <RotateCcw className="size-6 text-sky" aria-hidden />
            <div>
              <h2 className="font-display text-xl">{dueCount ? `${dueCount} words to review` : 'Reviews done for today'}</h2>
              <p className="text-sm opacity-75">{dueCount ? 'A quick review keeps words from slipping away.' : 'Your words are fresh. Volta amanhã!'}</p>
            </div>
          </div>
          {dueCount > 0 && <Button onClick={() => navigate('/lesson/practice-review')}>Review now</Button>}
        </Card>
      )}

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


        <Card className="space-y-4">
          <div>
            <div className="mb-1.5 flex justify-between"><h2 className="font-display text-xl">Daily goal</h2><span className="text-sm">{Math.min(minutesToday, goal)}/{goal} min</span></div>
            <ProgressBar value={minutesToday} max={goal} label="Daily goal" color="sage" />
          </div>
          <div>
            <div className="mb-1.5 flex justify-between"><h2 className="font-display text-xl">Road to A1</h2><span className="text-sm">{a0Done}/{a0Lessons.length} lessons</span></div>
            <ProgressBar value={a0Done} max={a0Lessons.length} label="Progress to A1" />
          </div>
          <div>
            <h2 className="mb-1.5 font-display text-xl">Life in Portugal · A2</h2>
            <ProgressBar value={vidaLessons.filter((l) => l.id in progress.completedLessons).length} max={vidaLessons.length} label="Vida em Portugal progress" color="sage" />
            <Link to="/app/explore/vida" className="mt-2 inline-block text-sm font-medium text-terracotta-dark hover:underline">Continue your A2 chapter →</Link>
          </div>
          {progress.certificates.A2 ? <Link to="/app/certificate/A2" className="block rounded-2xl bg-sky/20 p-3 font-medium"><GraduationCap className="mb-2 size-6 text-terracotta-dark" aria-hidden />A2 Explorer — view your certificate</Link>
            : a2CheckpointAvailable(progress) ? <Link to="/lesson/checkpoint-A2" className="block rounded-2xl bg-sun/30 p-3 font-medium"><GraduationCap className="mb-2 size-6 text-terracotta-dark" aria-hidden />Take the A2 checkpoint (16 questions) →</Link> : null}
          {next && <p className="text-sm opacity-70">{next.minXp - stats.totalXp} XP until {next.name}</p>}
          {progress.certificates.A1 ? (
            <Link to="/app/certificate/A1" className="block rounded-2xl bg-sky/20 p-3 font-medium hover:bg-sky/30"><GraduationCap className="mb-2 size-6 text-terracotta-dark" aria-hidden />A1 Explorer — view your certificate</Link>
          ) : checkpointAvailable(progress) ? (
            <Link to="/lesson/checkpoint-A1" className="block rounded-2xl bg-sun/30 p-3 font-medium hover:bg-sun/40"><GraduationCap className="mb-2 size-6 text-terracotta-dark" aria-hidden />Ready? Take the A1 checkpoint (12 questions) →</Link>
          ) : null}
        </Card>
      </div>

      <Card className="space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 className="font-display text-xl">This week</h2>
          <p className="text-sm opacity-70">Missed a day? No problem — just pick up where you left off.</p>
        </div>
        <WeeklyStreak activeDays={progress.activeDays} />
        <WeeklyChallengeCard progress={progress} />
      </Card>

      <Card className="flex gap-3 bg-sun/15">
        <Lightbulb className="mt-1 size-5 shrink-0 text-terracotta" aria-hidden />
        <div>
          <h2 className="font-display text-lg">In Portugal, we say…</h2>
          <p className="mt-1">
            <strong>{tip.pt}</strong> ({tip.en}) — not <span className="opacity-70">{tip.br}</span>.
            {tip.note && <span className="opacity-80"> {tip.note}</span>}
          </p>
          <Link to="/app/practice/portugal-vs-brazil" className="mt-1 inline-block text-sm font-medium text-terracotta-dark hover:underline">See all differences →</Link>
        </div>
      </Card>

      <Card className="space-y-3">
        <h2 className="font-display text-xl">Achievements</h2>
        <AchievementList unlocked={progress.achievements} />
      </Card>

    </div>
  )
}
