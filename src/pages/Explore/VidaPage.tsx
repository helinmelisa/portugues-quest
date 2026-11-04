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
        <Link to="/app/explore" className="mb-4 inline-flex items-center gap-1 text-sm opacity-70 hover:opacity-100"><ArrowLeft className="size-4" aria-hidden /> Explore Portugal</Link>
        <h1 className="font-display text-3xl md:text-4xl">Vida em Portugal</h1>
        <p className="mt-2 opacity-80">Feel more at home: paperwork, housing, health and work, one conversation at a time.</p>
        <Badge tone="terracotta" className="mt-3">A2 · Everyday life</Badge>
      </header>
      {vidaTopics.map((topic) => (
        <section key={topic.id} aria-labelledby={topic.id}>
          <h2 id={topic.id} className="font-display text-2xl">{topic.title}</h2>
          <p className="mb-3 mt-1 text-sm opacity-75">{topic.description}</p>
          <ul className="space-y-3">
            {topic.lessonIds.map((id) => {
              const lesson = getLesson(id)!
              return (
                <li key={id}>
                  <Link to={`/lesson/${id}`}>
                    <Card className="flex items-center gap-3 p-4 hover:border-sage">
                      {id in progress.completedLessons && <CheckCircle2 className="size-5 shrink-0 text-sage" aria-label="Completed" />}
                      <div className="flex-1"><h3 className="font-medium">{lesson.title}</h3><p className="text-sm opacity-75">{lesson.objective}</p></div>
                      <Badge>{lesson.minutes} min · {lesson.xp} XP</Badge>
                    </Card>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
