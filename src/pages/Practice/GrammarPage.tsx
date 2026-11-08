import { useState } from 'react'
import { PageHeader } from '../../components/common/PageHeader'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { GrammarBiteCard } from '../../components/lessons/GrammarBiteCard'
import { grammarBites } from '../../data/grammar'

export default function GrammarPage() {
  const [search, setSearch] = useState('')
  const visible = grammarBites.filter((bite) =>
    `${bite.title} ${bite.summary}`.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()),
  )
  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/app/practice" className="mb-4 inline-flex items-center gap-1 text-sm opacity-70 hover:opacity-100">
        <ArrowLeft className="size-4" aria-hidden /> Practice Corner
      </Link>
      <PageHeader
        eyebrow="Practice Corner"
        title="Grammar bites"
        description={
          <>
            Small, optional explanations for the patterns you meet in lessons. No need to memorise — just peek when
            you’re curious.
          </>
        }
      />
      <label className="mb-5 block">
        <span className="mb-2 block text-sm font-medium">Find a grammar topic</span>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Try verbs, articles or comparisons…"
          className="w-full rounded-2xl border border-line bg-card px-4 py-3"
        />
      </label>
      <p role="status" className="mb-3 text-sm text-ink/70">
        {visible.length ? `${visible.length} ${visible.length === 1 ? 'topic' : 'topics'} to explore` : 'No matching topics. Try a shorter search.'}
      </p>
      <div className="space-y-4">
        {visible.map((bite) => (
          <GrammarBiteCard key={bite.id} bite={bite} />
        ))}
      </div>
    </div>
  )
}
