import { PageHeader } from '../../components/common/PageHeader'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Badge, Button, Card, SpeakButton } from '../../components/common'
import { getRealText } from '../../data/realTexts'

export default function TextPage() {
  const { textId = '' } = useParams()
  const text = getRealText(textId)
  const [english, setEnglish] = useState(false)

  if (!text) return <Navigate to="/app/practice/texts" replace />

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Link to="/app/practice/texts" className="inline-flex items-center gap-1 text-sm opacity-70 hover:opacity-100">
        <ArrowLeft className="size-4" aria-hidden /> Real-life texts
      </Link>
      <PageHeader eyebrow="Everyday Portuguese" title={text.title} />
      <Badge tone="sky">A2 · {text.kind}</Badge>
      <p className="text-sm opacity-75">{text.context} · Example for language practice</p>
      <Card>
        <div className="flex items-start gap-3">
          <p lang="pt-PT" className="flex-1 whitespace-pre-line text-lg leading-relaxed">
            {text.text}
          </p>
          <SpeakButton text={text.text} />
        </div>
      </Card>
      <Button variant="ghost" size="sm" aria-pressed={english} onClick={() => setEnglish(!english)}>
        {english ? 'Hide English' : 'Show English'}
      </Button>
      {english && <p className="rounded-2xl bg-sky/20 p-4">{text.translation}</p>}
      <dl className="space-y-2">
        {text.glossary.map((word) => (
          <div key={word.pt} className="flex gap-2">
            <dt className="font-medium">{word.pt}</dt>
            <dd className="opacity-75">— {word.en}</dd>
          </div>
        ))}
      </dl>
      <Link to={`/lesson/text-${text.id}`} className="inline-block rounded-full action-link">
        Answer 3 questions · +15 XP
      </Link>
    </div>
  )
}
