import { BookOpen, ChevronDown } from 'lucide-react'
import type { GrammarBite } from '../../data/grammar'
import { SpeakButton } from '../common'

export function GrammarBiteCard({ bite, open = false }: { bite: GrammarBite; open?: boolean }) {
  return (
    <details open={open} className="group rounded-3xl border border-line bg-card p-5 shadow-soft">
      <summary className="flex cursor-pointer list-none items-start gap-3">
        <BookOpen className="mt-1 size-5 shrink-0 text-sage" aria-hidden />
        <div className="flex-1">
          <h3 className="font-display text-xl">{bite.title}</h3>
          <p className="text-sm opacity-75">{bite.summary}</p>
        </div>
        <ChevronDown className="mt-1 size-5 shrink-0 transition group-open:rotate-180" aria-hidden />
      </summary>
      <div className="mt-4 space-y-4">
        {bite.sections.map((section, i) => (
          <div key={i} className="space-y-2">
            <p>{section.text}</p>
            {section.table && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-line">{section.table[0].map((h, j) => <th key={j} className="py-1.5 pr-4 font-medium">{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {section.table.slice(1).map((row, r) => (
                      <tr key={r} className="border-b border-line/60">
                        {row.map((cell, c) => <td key={c} className={c ? 'py-1.5 pr-4 font-medium' : 'py-1.5 pr-4 opacity-70'}>{cell}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {section.examples && (
              <ul className="space-y-1.5">
                {section.examples.map((e) => (
                  <li key={e.pt} className="flex items-center gap-2 rounded-2xl bg-cream px-3 py-2">
                    <SpeakButton text={e.pt} className="size-7" />
                    <span><strong>{e.pt}</strong> <span className="opacity-70">— {e.en}</span></span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </details>
  )
}
