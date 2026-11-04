import { supabase } from '../../services/supabase'
import type { CefrLevel } from '../../types'
import type { ConversationSummary, Scenario, TutorMessage, TutorReply, TutorSession } from './types'

interface AiResponse {
  reply?: string
  translation?: string
  tip?: string
  suggestions?: string[]
  error?: string
}

async function callTutor<T = AiResponse>(body: object): Promise<T & { error?: string }> {
  if (!supabase) return { error: 'The AI tutor is not configured.' } as T & { error: string }
  const { data, error } = await supabase.functions.invoke<T>('tutor', { body })
  if (!error) return (data ?? {}) as T & { error?: string }
  try {
    return await (error as { context?: Response }).context!.json()
  } catch {
    return { error: 'Couldn’t reach Inês. Check your connection and try again.' } as T & { error: string }
  }
}

export interface LearnerContext {
  name?: string
  interests?: string
  motivation?: string
  mistakes: string[]
}

// Free conversation with Inês through the `tutor` Supabase Edge Function.
export function createAiTutor(scenario: Scenario, level: CefrLevel, learner?: LearnerContext, call = false): TutorSession {
  const history: { role: 'user' | 'assistant'; content: string }[] = []

  const respond = async (): Promise<TutorReply> => {
    const res = await callTutor({ setting: scenario.setting, level, learner, call, messages: history })
    if (res.error || !res.reply) {
      return { messages: [{ id: crypto.randomUUID(), from: 'tutor', text: 'Desculpa…', tip: res.error ?? 'Something went wrong.' }], suggestions: [], done: false, error: res.error ?? 'Something went wrong.' }
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
    async summarize() {
      const res = await callTutor<ConversationSummary>({ action: 'summary', level, call, messages: history })
      return res.error || !res.wentWell ? { error: res.error ?? 'Inês couldn’t prepare your feedback this time.' } : res
    },
  }
}
