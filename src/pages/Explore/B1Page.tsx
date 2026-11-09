import { PageHeader } from '../../components/common/PageHeader'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge, Card } from '../../components/common'
import { b1Lessons } from '../../data/curriculum/b1'
import { useProgress } from '../../hooks/useProgress'

export default function B1Page() {
  const { progress } = useProgress()
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Link to="/app/practice" className="inline-flex items-center gap-1 text-sm opacity-70">
        <ArrowLeft className="size-4" aria-hidden /> Practice Corner
      </Link>
      <PageHeader eyebrow="B1 · Chapter 1" title="The road to B1" />
      <Badge tone="terracotta">Chapter 1 · Expressing yourself</Badge>
      <p className="opacity-80">
        Give opinions, make suggestions and talk about possibilities. Recommended after the A2 checkpoint; you can
        explore at your own pace. This first chapter is a starting point, not a complete B1 course or certificate.
      </p>
      <ol className="space-y-3">
        {b1Lessons.map((lesson, i) => (
          <li key={lesson.id}>
            <Link to={`/lesson/${lesson.id}`}>
              <Card className="flex flex-col items-start gap-3 hover:border-sage sm:flex-row sm:items-center">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-sage/25">
                  {progress.completedLessons[lesson.id] ? (
                    <CheckCircle2 className="size-5" aria-label="Completed" />
                  ) : (
                    i + 1
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-xl">{lesson.title}</h2>
                  <p className="text-sm opacity-75">{lesson.objective}</p>
                </div>
                <Badge>
                  {lesson.minutes} min · {lesson.xp} XP
                </Badge>
              </Card>
            </Link>
          </li>
        ))}
      </ol>
      <Link to="/app/practice/grammar" className="inline-block font-medium text-terracotta-dark underline">
        Read the B1 grammar bites →
      </Link>
    </div>
  )
}
