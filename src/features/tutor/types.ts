import type { CefrLevel } from '../../types'

export interface TutorMessage {
  id: string
  from: 'tutor' | 'user'
  text: string
  translation?: string
  tip?: string
}

export interface TutorReply {
  messages: TutorMessage[]
  suggestions: string[]
  error?: string
  done: boolean
}

export interface ConversationSummary {
  speaking?: {
    fluency: number
    vocabulary: number
    accuracy: number
    practise: string
  } // 1–5, estimated from transcribed language, not acoustic pronunciation
  wentWell: string
  corrections: { said: string; better: string; why: string }[]
  newWords: { pt: string; en: string }[]
}

// Any tutor backend (the local script now, an AI service later) implements this.
export interface TutorSession {
  start(): Promise<TutorReply>
  reply(text: string): Promise<TutorReply>
  summarize?: () => Promise<ConversationSummary | { error: string }>
}

export interface ScriptStep {
  tutor: string
  translation: string
  accept: RegExp
  hint: string
  suggestions: string[]
  tips?: { match: RegExp; tip: string }[]
}

export interface Scenario {
  id: string
  title: string
  description: string
  level: CefrLevel
  call?: boolean // suitable for a phone role-play
  setting: string // scene description for the AI tutor
  steps?: ScriptStep[] // scripted demo, used when the AI tutor isn't available
  farewell?: { text: string; translation: string }
}
