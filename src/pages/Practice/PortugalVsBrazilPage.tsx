import { PageHeader } from '../../components/common/PageHeader'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, SpeakButton } from '../../components/common'
import { ptNotes } from '../../data/ptNotes'

export default function PortugalVsBrazilPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <Link to="/app/practice" className="mb-4 inline-flex items-center gap-1 text-sm opacity-70 hover:opacity-100">
        <ArrowLeft className="size-4" aria-hidden /> Practice Corner
      </Link>
      <PageHeader
        eyebrow="Practice Corner"
        title="In Portugal, we say…"
        description={
          <>
            Brazilian Portuguese is everywhere online. Here’s what you’ll actually hear in Portugal. Brazilians and
            Portuguese understand each other, but these words give you away!
          </>
        }
      />
      <ul className="grid gap-3 sm:grid-cols-2">
        {ptNotes.map((n) => (
          <li key={n.id}>
            <Card className="h-full p-4 md:p-5">
              <p className="text-sm opacity-70">{n.en}</p>
              <div className="mt-1 flex items-center gap-2">
                <p className="font-display text-xl"><span className="mb-1 block font-sans text-xs font-bold uppercase tracking-wider text-terracotta-dark">Portugal</span>{n.pt}</p>
                <SpeakButton text={n.pt.split(' / ')[0]} className="size-8" />
              </div>
              <p className="mt-1 text-sm opacity-60 line-through decoration-terracotta/60"><span className="mr-1 no-underline">Brazil:</span> {n.br}</p>
              {n.note && <p className="mt-2 text-sm">{n.note}</p>}
            </Card>
          </li>
        ))}
      </ul>
    </div>
  )
}
