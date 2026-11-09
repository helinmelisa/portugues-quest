import { PageHeader } from '../../components/common/PageHeader'
import { ArrowLeft, CheckCircle2, Headphones } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge, Card } from '../../components/common'
import { dialogues } from '../../data/dialogues'
import { useProgress } from '../../hooks/useProgress'

export default function DialoguesPage() {
  const { progress } = useProgress()
  return (
    <div className="mx-auto max-w-4xl">
      <Link to="/app/practice" className="mb-4 inline-flex items-center gap-1 text-sm opacity-70">
        <ArrowLeft className="size-4" aria-hidden /> Practice Corner
      </Link>
      <PageHeader eyebrow="Practice Corner" title="Conversations to listen to" />
      <p className="mb-6 mt-2 opacity-80">
        Longer A2 dialogues about everyday life. Listen first, reveal the transcript when you need it, then try three
        questions.
      </p>
      <ul className="grid gap-4 sm:grid-cols-2">
        {dialogues.map((dialogue) => (
          <li key={dialogue.id}>
            <Link to={`/app/practice/dialogues/${dialogue.id}`} className="block h-full">
              <Card className="h-full space-y-3 hover:border-sage">
                <div className="flex items-center justify-between">
                  <Headphones className="size-6 text-sky" aria-hidden />
                  {progress.completedLessons[`dialogue-${dialogue.id}`] && (
                    <CheckCircle2 className="size-5 text-sage" aria-label="Completed" />
                  )}
                </div>
                <h2 className="font-display text-xl">{dialogue.title}</h2>
                <p className="text-sm opacity-80">{dialogue.objective}</p>
                <Badge>A2 · 8 turns · +20 XP</Badge>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-sm opacity-70">
        Audio uses your device’s Portuguese voice. Native-speaker recordings remain planned.
      </p>
    </div>
  )
}
