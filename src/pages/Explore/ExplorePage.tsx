import { PageHeader } from '../../components/common/PageHeader'
import { Link } from 'react-router-dom'
import { Card, Badge } from '../../components/common'
import { useRef, useState } from 'react'
import { DestinationCard } from '../../components/map/DestinationCard'
import { PortugalMap } from '../../components/map/PortugalMap'
import { destinations } from '../../data/destinations'
import { useProgress } from '../../hooks/useProgress'
import { journey, nextJourneyStop } from '../../features/progress/journey'
import { destinationCompletion, isDestinationUnlocked } from '../../features/progress/destinationProgress'

export default function ExplorePage() {
  const { progress } = useProgress()
  const recommended = nextJourneyStop(progress)
  const [selectedId, setSelectedId] = useState<string>(() => recommended?.id ?? 'lisboa')
  const detailRef = useRef<HTMLDivElement>(null)
  const selectDestination = (id: string) => {
    setSelectedId(id)
    detailRef.current?.scrollIntoView({ behavior: 'instant', block: 'start' })
  }
  const selected = destinations.find((d) => d.id === selectedId) ?? destinations[0]

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        eyebrow="One place at a time"
        title="Explore Portugal"
        description={<>Your journey, one place at a time. Choose a stop to see its lessons.</>}
      />
      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] md:items-start">
        <div className="order-2 md:order-1">
          <PortugalMap destinations={destinations} selectedId={selectedId} onSelect={selectDestination} />
        </div>
        <div ref={detailRef} className="order-1 scroll-mt-4 md:order-2 md:sticky md:top-6">
          <DestinationCard destination={selected} />
        </div>
      </div>
      <section className="mt-6" aria-labelledby="journey-heading">
        <h2 id="journey-heading" className="mb-3 font-display text-2xl">
          Your route
        </h2>
        <ol className="grid gap-2 sm:grid-cols-2">
          {journey.map((destination, index) => {
            const completion = destinationCompletion(destination, progress)
            const unlocked = isDestinationUnlocked(destination, progress)
            return (
              <li key={destination.id}>
                <button
                  type="button"
                  aria-pressed={selectedId === destination.id}
                  onClick={() => selectDestination(destination.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition ${selectedId === destination.id ? 'border-sage bg-sage/15' : 'border-line bg-card hover:border-sage'}`}
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-cream text-sm">
                    {completion === 100 ? '✓' : index + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{destination.name}</span>
                    <span className="block text-sm opacity-75">
                      {completion === 100
                        ? 'Completed · revisit anytime'
                        : !unlocked
                          ? 'Locked · view how to unlock'
                          : `${completion}% complete`}
                    </span>
                  </span>
                  {recommended?.id === destination.id && <Badge tone="sage">Up next</Badge>}
                </button>
              </li>
            )
          })}
        </ol>
      </section>
      <Link to="/app/explore/vida" className="mt-6 block rounded-3xl">
        <Card className="bg-sun/15 hover:border-sage">
          <Badge tone="terracotta">A2 · A new chapter</Badge>
          <h2 className="mt-3 font-display text-2xl">Vida em Portugal</h2>
          <p className="mt-1 opacity-80">
            Papers, home, health, work and a second visit to Lisboa and Porto. Practise the Portuguese you need to feel
            at home. →
          </p>
        </Card>
      </Link>
    </div>
  )
}
