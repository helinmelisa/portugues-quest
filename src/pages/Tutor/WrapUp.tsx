import { Check, Plus, Sparkles } from 'lucide-react'
import { Button, SpeakButton } from '../../components/common'
import type { LessonResult } from '../../features/progress/progressContext'
import { customWordId } from '../../features/progress/progress'
import type { ConversationSummary } from '../../features/tutor/types'
import { useProgress } from '../../hooks/useProgress'

interface Props {
  summary: ConversationSummary | null
  reward: LessonResult | null
  onBack: () => void
}

export function WrapUp({ summary, reward, onBack }: Props) {
  const { progress, addCustomWord } = useProgress()

  return (
    <section aria-label="Conversation feedback" className="mt-8 space-y-4 rounded-3xl bg-sun/20 p-5 md:p-6">
      <h2 className="font-display text-2xl">Conversa completa! 🎉</h2>
      {reward && (
        <p className="flex flex-wrap items-center gap-2 font-medium">
          <Sparkles className="size-4 text-terracotta" aria-hidden /> +{reward.xpEarned} XP
          {reward.achievements.map((a) => <span key={a.id}> · {a.icon} {a.title}</span>)}
          {reward.newRank && <span> · New rank: {reward.newRank}</span>}
        </p>
      )}

      {summary && (
        <>
          <p>{summary.wentWell}</p>

          {summary.corrections.length > 0 && (
            <div>
              <h3 className="mb-2 font-medium">Little fixes</h3>
              <ul className="space-y-2">
                {summary.corrections.map((c, i) => (
                  <li key={i} className="rounded-2xl bg-card p-3 text-sm">
                    <p><span className="line-through opacity-60">{c.said}</span> → <strong>{c.better}</strong></p>
                    <p className="mt-1 opacity-75">{c.why}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {summary.newWords.length > 0 && (
            <div>
              <h3 className="mb-2 font-medium">Words to keep</h3>
              <ul className="space-y-2">
                {summary.newWords.map((w) => {
                  const saved = progress.customWords.some((x) => x.id === customWordId(w.pt))
                  return (
                    <li key={w.pt} className="flex items-center gap-3 rounded-2xl bg-card p-3">
                      <SpeakButton text={w.pt} className="size-8" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{w.pt}</p>
                        <p className="text-sm opacity-75">{w.en}</p>
                      </div>
                      <Button size="sm" variant={saved ? 'ghost' : 'secondary'} disabled={saved} onClick={() => addCustomWord(w)}>
                        {saved ? <><Check className="size-4" aria-hidden /> Saved</> : <><Plus className="size-4" aria-hidden /> Word Garden</>}
                      </Button>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </>
      )}

      <Button onClick={onBack}>Try another scenario</Button>
    </section>
  )
}
