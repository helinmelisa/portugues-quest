import { X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, ProgressBar } from '../../components/common'
import { FeedbackPanel } from '../../components/lessons/FeedbackPanel'
import { LessonComplete } from '../../components/lessons/LessonComplete'
import type { LessonResult } from '../../features/progress/progressContext'
import { LessonIntro } from '../../components/lessons/LessonIntro'
import { ExerciseView } from '../../components/lessons/ExerciseView'
import type { ExerciseResponse } from '../../components/lessons/types'
import { isLessonAvailable } from '../../data/curriculum'
import { CHECKPOINT_PASS, resolveLesson } from '../../features/learning/practice'
import { useProgress } from '../../hooks/useProgress'
import type { Exercise } from '../../types'

type Stage = 'intro' | 'exercises' | 'complete'

export default function LessonPage() {
  const { lessonId = '' } = useParams()
  const navigate = useNavigate()
  const { completeLesson, progress, reviewWord, passCheckpoint } = useProgress()
  const [lesson] = useState(() => resolveLesson(lessonId, progress))

  const [stage, setStage] = useState<Stage>(lesson?.vocabulary.length ? 'intro' : 'exercises')
  const [queue, setQueue] = useState<Exercise[]>(lesson?.exercises ?? [])
  const [missed, setMissed] = useState(new Set<string>())
  const [response, setResponse] = useState<ExerciseResponse>({ ready: false, correct: false })
  const [checked, setChecked] = useState(false)
  const [result, setResult] = useState<LessonResult | null>(null)
  const [checkpointPassed, setCheckpointPassed] = useState<boolean | null>(null)

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
  const correct = checked && response.correct

  const check = () => {
    setChecked(true)
    if (current.wordId && !missed.has(current.id)) reviewWord(current.wordId, response.correct)
    if (!response.correct) setMissed((m) => new Set(m).add(current.id))
  }

  const next = () => {
    const rest = correct ? queue.slice(1) : [...queue.slice(1), current]
    setResponse({ ready: false, correct: false })
    setChecked(false)
    if (rest.length === 0) {
      if (lesson.id.startsWith('checkpoint-')) {
        const passed = total - missed.size >= Math.ceil(total * CHECKPOINT_PASS)
        if (passed) passCheckpoint(lesson.id.replace('checkpoint-', ''))
        setCheckpointPassed(passed)
      }
      setResult(completeLesson(lesson))
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
          <ExerciseView key={current.id + queue.length} exercise={current} checked={checked} onChange={setResponse} />
        )}
        {stage === 'complete' && result && (
          <LessonComplete result={result} checkpoint={checkpointPassed} correctFirstTry={total - missed.size} total={total} onDone={() => navigate(lesson.destinationId === 'practice' ? '/app/practice' : '/app')} />
        )}
      </main>

      {stage === 'exercises' && current && (
        checked ? (
          <FeedbackPanel correct={correct} explanation={current.explanation} note={response.note} onContinue={next} />
        ) : (
          <div className="border-t border-line px-4 py-5">
            <div className="mx-auto flex max-w-2xl justify-end">
              <Button onClick={check} disabled={!response.ready} className="w-full sm:w-auto">Check</Button>
            </div>
          </div>
        )
      )}
    </div>
  )
}
