import { ArrowLeft, CheckCircle2, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge, Card } from '../../components/common'
import { destinations } from '../../data/destinations'
import { stories } from '../../data/stories'
import { isDestinationUnlocked } from '../../features/progress/destinationProgress'
import { useProgress } from '../../hooks/useProgress'

export default function StoriesPage() {
  const { progress } = useProgress()

  return (
    <div className="mx-auto max-w-4xl">
      <Link to="/app/practice" className="mb-4 inline-flex items-center gap-1 text-sm opacity-70 hover:opacity-100">
        <ArrowLeft className="size-4" aria-hidden /> Practice Corner
      </Link>
      <h1 className="font-display text-3xl md:text-4xl">Histórias</h1>
      <p className="mb-6 mt-2 opacity-80">Little stories from around Portugal. Listen, tap any underlined word for its meaning, then answer three questions.</p>
      <ul className="grid gap-4 sm:grid-cols-2">
        {stories.map((s) => {
          const destination = destinations.find((d) => d.id === s.destinationId)!
          const unlocked = isDestinationUnlocked(destination, progress)
          const read = progress.storiesRead.includes(`story-${s.id}`)
          const card = (
            <Card className={unlocked ? 'h-full transition hover:-translate-y-0.5 hover:border-sage' : 'h-full opacity-60'}>
              <div className="flex items-center justify-between gap-2">
                <Badge tone="sage">{destination.name}</Badge>
                {read ? <CheckCircle2 className="size-5 text-sage" aria-label="Read" /> : !unlocked && <Lock className="size-4" aria-label="Locked" />}
              </div>
              <h2 className="mt-3 font-display text-xl">{s.title}</h2>
              <p className="mt-1 text-sm opacity-75">{s.sentences[0].en}</p>
              <Badge tone="terracotta" className="mt-3">{s.level}</Badge>
            </Card>
          )
          return <li key={s.id}>{unlocked ? <Link to={`/app/practice/stories/${s.id}`} className="block h-full rounded-3xl">{card}</Link> : card}</li>
        })}
      </ul>
    </div>
  )
}
