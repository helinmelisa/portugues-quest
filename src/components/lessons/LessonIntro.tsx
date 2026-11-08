import { Clock, Sparkles } from 'lucide-react'
import type { Lesson } from '../../types'
import { getGrammarBite } from '../../data/grammar'
import { Badge, Card, SpeakButton } from '../common'
import { GrammarBiteCard } from './GrammarBiteCard'

export function LessonIntro({ lesson }: { lesson: Lesson }) {
  return (
    <div className="space-y-6">
      <div>
        <div className="mb-3 flex flex-wrap gap-2">
          <Badge tone="sky"><Clock className="size-3.5" aria-hidden /> {lesson.minutes} min</Badge>
          <Badge tone="sun"><Sparkles className="size-3.5" aria-hidden /> {lesson.xp} XP</Badge>
        </div>
        <h1 className="font-display text-3xl md:text-4xl">{lesson.title}</h1>
        <p className="mt-3 text-lg opacity-80">{lesson.intro}</p>
        <p className="mt-2 font-medium">Goal: {lesson.objective}</p>
      </div>

      <section aria-labelledby="vocab-title">
        <h2 id="vocab-title" className="mb-3 font-display text-xl">New words</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {lesson.vocabulary.map((v) => (
            <Card key={v.id} className="p-4 md:p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="min-w-0 flex-1 font-display text-xl">{v.pt}</p>
                <SpeakButton text={v.pt.split(' / ')[0]} />
              </div>
              <p className="opacity-80">{v.en}</p>
              {v.pronunciation && <p className="mt-1 text-sm italic opacity-60">/{v.pronunciation}/</p>}
              {v.context && <p className="mt-2 text-sm">{v.context}</p>}
              {v.example && (
                <p className="mt-2 flex items-center gap-2 text-sm">
                  <SpeakButton text={v.example.pt} className="size-7" />
                  <span className="min-w-0 flex-1"><span className="font-medium">{v.example.pt}</span> <span className="opacity-70">— {v.example.en}</span></span>
                </p>
              )}
            </Card>
          ))}
        </div>
      </section>

      {lesson.grammarId && getGrammarBite(lesson.grammarId) && (
        <section aria-label="Grammar bite">
          <GrammarBiteCard bite={getGrammarBite(lesson.grammarId)!} />
        </section>
      )}


    </div>
  )
}
