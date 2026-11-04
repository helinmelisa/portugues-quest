import type { HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('min-w-0 rounded-3xl border border-line bg-card p-5 shadow-soft md:p-6', className)}
      {...props}
    />
  )
}
