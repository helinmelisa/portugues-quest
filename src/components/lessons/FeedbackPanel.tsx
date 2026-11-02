import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'
import { Button } from '../common'

const praise = ['Muito bem!', 'Excelente!', 'Continua assim!', 'Perfeito!']
const comfort = ['Quase lá!', 'Boa tentativa!']
const pick = (list: string[]) => list[Math.floor(Math.random() * list.length)]

interface Props {
  correct: boolean
  explanation: string
  onContinue: () => void
}

export function FeedbackPanel({ correct, explanation, onContinue }: Props) {
  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      role="status"
      className={cn('border-t-2 px-4 py-5 md:px-8', correct ? 'border-sage bg-sage/25' : 'border-terracotta bg-terracotta/10')}
    >
      <div className="mx-auto flex max-w-2xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-xl">{correct ? pick(praise) : pick(comfort)}</p>
          <p className="mt-1 opacity-85">{explanation}</p>
          {!correct && <p className="mt-1 text-sm opacity-70">We’ll come back to this one at the end.</p>}
        </div>
        <Button onClick={onContinue} autoFocus className="shrink-0">Continue</Button>
      </div>
    </motion.div>
  )
}
