import { ArrowLeft, Check, NotebookPen } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button, Card, SpeakButton } from '../../components/common'
import { useProgress } from '../../hooks/useProgress'

export default function MistakesPage() {
  const { progress, removeMistake } = useProgress()
  const mistakes = [...progress.mistakes].reverse()

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/app/practice" className="mb-4 inline-flex items-center gap-1 text-sm opacity-70 hover:opacity-100">
        <ArrowLeft className="size-4" aria-hidden /> Practice Corner
      </Link>
      <h1 className="font-display text-3xl md:text-4xl">Mistake notebook</h1>
      <p className="mb-6 mt-2 opacity-80">Every little fix from your chats with Inês lands here. Mistakes are how you learn — practise them until they stick.</p>

      {mistakes.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 py-12 text-center">
          <NotebookPen className="size-10 text-sage" aria-hidden />
          <p className="max-w-sm opacity-80">No mistakes yet! Chat with Inês and end the conversation to get feedback.</p>
          <Link to="/app/tutor"><Button>Chat with Inês</Button></Link>
        </Card>
      ) : (
        <>
          <Link to="/lesson/practice-mistakes"><Button className="mb-4">Practise these</Button></Link>
          <ul className="space-y-3">
            {mistakes.map((m) => (
              <li key={m.id}>
                <Card className="flex items-start gap-3 p-4 md:p-4">
                  <SpeakButton text={m.better} className="size-8" />
                  <div className="min-w-0 flex-1">
                    <p><span className="line-through opacity-60">{m.said}</span> → <strong>{m.better}</strong></p>
                    <p className="mt-1 text-sm opacity-75">{m.why}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeMistake(m.id)} aria-label={`Mark “${m.better}” as learned`}>
                    <Check className="size-4" aria-hidden /> Got it
                  </Button>
                </Card>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
