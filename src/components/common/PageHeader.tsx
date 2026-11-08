import type { ReactNode } from 'react'

export function PageHeader({
  title,
  description,
  eyebrow = 'Your Portuguese journey',
}: {
  title: ReactNode
  description?: ReactNode
  eyebrow?: string
}) {
  return (
    <header className="page-heading mb-7 rounded-3xl border border-line bg-card px-5 py-6 md:px-7 md:py-7">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-terracotta-dark">{eyebrow}</p>
      <h1 className="font-display text-3xl md:text-4xl">{title}</h1>
      {description && <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink/80">{description}</p>}
    </header>
  )
}
