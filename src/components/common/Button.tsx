import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const variants: Record<Variant, string> = {
  primary: 'bg-terracotta-dark text-white shadow-soft hover:brightness-90',
  secondary: 'bg-card text-ink border border-line hover:border-sage',
  ghost: 'text-ink hover:bg-line/60',
}

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5',
  lg: 'px-7 py-3.5 text-lg',
}

export function Button({ variant = 'primary', size = 'md', className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex min-w-0 max-w-full items-center justify-center gap-2 whitespace-normal rounded-full text-center font-medium leading-snug [overflow-wrap:anywhere] transition [&>svg]:shrink-0',
        'active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  )
}
