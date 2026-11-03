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
  speak(text: string, rate?: number) {
    if (!this.supported) return
    voice ??= findVoice()
    speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text.replace(/…/g, ''))
    utterance.lang = 'pt-PT'
    utterance.rate = rate ?? this.rate
    if (voice) utterance.voice = voice
    speechSynthesis.speak(utterance)
  },
}

if (speech.supported) speechSynthesis.onvoiceschanged = () => (voice = findVoice())
