import { Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { destinationCompletion } from '../../features/progress/destinationProgress'
import { useProgress } from '../../hooks/useProgress'
import type { Destination } from '../../types'
import { Badge, Button, Card, ProgressBar } from '../common'

export function DestinationCard({ destination }: { destination: Destination }) {
  const navigate = useNavigate()
  const { progress } = useProgress()
  const completion = destinationCompletion(destination, progress)

  return (
    <Card className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="terracotta">{destination.level}</Badge>
        <Badge tone="sage">{destination.theme}</Badge>
      </div>
      <div>
        <h2 className="font-display text-3xl">{destination.name}</h2>
        <p className="mt-2 opacity-80">{destination.description}</p>
      </div>
      {destination.unlocked ? (
        <>
          <div>
            <div className="mb-1.5 flex justify-between text-sm"><span>Progress</span><span>{completion}%</span></div>
            <ProgressBar value={completion} label={`${destination.name} progress`} />
          </div>
          <Button className="w-full" onClick={() => navigate(`/app/explore/${destination.id}`)}>Explore {destination.name}</Button>
        </>
      ) : (
        <p className="flex items-center gap-2 rounded-2xl bg-line/60 p-3 text-sm">
          <Lock className="size-4 shrink-0" aria-hidden /> This destination is still being prepared. Keep exploring to unlock it!
        </p>
      )}
    </Card>
  )
}
