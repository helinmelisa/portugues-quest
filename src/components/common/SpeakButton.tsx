import { Volume2 } from 'lucide-react'
import { speech } from '../../services/speech'
import { cn } from '../../utils/cn'

export function SpeakButton({ text, className }: { text: string; className?: string }) {
  if (!speech.supported) return null
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        speech.speak(text)
      }}
      aria-label={`Listen: ${text}`}
      className={cn('grid size-9 shrink-0 place-items-center rounded-full bg-sky/30 transition hover:bg-sky/50 active:scale-95', className)}
    >
      <Volume2 className="size-4" aria-hidden />
    </button>
  )
}
