import type { Scenario, ScriptStep, TutorMessage, TutorReply, TutorSession } from './types'

const id = () => Math.random().toString(36).slice(2)
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))
const ask = (step: ScriptStep, tip?: string): TutorMessage => ({ id: id(), from: 'tutor', text: step.tutor, translation: step.translation, tip })

// Local, rule-based stand-in for the AI tutor. It follows a fixed script per scenario.
export function createScriptedTutor(scenario: Scenario): TutorSession {
  let step = 0

  return {
    async start() {
      await wait(400)
      return { messages: [ask(scenario.steps[0])], suggestions: scenario.steps[0].suggestions, done: false }
    },

    async reply(text): Promise<TutorReply> {
      await wait(700)
      const current = scenario.steps[step]

      if (!current.accept.test(text)) {
        return {
          messages: [{ id: id(), from: 'tutor', text: 'Hmm, quase! Tenta outra vez.', translation: 'Hmm, almost! Try again.', tip: current.hint }],
          suggestions: current.suggestions,
          done: false,
        }
      }

      const tip = current.tips?.find((t) => t.match.test(text))?.tip
      step++
      const next = scenario.steps[step]
      if (!next) {
        return { messages: [{ id: id(), from: 'tutor', ...scenario.farewell, tip }], suggestions: [], done: true }
      }
      return { messages: [ask(next, tip)], suggestions: next.suggestions, done: false }
    },
  }
}
