import { PageHeader } from '../../components/common/PageHeader'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge, Card } from '../../components/common'
import { getLesson } from '../../data/curriculum'
import { vidaTopics } from '../../data/vida'
import { useProgress } from '../../hooks/useProgress'

export default function VidaPage() {
  const { progress } = useProgress()

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <Link to="/app/explore" className="mb-4 inline-flex items-center gap-1 text-sm opacity-70 hover:opacity-100">
          <ArrowLeft className="size-4" aria-hidden /> Explore Portugal
        </Link>
        <PageHeader
          eyebrow="Explore Portugal"
          title="Vida em Portugal"
          description={<>Feel more at home: paperwork, housing, health and work, one conversation at a time.</>}
        />
        <Badge tone="terracotta" className="mt-3">
          A2 · Everyday life
        </Badge>
      </header>
      {vidaTopics.map((topic) => (
        <section key={topic.id} aria-labelledby={topic.id}>
          <h2 id={topic.id} className="font-display text-2xl">
            {topic.title}
          </h2>
          <p className="mb-3 mt-1 text-sm opacity-75">{topic.description}</p>
          <ul className="space-y-3">
            {topic.lessonIds.map((id) => {
              const lesson = getLesson(id)!
              return (
                <li key={id}>
                  <Link to={`/lesson/${id}`}>
                    <Card className="flex flex-col items-start gap-3 p-4 hover:border-sage sm:flex-row sm:items-center">
                      <div className="flex min-w-0 flex-1 items-start gap-3">
                        {id in progress.completedLessons && (
                          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-sage" aria-label="Completed" />
                        )}
                        <div className="min-w-0">
                          <h3 className="font-medium">{lesson.title}</h3>
                          <p className="text-sm opacity-75">{lesson.objective}</p>
                        </div>
                      </div>
                      <Badge>
                        {lesson.minutes} min · {lesson.xp} XP
                      </Badge>
                    </Card>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
      <Link to="/app/practice/texts" className="block font-medium text-terracotta-dark hover:underline">
        Read real-life texts →
      </Link>
    </div>
  )
}
