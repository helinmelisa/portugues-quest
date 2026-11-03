import { ArrowLeft, Languages, Play } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { Button, Card, SpeakButton } from '../../components/common'
import { getStory } from '../../data/stories'
import { speech } from '../../services/speech'
import { cn } from '../../utils/cn'

const clean = (word: string) => word.toLowerCase().replace(/^[^\p{L}]+|[^\p{L}]+$/gu, '')

// Splits a sentence into plain words and glossary phrases (longest match first).
function segments(text: string, glossary: Record<string, string>) {
  const words = text.split(' ')
  const keys = Object.keys(glossary).map((k) => k.split(' ')).sort((a, b) => b.length - a.length)
  const out: { text: string; gloss?: string }[] = []
  for (let i = 0; i < words.length; ) {
    const match = keys.find((k) => k.every((kw, j) => clean(words[i + j] ?? '') === kw))
    if (match) {
      out.push({ text: words.slice(i, i + match.length).join(' '), gloss: glossary[match.join(' ')] })
      i += match.length
    } else {
      out.push({ text: words[i] })
      i++
    }
  }
  return out
}

export default function StoryPage() {
  const { storyId = '' } = useParams()
  const navigate = useNavigate()
  const story = getStory(storyId)
  const [showEnglish, setShowEnglish] = useState(false)
  const [active, setActive] = useState<{ sentence: number; text: string; gloss: string } | null>(null)

  if (!story) return <Navigate to="/app/practice/stories" replace />

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/app/practice/stories" className="mb-4 inline-flex items-center gap-1 text-sm opacity-70 hover:opacity-100">
        <ArrowLeft className="size-4" aria-hidden /> Histórias
      </Link>
      <h1 className="font-display text-3xl md:text-4xl">{story.title}</h1>
      <div className="my-5 flex flex-wrap gap-2">
        {speech.supported && (
          <Button variant="secondary" size="sm" onClick={() => speech.speak(story.sentences.map((s) => s.pt).join(' '))}>
            <Play className="size-4" aria-hidden /> Listen to the story
          </Button>
        )}
        <Button variant="ghost" size="sm" aria-pressed={showEnglish} onClick={() => setShowEnglish(!showEnglish)}>
          <Languages className="size-4" aria-hidden /> {showEnglish ? 'Hide English' : 'Show English'}
        </Button>
      </div>

      <Card className="space-y-4">
        {story.sentences.map((s, i) => (
          <div key={i}>
            <div className="flex items-start gap-2">
              <SpeakButton text={s.pt} className="mt-0.5 size-8" />
              <p className="flex-1 text-lg leading-relaxed">
                {segments(s.pt, story.glossary).map((seg, j) =>
                  seg.gloss ? (
                    <button
                      key={j}
                      type="button"
                      onClick={() => setActive({ sentence: i, text: seg.text, gloss: seg.gloss! })}
                      className={cn('mr-1 underline decoration-terracotta/50 decoration-dotted underline-offset-4 hover:bg-sun/30', active?.sentence === i && active.text === seg.text && 'bg-sun/40')}
                    >
                      {seg.text}
                    </button>
                  ) : (
                    <span key={j} className="mr-1">{seg.text}</span>
                  ),
                )}
              </p>
            </div>
            {active?.sentence === i && (
              <p role="status" className="ml-10 mt-1 inline-block rounded-xl bg-sun/30 px-3 py-1 text-sm">
                <strong>{active.text.replace(/[.,!?:;“”—]/g, '')}</strong> — {active.gloss}
              </p>
            )}
            {showEnglish && <p className="ml-10 mt-1 text-sm opacity-70">{s.en}</p>}
          </div>
        ))}
      </Card>

      <Button size="lg" className="mt-6 w-full sm:w-auto" onClick={() => navigate(`/lesson/story-${story.id}`)}>
        Answer 3 questions · +15 XP
      </Button>
    </div>
  )
}
