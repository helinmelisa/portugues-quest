import { useState } from 'react'
import type { TranslationExercise } from '../../types'
import type { ExerciseProps } from './types'

const normalize = (text: string) =>
  text.toLowerCase().replace(/[.,!?¿¡;:“”"'’]/g, '').replace(/\s+/g, ' ').trim()
const stripAccents = (text: string) => text.normalize('NFD').replace(/[̀-ͯ]/g, '')

export function checkTranslation(input: string, answers: string[]) {
  const given = normalize(input)
  if (answers.some((a) => normalize(a) === given)) return { correct: true }
  const close = answers.find((a) => stripAccents(normalize(a)) === stripAccents(given))
  return close ? { correct: true, note: `Watch the accents: “${close}”.` } : { correct: false }
}

export function Translation({ exercise, checked, onChange }: ExerciseProps<TranslationExercise>) {
  const [value, setValue] = useState('')
  const toPortuguese = exercise.direction === 'en-pt'

  return (
    <fieldset>
      <legend className="mb-2 font-display text-2xl md:text-3xl">{exercise.prompt}</legend>
      <p className="mb-6 rounded-2xl bg-sun/20 px-4 py-3 text-xl">{exercise.source}</p>
      <label htmlFor="translation" className="sr-only">Your translation</label>
      <textarea
        id="translation"
        rows={2}
        value={value}
        disabled={checked}
        lang={toPortuguese ? 'pt-PT' : 'en'}
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        placeholder={toPortuguese ? 'Escreve em português…' : 'Type in English…'}
        onChange={(e) => {
          setValue(e.target.value)
          onChange({ ready: e.target.value.trim().length > 0, ...checkTranslation(e.target.value, exercise.answers) })
        }}
        className="w-full resize-none rounded-2xl border-2 border-line bg-card px-4 py-3 text-lg focus:border-terracotta"
      />
      {checked && <p className="mt-4">Answer: <strong>{exercise.answers[0]}</strong></p>}
    </fieldset>
  )
}
