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
    </div>
  )
}
