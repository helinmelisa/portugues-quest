import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { GrammarBiteCard } from '../../components/lessons/GrammarBiteCard'
import { grammarBites } from '../../data/grammar'

export default function GrammarPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/app/practice" className="mb-4 inline-flex items-center gap-1 text-sm opacity-70 hover:opacity-100">
        <ArrowLeft className="size-4" aria-hidden /> Practice Corner
      </Link>
      <h1 className="font-display text-3xl md:text-4xl">Grammar bites</h1>
      <p className="mb-6 mt-2 opacity-80">Small, optional explanations for the patterns you meet in lessons. No need to memorise — just peek when you’re curious.</p>
      <div className="space-y-4">
        {grammarBites.map((bite) => <GrammarBiteCard key={bite.id} bite={bite} />)}
      </div>
    </div>
  )
}
