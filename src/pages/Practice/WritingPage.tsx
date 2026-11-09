import { PageHeader } from '../../components/common/PageHeader'
import { ArrowLeft, CheckCircle2, PenLine } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge, Card } from '../../components/common'
import { writingTasks } from '../../data/writing'
import { useProgress } from '../../hooks/useProgress'

export default function WritingPage() {
  const { progress } = useProgress()
  return (
    <div className="mx-auto max-w-4xl">
      <Link to="/app/practice" className="mb-4 inline-flex items-center gap-1 text-sm opacity-70">
        <ArrowLeft className="size-4" aria-hidden /> Practice Corner
      </Link>
      <PageHeader eyebrow="Practice Corner" title="Writing desk" />
      <p className="mb-6 mt-2 opacity-80">
        Useful messages for everyday Portugal. Write, compare with a model, and check your own work. Drafts stay with
        your account.
      </p>
      <ul className="grid gap-4 sm:grid-cols-2">
        {writingTasks.map((task) => (
          <li key={task.id}>
            <Link to={`/app/practice/writing/${task.id}`} className="block h-full">
              <Card className="h-full space-y-3 hover:border-sage">
                <div className="flex items-center justify-between">
                  <PenLine className="size-6 text-terracotta" aria-hidden />
                  {progress.completedLessons[`writing-${task.id}`] && (
                    <CheckCircle2 className="size-5 text-sage" aria-label="Completed" />
                  )}
                </div>
                <h2 className="font-display text-xl">{task.title}</h2>
                <p className="text-sm opacity-80">{task.situation}</p>
                <Badge>A2 · 6 min · +20 XP</Badge>
                {progress.writingDrafts[task.id]?.text && <p className="text-xs opacity-70">Draft saved</p>}
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
