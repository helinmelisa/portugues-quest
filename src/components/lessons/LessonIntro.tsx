import { Clock, Sparkles } from 'lucide-react'
import type { Lesson } from '../../types'
import { Badge, Button, Card } from '../common'

export function LessonIntro({ lesson, onStart }: { lesson: Lesson; onStart: () => void }) {
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
              <p className="font-display text-xl">{v.pt}</p>
              <p className="opacity-80">{v.en}</p>
              {v.pronunciation && <p className="mt-1 text-sm italic opacity-60">/{v.pronunciation}/</p>}
              {v.context && <p className="mt-2 text-sm">{v.context}</p>}
            </Card>
          ))}
        </div>
      </section>

      <Button size="lg" onClick={onStart} className="w-full sm:w-auto">Let’s practise</Button>
    </div>
  )
}
