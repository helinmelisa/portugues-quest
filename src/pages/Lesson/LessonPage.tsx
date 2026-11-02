import { X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, ProgressBar } from '../../components/common'
import { FeedbackPanel } from '../../components/lessons/FeedbackPanel'
import { LessonComplete } from '../../components/lessons/LessonComplete'
import { LessonIntro } from '../../components/lessons/LessonIntro'
import { MultipleChoice } from '../../components/lessons/MultipleChoice'
import { getLesson, isLessonAvailable } from '../../data/curriculum'
import { useProgress } from '../../hooks/useProgress'
import type { Exercise } from '../../types'

type Stage = 'intro' | 'exercises' | 'complete'

export default function LessonPage() {
  const { lessonId = '' } = useParams()
  const navigate = useNavigate()
  const { completeLesson } = useProgress()
  const lesson = getLesson(lessonId)

  const [stage, setStage] = useState<Stage>('intro')
  const [queue, setQueue] = useState<Exercise[]>(lesson?.exercises ?? [])
  const [missed, setMissed] = useState(new Set<string>())
  const [selected, setSelected] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [xpEarned, setXpEarned] = useState(0)

  const exit = () => navigate(-1)

  if (!lesson || !isLessonAvailable(lesson)) {
    return (
      <main className="grid min-h-screen place-items-center p-6 text-center">
        <div>
          <h1 className="font-display text-3xl">This lesson is still being written</h1>
          <p className="mt-2 opacity-80">Check back soon — boa sorte!</p>
          <Button className="mt-6" onClick={exit}>Go back</Button>
        </div>
      </main>
    )
  }

  const total = lesson.exercises.length
  const done = total - new Set(queue.map((e) => e.id)).size
  const current = queue[0]
  const correct = checked && current?.type === 'multiple-choice' && selected === current.answer

  const check = () => {
    setChecked(true)
    if (selected !== current.answer) setMissed((m) => new Set(m).add(current.id))
  }

  const next = () => {
    const rest = correct ? queue.slice(1) : [...queue.slice(1), current]
    setSelected(null)
    setChecked(false)
    if (rest.length === 0) {
      setXpEarned(completeLesson(lesson))
      setStage('complete')
    }
    setQueue(rest)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-2xl items-center gap-4 px-4 py-5">
        <button type="button" onClick={exit} aria-label="Leave lesson" className="rounded-full p-1 hover:bg-line/60">
          <X className="size-6" />
        </button>
        {stage !== 'intro' && <ProgressBar value={stage === 'complete' ? total : done} max={total} label="Lesson progress" color="sage" />}
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-8">
        {stage === 'intro' && <LessonIntro lesson={lesson} onStart={() => setStage('exercises')} />}
        {stage === 'exercises' && current && (
          <MultipleChoice key={current.id + queue.length} exercise={current} selected={selected} checked={checked} onSelect={setSelected} />
        )}
        {stage === 'complete' && (
          <LessonComplete xpEarned={xpEarned} correctFirstTry={total - missed.size} total={total} onDone={() => navigate('/app')} />
        )}
      </main>

      {stage === 'exercises' && current && (
        checked ? (
          <FeedbackPanel correct={correct} explanation={current.explanation} onContinue={next} />
        ) : (
          <div className="border-t border-line px-4 py-5">
            <div className="mx-auto flex max-w-2xl justify-end">
              <Button onClick={check} disabled={selected === null} className="w-full sm:w-auto">Check</Button>
            </div>
          </div>
        )
      )}
    </div>
  )
}
