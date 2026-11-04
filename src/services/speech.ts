// Browser text-to-speech. Prefers a European Portuguese voice; native audio files can replace this later.
let voice: SpeechSynthesisVoice | null | undefined

function findVoice() {
  const voices = speechSynthesis.getVoices()
  const lang = (v: SpeechSynthesisVoice) => v.lang.toLowerCase().replace('_', '-')
  return voices.find((v) => lang(v) === 'pt-pt') ?? voices.find((v) => lang(v).startsWith('pt')) ?? null
}

export const speech = {
  supported: typeof window !== 'undefined' && 'speechSynthesis' in window,
  rate: 0.9,
  unlock() {
    if (!this.supported) return
    const primer = new SpeechSynthesisUtterance(' ')
    primer.lang = 'pt-PT'
    primer.volume = 0
    speechSynthesis.speak(primer)
  },
  cancel() { if (this.supported) speechSynthesis.cancel() },
  speak(text: string, rate?: number, onEnd?: () => void, onError?: () => void) {
    if (!this.supported) return
    voice ??= findVoice()
    speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text.replace(/…/g, ''))
    utterance.lang = 'pt-PT'
    utterance.rate = rate ?? this.rate
    if (voice) utterance.voice = voice
    utterance.onend = () => onEnd?.()
    utterance.onerror = () => onError?.()
    speechSynthesis.speak(utterance)
  },
}

if (speech.supported) speechSynthesis.onvoiceschanged = () => (voice = findVoice())
