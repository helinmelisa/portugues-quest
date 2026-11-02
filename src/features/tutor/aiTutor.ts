import { supabase } from '../../services/supabase'
import type { CefrLevel } from '../../types'
import type { Scenario, TutorMessage, TutorReply, TutorSession } from './types'

interface AiResponse {
  reply?: string
  translation?: string
  tip?: string
  suggestions?: string[]
  error?: string
}

async function callTutor(body: object): Promise<AiResponse> {
  if (!supabase) return { error: 'The AI tutor is not configured.' }
  const { data, error } = await supabase.functions.invoke<AiResponse>('tutor', { body })
  if (!error) return data ?? {}
  try {
    return await (error as { context?: Response }).context!.json()
  } catch {
    return { error: 'Couldn’t reach Inês. Check your connection and try again.' }
  }
}

// Free conversation with Inês through the `tutor` Supabase Edge Function.
export function createAiTutor(scenario: Scenario, level: CefrLevel): TutorSession {
  const history: { role: 'user' | 'assistant'; content: string }[] = []

  const respond = async (): Promise<TutorReply> => {
    const res = await callTutor({ setting: scenario.setting, level, messages: history })
    if (res.error || !res.reply) {
      return { messages: [{ id: crypto.randomUUID(), from: 'tutor', text: 'Desculpa…', tip: res.error ?? 'Something went wrong.' }], suggestions: [], done: false }
    }
    history.push({ role: 'assistant', content: res.reply })
    const message: TutorMessage = { id: crypto.randomUUID(), from: 'tutor', text: res.reply, translation: res.translation, tip: res.tip }
    return { messages: [message], suggestions: res.suggestions ?? [], done: false }
  }

  return {
    start: respond,
    async reply(text) {
      history.push({ role: 'user', content: text })
      return respond()
    },
  }
}
