import { Lock, MapPin } from 'lucide-react'
import type { Destination } from '../../types'
import { cn } from '../../utils/cn'

// Stylised, not geographically exact. Coordinates are percentages of the map box.
const MAINLAND = '22,3 32,2 40,5 48,4 46,14 50,22 44,30 46,40 42,48 46,56 44,64 48,72 46,82 50,90 42,94 30,93 20,95 18,86 20,78 14,72 16,66 10,60 14,52 18,42 22,30 20,18 22,10'

interface Props {
  destinations: Destination[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function PortugalMap({ destinations, selectedId, onSelect }: Props) {
  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-line bg-sky/25">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden>
        <path d="M0 30 Q4 28 8 30 T16 30 M0 70 Q4 68 8 70 T16 70" stroke="#FFFEFA" strokeWidth="0.6" fill="none" opacity="0.8" />
        <polygon points={MAINLAND} fill="#F8F6EF" stroke="#A9B79A" strokeWidth="0.8" strokeLinejoin="round" />
        <polygon points={MAINLAND} fill="#A9B79A" opacity="0.15" transform="translate(1 1)" />
        <rect x="64" y="72" width="32" height="24" rx="3" fill="none" stroke="#FFFEFA" strokeDasharray="1.5 1.5" strokeWidth="0.5" />
        <ellipse cx="80" cy="86" rx="8" ry="3.5" fill="#F8F6EF" stroke="#A9B79A" strokeWidth="0.8" />
      </svg>

      {destinations.map((d) => {
        const selected = d.id === selectedId
        return (
          <button
            key={d.id}
            type="button"
            onClick={() => onSelect(d.id)}
            aria-pressed={selected}
            aria-label={`${d.name}${d.unlocked ? '' : ' (locked)'}`}
            style={{ left: `${d.map.x}%`, top: `${d.map.y}%` }}
            className="group absolute -translate-x-1/2 -translate-y-full"
          >
            <span className="flex flex-col items-center">
              <span
                className={cn(
                  'mb-1 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium shadow-soft transition',
                  selected ? 'bg-ink text-cream' : 'bg-card',
                  !d.unlocked && 'opacity-70',
                )}
              >
                {d.name}
              </span>
              <span
                className={cn(
                  'grid size-9 place-items-center rounded-full border-2 border-card shadow-soft transition group-hover:scale-110',
                  d.unlocked ? 'bg-terracotta text-white' : 'bg-line text-ink/60',
                  selected && 'scale-110 ring-4 ring-sun',
                )}
              >
                {d.unlocked ? <MapPin className="size-4" aria-hidden /> : <Lock className="size-3.5" aria-hidden />}
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
