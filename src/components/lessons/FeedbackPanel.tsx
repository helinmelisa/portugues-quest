import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'
import { Button } from '../common'

const praise = ['Muito bem!', 'Excelente!', 'Continua assim!', 'Perfeito!']
const comfort = ['Quase lá!', 'Boa tentativa!']
const pick = (list: string[]) => list[Math.floor(Math.random() * list.length)]

interface Props {
  correct: boolean
  explanation: string
  note?: string
  onContinue: () => void
}

export function FeedbackPanel({ correct, explanation, note, onContinue }: Props) {
  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      role="status"
      className={cn('lesson-feedback flex min-w-0 shrink-0 flex-col overflow-hidden border-t-2 px-4 pt-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] md:px-8', correct ? 'border-sage bg-sage/25' : 'border-terracotta bg-terracotta/10')}
    >
      <div className="mx-auto flex min-h-0 w-full min-w-0 max-w-2xl flex-1 flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto [overflow-wrap:anywhere]">
          <p className="font-display text-xl">{correct ? pick(praise) : pick(comfort)}</p>
          {note && <p className="mt-1 font-medium">{note}</p>}
          <p className="mt-1 opacity-85">{explanation}</p>
          {!correct && <p className="mt-1 text-sm opacity-70">We’ll come back to this one at the end.</p>}
        </div>
        <Button onClick={onContinue} autoFocus className="shrink-0">Continue</Button>
      </div>
    </motion.div>
  )
}
