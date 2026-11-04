import { ArrowLeft, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge, Card } from '../../components/common'
import { realTexts } from '../../data/realTexts'

export default function TextsPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <Link to="/app/practice" className="mb-4 inline-flex items-center gap-1 text-sm opacity-70 hover:opacity-100"><ArrowLeft className="size-4" aria-hidden /> Practice Corner</Link>
      <h1 className="font-display text-3xl md:text-4xl">Real-life texts</h1>
      <p className="mb-6 mt-2 opacity-80">Little pieces of everyday Portugal. These are fictional examples for reading practice.</p>
      <ul className="grid gap-4 sm:grid-cols-2">
        {realTexts.map((text) => (
          <li key={text.id}>
            <Link to={`/app/practice/texts/${text.id}`} className="block h-full rounded-3xl">
              <Card className="h-full hover:border-sage">
                <FileText className="size-7 text-sky" aria-hidden />
                <h2 className="mt-3 font-display text-xl">{text.title}</h2>
                <p className="mt-1 text-sm opacity-75">{text.context}</p>
                <Badge className="mt-4">A2 · {text.kind} · +15 XP</Badge>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
