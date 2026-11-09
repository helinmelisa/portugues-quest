import assert from 'node:assert/strict'
import { createServer } from 'vite'

const server = await createServer({ server: { middlewareMode: true, ws: false }, appType: 'custom' })
try {
  const load = (path) => server.ssrLoadModule(`/src/${path}`)
  const { emptyProgress, completeLesson } = await load('features/progress/progress.ts')
  const { resolveLesson, allVocabulary } = await load('features/learning/practice.ts')
  const { writingTasks } = await load('data/writing.ts')
  const { wordCount, writingActivity } = await load('features/writing/writing.ts')
  const { dialogues } = await load('data/dialogues.ts')
  const { b1Lessons } = await load('data/curriculum/b1.ts')
  const { grammarBites } = await load('data/grammar.ts')
  const { lessons } = await load('data/curriculum/index.ts')
  const { freshData } = await load('features/sync/learningStore.ts')
  const { changesBetween, applyActivities } = await load('features/sync/changes.ts')
  const { mergeProgress } = await load('features/sync/merge.ts')
  assert.equal(writingTasks.length, 6)
  assert.equal(wordCount('  Olá, senhor! Gostaria de marcar uma visita. '), 7)
  assert.equal(wordCount('123 !!!'), 0)
  for (const task of writingTasks) {
    assert(wordCount(task.model) >= task.minWords, task.id)
    assert(task.checklist.length >= 3)
    const result = completeLesson(emptyProgress, writingActivity(task))
    assert(result.progress.completedLessons[`writing-${task.id}`])
    assert.equal(result.xpEarned, 20)
  }
  const base = freshData(), first = structuredClone(base), second = structuredClone(base)
  first.progress.writingDrafts.landlord = {text:'Primeira versão',updatedAt:'2026-11-08T12:00:00Z'}
  second.progress.writingDrafts.appointment = {text:'Uma marcação',updatedAt:'2026-11-08T12:01:00Z'}
  const activity = (before, after, id) => ({id,createdAt:new Date().toISOString(),changes:changesBetween(before,after)})
  const combined = applyActivities(base,[activity(base,first,'one'),activity(base,second,'two')])
  assert.equal(combined.progress.writingDrafts.landlord.text,'Primeira versão')
  assert.equal(combined.progress.writingDrafts.appointment.text,'Uma marcação')
  const newer = structuredClone(first)
  newer.progress.writingDrafts.landlord = {text:'',updatedAt:'2026-11-08T12:02:00Z'}
  const replacement = activity(first,newer,'three')
  assert.equal(replacement.changes.length,1,'a draft is one atomic record')
  assert.equal(applyActivities(combined,[replacement]).progress.writingDrafts.landlord.text,'','clearing a draft persists')
  assert.equal(mergeProgress(first.progress,newer.progress).writingDrafts.landlord.text,'')
  assert.equal(dialogues.length,4)
  for (const dialogue of dialogues) {
    assert.equal(dialogue.turns.length,8)
    const quiz = resolveLesson(`dialogue-${dialogue.id}`,emptyProgress)
    assert.equal(quiz.exercises.length,3)
    assert(quiz.exercises.every(e=>e.type==='listening' && e.audioText.includes(dialogue.turns[7].pt)))
    const completed = completeLesson(emptyProgress,quiz).progress
    assert(dialogue.vocabulary.every(w=>completed.learnedWords.includes(w.id) && completed.reviews[w.id]))
  }
  assert.equal(b1Lessons.length,4)
  for (const lesson of b1Lessons) {
    assert.equal(lesson.level,'B1')
    assert(grammarBites.some(b=>b.id===lesson.grammarId))
    assert(lesson.exercises.length>=8)
  }
  assert.equal(new Set(lessons.map(l=>l.id)).size,lessons.length)
  const all = allVocabulary()
  assert.equal(new Set(all.map(w=>w.id)).size,all.length)
  const progress=structuredClone(emptyProgress)
  const words=all.slice(0,4)
  progress.learnedWords=words.map(w=>w.id)
  progress.difficultWords=[words[0].id]
  for(const word of words) progress.reviews[word.id]={due:'2000-01-01',interval:1,ease:2.5,repetitions:1}
  progress.mistakes=[{id:'correction',said:'Eu é',better:'Eu sou estudante.',why:'Use sou with eu.'}]
  const focus=resolveLesson('practice-focus',progress)
  assert.equal(focus.exercises[0].id,'focus-correction')
  assert.equal(focus.exercises[1].wordId,words[0].id,'due and tricky words have priority')
  assert.equal(new Set(focus.exercises.map(e=>e.wordId).filter(Boolean)).size,focus.exercises.length-1)
  for(const mode of ['focus','review','quick','sentences']) for(let i=0;i<20;i++) {
    const quiz=resolveLesson(`practice-${mode}`,emptyProgress)
    assert(quiz.exercises.length)
    assert(!quiz.exercises.some(e=>e.id.startsWith('b1-')),'beginners do not get B1 exercises in random practice')
  }
  for(const lesson of [...b1Lessons,...dialogues.map(d=>resolveLesson(`dialogue-${d.id}`,emptyProgress)),focus]) {
    for(const exercise of lesson.exercises) {
      if(exercise.options){assert.equal(new Set(exercise.options).size,exercise.options.length);assert(exercise.answer>=0&&exercise.answer<exercise.options.length)}
      if(exercise.type==='fill-blank')assert(exercise.sentence.includes('___'))
    }
  }
  console.log('Milestone 7: writing rewards, atomic draft sync, clearing drafts, focus priorities, dialogue SRS, B1 content and beginner review boundaries passed.')
} finally { await server.close() }
