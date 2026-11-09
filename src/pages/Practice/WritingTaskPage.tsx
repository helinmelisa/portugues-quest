import { PageHeader } from '../../components/common/PageHeader'
import { ArrowLeft, Check, Save } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Button, Card, SpeakButton } from '../../components/common'
import { getWritingTask } from '../../data/writing'
import { writingActivity, wordCount } from '../../features/writing/writing'
import { useProgress } from '../../hooks/useProgress'

export default function WritingTaskPage() {
  const { taskId = '' } = useParams()
  const task = getWritingTask(taskId)
  const { progress, saveWritingDraft, completeLesson } = useProgress()
  const [text, setText] = useState(progress.writingDrafts[taskId]?.text ?? '')
  const [model, setModel] = useState(false)
  const [checked, setChecked] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [finished, setFinished] = useState(false)
  if (!task) return <Navigate to="/app/practice/writing" replace />
  const count = wordCount(text)
  const save = () => {
    saveWritingDraft(taskId, text)
    setMessage('Draft saved on this device and queued for account sync.')
  }
  const finish = () => {
    if (finished || count < task.minWords || checked.length !== task.checklist.length) return
    saveWritingDraft(taskId, text)
    const result = completeLesson(writingActivity(task))
    setFinished(true)
    setMessage(
      `Boa! Writing practice complete · +${result.xpEarned} XP. This is self-checked practice, not an automatic grammar score.`,
    )
  }
  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Link to="/app/practice/writing" className="inline-flex items-center gap-1 text-sm opacity-70">
        <ArrowLeft className="size-4" aria-hidden /> Writing desk
      </Link>
      <PageHeader eyebrow="Practice Corner" title={task.title} />
      <p>{task.situation}</p>
      <p className="text-sm opacity-70">Use fictional personal details. Saved drafts sync to your account.</p>
      <Card className="space-y-2">
        <h2 className="font-display text-xl">Useful phrases</h2>
        {task.phrases.map((phrase) => (
          <p key={phrase.pt}>
            <strong>{phrase.pt}</strong> <span className="opacity-70">— {phrase.en}</span>
          </p>
        ))}
      </Card>
      <label htmlFor="writing-draft" className="block font-medium">
        Your message in Portuguese
      </label>
      <textarea
        id="writing-draft"
        rows={8}
        maxLength={3000}
        lang="pt-PT"
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          setFinished(false)
          setChecked([])
          setMessage('')
        }}
        className="w-full resize-y rounded-2xl border-2 border-line bg-card p-4"
      />
      <p className="text-sm opacity-70">
        {count} words · aim for at least {task.minWords}. {text.length}/3000 characters
      </p>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={save}>
          <Save className="size-4" aria-hidden /> Save draft
        </Button>
        <Button variant="ghost" aria-expanded={model} onClick={() => setModel(!model)}>
          {model ? 'Hide model' : 'Compare with a model'}
        </Button>
      </div>
      {model && (
        <Card className="space-y-3 bg-sky/15">
          <h2 className="font-display text-xl">One possible answer</h2>
          <div className="flex items-start gap-2">
            <p className="min-w-0 flex-1 leading-relaxed" lang="pt-PT">
              {task.model}
            </p>
            <SpeakButton text={task.model} />
          </div>
          <p className="text-sm opacity-70">Your version can be different. Use the checklist to improve it.</p>
        </Card>
      )}
      <Card className="space-y-3">
        <h2 className="font-display text-xl">Check your message</h2>
        {task.checklist.map((item) => (
          <label key={item} className="flex min-h-11 items-start gap-3 py-2">
            <input
              type="checkbox"
              checked={checked.includes(item)}
              onChange={(e) => setChecked(e.target.checked ? [...checked, item] : checked.filter((x) => x !== item))}
              className="mt-1 size-5 shrink-0 accent-terracotta"
            />
            <span>{item}</span>
          </label>
        ))}
        <p className="text-sm opacity-70">
          These are your own checks. We aren’t grading your grammar or storing a proficiency score.
        </p>
        <Button
          disabled={finished || count < task.minWords || checked.length !== task.checklist.length}
          onClick={finish}
        >
          <Check className="size-4" aria-hidden /> {finished ? 'Completed' : 'Finish writing practice'}
        </Button>
      </Card>
      {message && (
        <p role="status" className="rounded-2xl bg-sage/20 p-4">
          {message}
        </p>
      )}
    </div>
  )
}
