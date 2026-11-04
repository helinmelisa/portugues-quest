import { Link } from 'react-router-dom'
import { Card, Badge } from '../../components/common'
import { useState } from 'react'
import { DestinationCard } from '../../components/map/DestinationCard'
import { PortugalMap } from '../../components/map/PortugalMap'
import { destinations } from '../../data/destinations'

export default function ExplorePage() {
  const [selectedId, setSelectedId] = useState<string>('lisboa')
  const selected = destinations.find((d) => d.id === selectedId) ?? destinations[0]

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-display text-3xl md:text-4xl">Explore Portugal</h1>
      <p className="mb-6 mt-2 opacity-80">Pick a destination and start your next little adventure.</p>
      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] md:items-start">
        <PortugalMap destinations={destinations} selectedId={selectedId} onSelect={setSelectedId} />
        <div className="md:sticky md:top-6">
          <DestinationCard destination={selected} />
        </div>
      </div>
      <Link to="/app/explore/vida" className="mt-6 block rounded-3xl">
        <Card className="bg-sun/15 hover:border-sage">
          <Badge tone="terracotta">A2 · A new chapter</Badge>
          <h2 className="mt-3 font-display text-2xl">Vida em Portugal</h2>
          <p className="mt-1 opacity-80">Papers, home, health, work and a second visit to Lisboa and Porto. Practise the Portuguese you need to feel at home. →</p>
        </Card>
      </Link>
    </div>
  )
}
