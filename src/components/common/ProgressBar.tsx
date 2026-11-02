import { cn } from '../../utils/cn'

interface ProgressBarProps {
  value: number
  max?: number
  label: string
  color?: 'terracotta' | 'sage' | 'sun' | 'sky'
  className?: string
}

const fills = {
  terracotta: 'bg-terracotta',
  sage: 'bg-sage',
  sun: 'bg-sun',
  sky: 'bg-sky',
}

export function ProgressBar({ value, max = 100, label, color = 'terracotta', className }: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn('h-2.5 w-full overflow-hidden rounded-full bg-line', className)}
    >
      <div
        className={cn('h-full rounded-full transition-[width] duration-500', fills[color])}
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}
