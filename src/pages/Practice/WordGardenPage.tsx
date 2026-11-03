import { ArrowLeft, Sprout, Star } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, SpeakButton } from '../../components/common'
import { spoken, vocabularyFor } from '../../features/learning/practice'
import { useProgress } from '../../hooks/useProgress'
import { cn } from '../../utils/cn'

export default function WordGardenPage() {
  const { progress, toggleDifficult } = useProgress()
  const [onlyDifficult, setOnlyDifficult] = useState(false)
  const learned = vocabularyFor(progress).filter((v) => progress.learnedWords.includes(v.id))
  const words = onlyDifficult ? learned.filter((v) => progress.difficultWords.includes(v.id)) : learned

  return (
    <div className="mx-auto max-w-4xl">
      <Link to="/app/practice" className="mb-4 inline-flex items-center gap-1 text-sm opacity-70 hover:opacity-100">
        <ArrowLeft className="size-4" aria-hidden /> Practice Corner
      </Link>
      <h1 className="font-display text-3xl md:text-4xl">Word Garden</h1>
      <p className="mb-6 mt-2 opacity-80">Your growing collection of Portuguese words. Star the tricky ones to practise them more.</p>

      {learned.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 py-12 text-center">
          <Sprout className="size-10 text-sage" aria-hidden />
          <p className="max-w-sm opacity-80">Your garden is still empty. Finish a lesson and your first words will sprout here.</p>
          <Link to="/app/explore"><Button>Open the map</Button></Link>
        </Card>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Button size="sm" variant={onlyDifficult ? 'secondary' : 'primary'} onClick={() => setOnlyDifficult(false)}>All ({learned.length})</Button>
            <Button size="sm" variant={onlyDifficult ? 'primary' : 'secondary'} onClick={() => setOnlyDifficult(true)}>Tricky ({progress.difficultWords.length})</Button>
            {progress.difficultWords.length > 0 && (
              <Link to="/lesson/practice-difficult" className="ml-auto text-sm font-medium text-terracotta-dark hover:underline">Practise tricky words →</Link>
            )}
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {words.map((v) => {
              const difficult = progress.difficultWords.includes(v.id)
              return (
                <li key={v.id}>
                  <Card className="flex items-center gap-3 p-4 md:p-4">
                    <SpeakButton text={spoken(v)} />
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-lg">{v.pt}</p>
                      <p className="text-sm opacity-75">{v.en}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleDifficult(v.id)}
                      aria-pressed={difficult}
                      aria-label={difficult ? `Unmark ${v.pt} as tricky` : `Mark ${v.pt} as tricky`}
                      className="rounded-full p-2 hover:bg-line/60"
                    >
                      <Star className={cn('size-5', difficult ? 'fill-sun text-sun' : 'opacity-40')} aria-hidden />
                    </button>
                  </Card>
                </li>
              )
            })}
          </ul>
          {words.length === 0 && <p className="opacity-70">No tricky words yet — tap the star on any word to add it here.</p>}
          <p className="mt-6 text-sm opacity-60">Smart review reminders (spaced repetition) are planned for a future version.</p>
        </>
      )}
    </div>
  )
}
