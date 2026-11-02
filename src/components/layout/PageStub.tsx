import type { LucideIcon } from 'lucide-react'
import { Card } from '../common'

export function PageStub({ title, text, icon: Icon }: { title: string; text: string; icon: LucideIcon }) {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 font-display text-3xl md:text-4xl">{title}</h1>
      <Card className="flex flex-col items-center gap-3 py-12 text-center">
        <Icon className="size-10 text-sage" aria-hidden />
        <p className="max-w-sm opacity-80">{text}</p>
      </Card>
    </div>
  )
}
