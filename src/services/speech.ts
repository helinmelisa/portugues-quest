// Browser text-to-speech. Prefers a European Portuguese voice; native audio files can replace this later.
let voice: SpeechSynthesisVoice | null | undefined

function findVoice() {
  const voices = speechSynthesis.getVoices()
  return voices.find((v) => v.lang === 'pt-PT' || v.lang === 'pt_PT') ?? voices.find((v) => v.lang.startsWith('pt')) ?? null
}

export const speech = {
  supported: typeof window !== 'undefined' && 'speechSynthesis' in window,
  speak(text: string, rate = 0.9) {
    if (!this.supported) return
    voice ??= findVoice()
    speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text.replace(/…/g, ''))
    utterance.lang = 'pt-PT'
    utterance.rate = rate
    if (voice) utterance.voice = voice
    speechSynthesis.speak(utterance)
  },
}

if (speech.supported) speechSynthesis.onvoiceschanged = () => (voice = findVoice())
