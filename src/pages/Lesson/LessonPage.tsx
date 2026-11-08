import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, ProgressBar } from '../../components/common'
import { FeedbackPanel } from '../../components/lessons/FeedbackPanel'
import { LessonComplete } from '../../components/lessons/LessonComplete'
import type { LessonResult } from '../../features/progress/progressContext'
import { LessonIntro } from '../../components/lessons/LessonIntro'
import { ExerciseView } from '../../components/lessons/ExerciseView'
import type { ExerciseResponse } from '../../components/lessons/types'
import { isLessonAvailable } from '../../data/curriculum'
import { draftKey, loadDraft } from '../../features/learning/lessonDraft'
import { CHECKPOINT_PASS, resolveLesson } from '../../features/learning/practice'
import { useProgress } from '../../hooks/useProgress'
import type { Exercise } from '../../types'

type Stage = 'intro' | 'exercises' | 'complete'

export default function LessonPage() {
  const { lessonId = '' } = useParams()
  const navigate = useNavigate()
  const { completeLesson, progress, reviewWord, passCheckpoint } = useProgress()
  const [draft] = useState(() => loadDraft(lessonId))
  const [lesson] = useState(() => draft?.lesson ?? resolveLesson(lessonId, progress))

  const [stage, setStage] = useState<Stage>(draft?.stage ?? (lesson?.vocabulary.length ? 'intro' : 'exercises'))
  const [queue, setQueue] = useState<Exercise[]>(draft?.queue ?? lesson?.exercises ?? [])
  const [missed, setMissed] = useState(new Set<string>(draft?.missed))
  const [response, setResponse] = useState<ExerciseResponse>({ ready: false, correct: false })
  const [checked, setChecked] = useState(false)
  const [result, setResult] = useState<LessonResult | null>(null)
  const [checkpointPassed, setCheckpointPassed] = useState<boolean | null>(null)
  const bodyRef = useRef<HTMLElement>(null)
  const currentExerciseId = queue[0]?.id

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0, behavior: 'auto' })
    if (stage === 'exercises') bodyRef.current?.querySelector('h1')?.focus({ preventScroll: true })
  }, [currentExerciseId, stage])

  useEffect(() => {
    if (!lesson) return
    try {
      if (stage === 'complete') localStorage.removeItem(draftKey(lessonId))
      else localStorage.setItem(draftKey(lessonId), JSON.stringify({ version: 1, lesson, queue, missed: [...missed], stage }))
    } catch { /* Completed progress has its own durable outbox and storage warning. */ }
  }, [lesson, lessonId, queue, missed, stage])

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
        setCheckpointPassed(passed)
      }
      setResult(completeLesson(lesson))
      if (lesson.id.startsWith('checkpoint-') && total - missed.size >= Math.ceil(total * CHECKPOINT_PASS)) passCheckpoint(lesson.id.replace('checkpoint-', ''))
      setStage('complete')
    }
    setQueue(rest)
  }

  return (
    <div className="lesson-shell">
      <header className="mx-auto flex w-full min-w-0 max-w-2xl shrink-0 items-center gap-4 px-4 py-5">
        <button type="button" onClick={exit} aria-label="Leave lesson" className="shrink-0 rounded-full p-1 hover:bg-line/60">
          <X className="size-6" />
        </button>
        {stage !== 'intro' && <ProgressBar value={stage === 'complete' ? total : done} max={total} label="Lesson progress" color="sage" />}
      </header>

      <main ref={bodyRef} className="lesson-body mx-auto w-full min-w-0 max-w-2xl flex-1 px-4 pb-6">
        {draft && stage !== 'complete' && <p className="mb-4 text-sm opacity-70">Continuing your saved lesson on this device.</p>}
        {stage === 'intro' && <LessonIntro lesson={lesson} onStart={() => setStage('exercises')} />}
        {stage === 'exercises' && current && (
          <ExerciseView key={current.id + queue.length} exercise={current} checked={checked} onChange={setResponse} />
        )}
        {stage === 'complete' && result && (
          <LessonComplete result={result} checkpoint={checkpointPassed} checkpointLevel={lesson.id.replace('checkpoint-', '')} correctFirstTry={total - missed.size} total={total} onDone={() => navigate(lesson.destinationId === 'practice' ? '/app/practice' : '/app')} />
        )}
      </main>

      {stage === 'exercises' && current && (
        checked ? (
          <FeedbackPanel correct={correct} explanation={current.explanation} note={response.note} onContinue={next} />
        ) : (
          <div className="lesson-actions shrink-0 border-t border-line bg-cream px-4 pt-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
            <div className="mx-auto flex max-w-2xl justify-end">
              <Button onClick={check} disabled={!response.ready} className="w-full sm:w-auto">Check</Button>
            </div>
          </div>
        )
      )}
    </div>
  )
}
