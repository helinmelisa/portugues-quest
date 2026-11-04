import assert from 'node:assert/strict'
import { createServer } from 'vite'

const server = await createServer({ server: { middlewareMode: true, ws: false }, appType: 'custom' })
try {
  const { lessons } = await server.ssrLoadModule('/src/data/curriculum/index.ts')
  const { vidaLessons } = await server.ssrLoadModule('/src/data/curriculum/vida.ts')
  const { vidaTopics } = await server.ssrLoadModule('/src/data/vida.ts')
  const { realTexts } = await server.ssrLoadModule('/src/data/realTexts.ts')
  const { grammarBites } = await server.ssrLoadModule('/src/data/grammar.ts')
  const { emptyProgress, completeLesson } = await server.ssrLoadModule('/src/features/progress/progress.ts')
  const { resolveLesson, a2CheckpointAvailable, CHECKPOINT_PASS } = await server.ssrLoadModule('/src/features/learning/practice.ts')
  const { newlyUnlocked } = await server.ssrLoadModule('/src/features/achievements/achievements.ts')
  const { mergeProgress } = await server.ssrLoadModule('/src/features/sync/merge.ts')

  assert.equal(vidaLessons.length, 10)
  assert.equal(new Set(lessons.map((l) => l.id)).size, lessons.length)
  assert.equal(new Set(vidaTopics.flatMap((t) => t.lessonIds)).size, 10)
  assert.equal(grammarBites.length, 11)
  for (const lesson of vidaLessons) {
    assert(grammarBites.some((g) => g.id === lesson.grammarId))
    assert(lesson.exercises.some((e) => e.type === 'pronunciation'))
    for (const exercise of lesson.exercises) {
      if (exercise.options) {
        assert(exercise.answer >= 0 && exercise.answer < exercise.options.length)
        assert.equal(new Set(exercise.options).size, exercise.options.length)
      }
      if (exercise.type === 'fill-blank') assert(exercise.sentence.includes('___'))
      if (exercise.type === 'sentence-build') assert(exercise.words.length > 0)
    }
    const result = completeLesson(emptyProgress, lesson).progress
    assert(result.completedLessons[lesson.id])
    assert(lesson.vocabulary.every((w) => result.learnedWords.includes(w.id) && result.reviews[w.id]))
  }
  assert(!a2CheckpointAvailable(emptyProgress))
  assert.equal(resolveLesson('checkpoint-A2', emptyProgress), undefined)
  let progress = structuredClone(emptyProgress)
  for (const lesson of vidaLessons) progress = completeLesson(progress, lesson).progress
  assert(!a2CheckpointAvailable(progress))
  for (const lesson of lessons.filter((l) => l.destinationId === 'madeira').slice(0, 2)) progress = completeLesson(progress, lesson).progress
  assert(a2CheckpointAvailable(progress))
  for (const lesson of vidaLessons) {
    const partial = { ...progress, completedLessons: { ...progress.completedLessons } }
    delete partial.completedLessons[lesson.id]
    assert(!a2CheckpointAvailable(partial))
  }
  for (let i = 0; i < 30; i++) {
    const checkpoint = resolveLesson('checkpoint-A2', progress)
    assert.equal(checkpoint.exercises.length, 16)
    assert.equal(new Set(checkpoint.exercises.map((e) => e.id)).size, 16)
    assert.equal(Math.ceil(checkpoint.exercises.length * CHECKPOINT_PASS), 12)
    assert.equal(checkpoint.exercises.filter((e) => e.id.startsWith('a2-text-')).length, 3)
    assert(!checkpoint.exercises.some((e) => e.type === 'pronunciation'))
  }
  assert.equal(realTexts.length, 6)
  for (const text of realTexts) {
    const quiz = resolveLesson(`text-${text.id}`, progress)
    assert.equal(quiz.exercises.length, 3)
    assert(quiz.exercises.every((e) => e.prompt.includes(text.text)))
    const done = completeLesson(progress, quiz).progress
    assert.equal(Object.keys(done.completedLessons).length, Object.keys(progress.completedLessons).length)
  }
  const a1Progress = { ...emptyProgress, completedLessons: Object.fromEntries(lessons.filter((l) => l.destinationId === 'braga').slice(0, 3).map((l) => [l.id, '2026-11-04'])) }
  assert.equal(resolveLesson('checkpoint-A1', a1Progress).exercises.length, 12)
  assert.equal(resolveLesson('text-missing', progress), undefined)
  const merged = mergeProgress({ ...progress, certificates: { A2: '2026-11-04' } }, { ...emptyProgress, certificates: { A1: '2026-11-03' } })
  assert.deepEqual(merged.certificates, { A1: '2026-11-03', A2: '2026-11-04' })
  assert(newlyUnlocked(merged).some((a) => a.id === 'a2-explorer'))
  console.log('Milestone 5: content, unlock boundaries, 30 balanced checkpoints, reading, SRS and certificate sync passed.')
} finally {
  await server.close()
}
