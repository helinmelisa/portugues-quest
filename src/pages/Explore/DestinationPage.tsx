import { ArrowLeft, CheckCircle2, Clock, Sparkles } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Badge, Card } from '../../components/common'
import { isLessonAvailable } from '../../data/curriculum'
import { destinations } from '../../data/destinations'
import { destinationLessons, isDestinationUnlocked } from '../../features/progress/destinationProgress'
import { followingDestination } from '../../features/progress/journey'
import { useProgress } from '../../hooks/useProgress'
import { cn } from '../../utils/cn'

export default function DestinationPage() {
  const { destinationId } = useParams()
  const { progress } = useProgress()
  const destination = destinations.find((d) => d.id === destinationId)

  if (!destination || !isDestinationUnlocked(destination, progress)) return <Navigate to="/app/explore" replace />

  const doneCount = destination.lessonIds.filter((id) => id in progress.completedLessons).length
  const finished = doneCount === destination.lessonIds.length
  const following = followingDestination(destination.id)

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/app/explore" className="mb-4 inline-flex items-center gap-1 text-sm opacity-70 hover:opacity-100">
        <ArrowLeft className="size-4" aria-hidden /> Back to map
      </Link>
      <h1 className="font-display text-3xl md:text-4xl">{destination.name}</h1>
      <p className="mb-6 mt-2 opacity-80">{destination.theme} · {destination.description}</p>

      <p className="mb-4 text-sm font-medium">{doneCount} of {destination.lessonIds.length} lessons complete</p>
      {finished && following && isDestinationUnlocked(following, progress) && (
        <Link to={`/app/explore/${following.id}`} className="mb-6 block rounded-3xl">
          <Card className="border-sage bg-sage/15">
            <Badge tone="sage">{destination.name} complete</Badge>
            <h2 className="mt-3 font-display text-2xl">Next stop: {following.name} →</h2>
            <p className="mt-2">{following.description}</p>
            <p className="mt-3 font-medium text-terracotta-dark">Explore {following.name}</p>
          </Card>
        </Link>
      )}
      <ol className="space-y-3">
        {destinationLessons(destination).map((lesson, i) => {
          const available = isLessonAvailable(lesson)
          const done = lesson.id in progress.completedLessons
          const content = (
            <Card className={cn('flex items-center gap-4 p-4 md:p-5', available ? 'hover:border-sage' : 'opacity-60')}>
              <span className={cn('grid size-10 shrink-0 place-items-center rounded-full font-display', done ? 'bg-sage/40' : 'bg-sun/40')}>
                {done ? <CheckCircle2 className="size-5" aria-label="Completed" /> : i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-medium">{lesson.title}</h2>
                <p className="text-sm opacity-75">{lesson.objective}</p>
              </div>
              {available ? (
                <div className="hidden gap-2 sm:flex">
                  <Badge tone="sky"><Clock className="size-3.5" aria-hidden /> {lesson.minutes} min</Badge>
                  <Badge tone="sun"><Sparkles className="size-3.5" aria-hidden /> {lesson.xp} XP</Badge>
                </div>
              ) : (
                <Badge>Coming soon</Badge>
              )}
            </Card>
          )
          return <li key={lesson.id}>{available ? <Link to={`/lesson/${lesson.id}`}>{content}</Link> : content}</li>
        })}
      </ol>
      {['lisboa', 'porto'].includes(destination.id) && (
        <Link to={`/lesson/${destination.id}-return`} className="mt-6 block rounded-3xl">
          <Card className="bg-sun/15 hover:border-sage"><Badge tone="terracotta">A2 · A second visit</Badge><h2 className="mt-3 font-display text-xl">Back to {destination.name}</h2><p className="mt-1 opacity-80">Tell the story of your last visit with past events, descriptions and comparisons. →</p></Card>
        </Link>
      )}
    </div>
  )
}
