export const normalize = (text: string) =>
  text.toLowerCase().replace(/[.,!?¿¡;:“”"'’…-]/g, ' ').replace(/\s+/g, ' ').trim()

export const stripAccents = (text: string) => text.normalize('NFD').replace(/[̀-ͯ]/g, '')

const simplify = (text: string) => stripAccents(normalize(text))

function levenshtein(a: string, b: string) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0]
    row[0] = i
    for (let j = 1; j <= b.length; j++) {
      const temp = row[j]
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1))
      prev = temp
    }
  }
  return row[b.length]
}

// 0–1 score of how close a transcript is to the target phrase (ignoring case, punctuation and accents).
export function similarity(heard: string, target: string) {
  const a = simplify(heard)
  const b = simplify(target)
  if (!a || !b) return 0
  return 1 - levenshtein(a, b) / Math.max(a.length, b.length)
}

// Which words of the target phrase appear in the transcript.
export function matchedWords(heard: string, target: string) {
  const said = new Set(simplify(heard).split(' '))
  return target.split(' ').map((word) => ({ word, ok: said.has(simplify(word)) }))
}
