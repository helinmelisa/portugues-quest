import { PageHeader } from '../../components/common/PageHeader'
import { ArrowLeft, Pause, Play } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Button, Card, SpeakButton } from '../../components/common'
import { dialogueAudio, getDialogue } from '../../data/dialogues'
import { speech } from '../../services/speech'

export default function DialoguePage() {
  const { dialogueId = '' } = useParams()
  const dialogue = getDialogue(dialogueId)
  const [transcript, setTranscript] = useState(!speech.supported)
  const [english, setEnglish] = useState(false)
  useEffect(() => () => speech.cancel(), [])
  if (!dialogue) return <Navigate to="/app/practice/dialogues" replace />
  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Link to="/app/practice/dialogues" className="inline-flex items-center gap-1 text-sm opacity-70">
        <ArrowLeft className="size-4" aria-hidden /> Listening dialogues
      </Link>
      <PageHeader eyebrow="Practice Corner" title={dialogue.title} />
      <p>{dialogue.objective}</p>
      <div className="flex flex-wrap gap-2">
        {speech.supported && (
          <>
            <Button onClick={() => speech.speak(dialogueAudio(dialogue))}>
              <Play className="size-4" aria-hidden /> Listen
            </Button>
            <Button variant="secondary" onClick={() => speech.speak(dialogueAudio(dialogue), 0.7)}>
              Listen slowly
            </Button>
            <Button variant="ghost" onClick={() => speech.cancel()}>
              <Pause className="size-4" aria-hidden /> Stop
            </Button>
          </>
        )}
        <Button variant="secondary" aria-expanded={transcript} onClick={() => setTranscript(!transcript)}>
          {transcript ? 'Hide transcript' : 'Show transcript'}
        </Button>
      </div>
      <p className="text-sm opacity-70">
        Device-generated audio uses one voice for both roles. Prices, arrangements and service details are fictional.
      </p>
      {transcript && (
        <Card className="space-y-4">
          <Button variant="ghost" size="sm" aria-pressed={english} onClick={() => setEnglish(!english)}>
            {english ? 'Hide English' : 'Show English'}
          </Button>
          <ol className="space-y-4">
            {dialogue.turns.map((turn, i) => (
              <li key={i}>
                <p className="text-xs font-medium uppercase tracking-wide opacity-60">{turn.speaker}</p>
                <div className="flex items-start gap-2">
                  <p lang="pt-PT" className="min-w-0 flex-1 leading-relaxed">
                    {turn.pt}
                  </p>
                  <SpeakButton text={turn.pt} className="size-8" />
                </div>
                {english && <p className="mt-1 text-sm opacity-70">{turn.en}</p>}
              </li>
            ))}
          </ol>
        </Card>
      )}
      <Card>
        <h2 className="mb-3 font-display text-xl">Words to listen for</h2>
        <dl className="space-y-2">
          {dialogue.vocabulary.map((w) => (
            <div key={w.id}>
              <dt className="font-medium" lang="pt-PT">
                {w.pt}
              </dt>
              <dd className="text-sm opacity-75">{w.en}</dd>
            </div>
          ))}
        </dl>
      </Card>
      <Link
        to={`/lesson/dialogue-${dialogue.id}`}
        className="action-link"
      >
        Answer 3 questions · +20 XP
      </Link>
    </div>
  )
}
