import assert from 'node:assert/strict'
import { createServer } from 'vite'

const server = await createServer({ server: { middlewareMode: true, ws: false }, appType: 'custom' })
try {
  const { emptyProgress } = await server.ssrLoadModule('/src/features/progress/progress.ts')
  const { journey, nextJourneyLesson, followingDestination } = await server.ssrLoadModule('/src/features/progress/journey.ts')
  const progress = structuredClone(emptyProgress)
  assert.equal(nextJourneyLesson(progress).destination.id, 'lisboa')
  for (const destination of journey) {
    assert.equal(nextJourneyLesson(progress).destination.id, destination.id)
    for (const id of destination.lessonIds) progress.completedLessons[id] = new Date().toISOString()
    assert.notEqual(nextJourneyLesson(progress)?.destination.id, destination.id)
  }
  assert.equal(nextJourneyLesson(progress), undefined)
  assert.equal(followingDestination('lisboa').id, 'porto')
  assert.equal(followingDestination('madeira'), undefined)
  assert.equal(followingDestination('unknown'), undefined)
  console.log('Journey checks passed: all eight stops, Lisboa → Porto, completed route and unknown destinations.')
} finally { await server.close() }
