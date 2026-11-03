import { supabase } from './supabase'

function toBase64(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '')
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

// Speech-to-text (Groq Whisper) through the `tutor` Edge Function.
export async function transcribe(audio: Blob): Promise<{ text?: string; error?: string }> {
  if (!supabase) return { error: 'Speech recognition needs you to be signed in.' }
  const { data, error } = await supabase.functions.invoke<{ text?: string; error?: string }>('tutor', {
    body: { action: 'transcribe', audio: await toBase64(audio), mimeType: audio.type },
  })
  if (!error) return data ?? {}
  try {
    return await (error as { context?: Response }).context!.json()
  } catch {
    return { error: 'Couldn’t reach the server. Check your connection.' }
  }
}
