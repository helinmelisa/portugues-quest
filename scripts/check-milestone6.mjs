import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createServer } from 'vite'

class MemoryStorage {
  data = new Map()
  get length() { return this.data.size }
  key(i) { return [...this.data.keys()][i] ?? null }
  getItem(k) { return this.data.get(k) ?? null }
  setItem(k, v) { this.data.set(k, String(v)) }
  removeItem(k) { this.data.delete(k) }
}
const server = await createServer({ server: { middlewareMode: true, ws: false }, appType: 'custom' })
try {
  const { LearningStore, freshData } = await server.ssrLoadModule('/src/features/sync/learningStore.ts')
  const { applyActivities, changesBetween } = await server.ssrLoadModule('/src/features/sync/changes.ts')
  const { synchronize } = await server.ssrLoadModule('/src/features/sync/synchronize.ts')
  const { completeLesson } = await server.ssrLoadModule('/src/features/progress/progress.ts')
  const { getLesson } = await server.ssrLoadModule('/src/data/curriculum/index.ts')
  const make = (disk = new MemoryStorage()) => { const s = new LearningStore(disk); s.select('alice'); return s }
  const one = make(), two = make()
  let remote = { ...freshData(), revision: 0 }
  const receipts = new Set()
  let failAfterCommit = false
  const api = {
    pull: async () => structuredClone(remote),
    commit: async (revision, ids, data) => {
      const duplicate = ids.filter((id) => receipts.has(id))
      if (revision !== remote.revision || duplicate.length) return { accepted: false, applied: duplicate, snapshot: structuredClone(remote) }
      ids.forEach((id) => receipts.add(id))
      remote = { ...structuredClone(data), revision: remote.revision + 1 }
      if (failAfterCommit) { failAfterCommit = false; throw new Error('Connection lost after server commit') }
      return { accepted: true, applied: ids, snapshot: structuredClone(remote) }
    },
  }
  const sync = (store, current = () => true) => synchronize(store, api, current)
  const learn = (store, id) => {
    const data = store.getSnapshot()
    store.update({ ...data, progress: completeLesson(data.progress, getLesson(id)).progress })
  }
  learn(one, 'vida-papers'); learn(two, 'vida-renting')
  await Promise.all([sync(one), sync(two)])
  assert(remote.progress.completedLessons['vida-papers'])
  assert(remote.progress.completedLessons['vida-renting'])
  assert.equal(remote.progress.xp, 60, 'two offline devices retain both activities')
  await sync(one)
  assert.equal(one.getSnapshot().progress.xp, 60)
  const disk = new MemoryStorage(), beforeCrash = make(disk)
  beforeCrash.accept(remote)
  learn(beforeCrash, 'vida-bank')
  failAfterCommit = true
  await assert.rejects(sync(beforeCrash))
  assert.equal(beforeCrash.pending().length, 1)
  const reopened = make(disk)
  await sync(reopened)
  assert.equal(remote.progress.xp, 90, 'ambiguous retry is acknowledged without a second award')
  assert.equal(reopened.pending().length, 0)
  reopened.select('bob')
  assert.equal(reopened.getSnapshot().progress.xp, 0, 'account switch never inherits Alice')
  learn(reopened, 'vida-work')
  reopened.select('alice')
  assert.equal(reopened.getSnapshot().progress.xp, 90)
  assert.equal(reopened.pending().length, 0, 'another account’s pending work is isolated')
  const a = make(disk), b = make(disk)
  learn(a, 'vida-health'); learn(b, 'vida-utilities')
  assert.equal(a.pending().length, 2, 'two tabs retain separate durable event keys')
  await Promise.all([sync(a), sync(b)])
  assert.equal(remote.progress.xp, 150)
  a.update({ ...a.getSnapshot(), profile: { ...a.getSnapshot().profile, name: 'Ana' } })
  await sync(a)
  b.update({ ...b.getSnapshot(), profile: { ...b.getSnapshot().profile, dailyGoalMinutes: 15 } })
  await sync(b)
  assert.equal(remote.profile.name, 'Ana', 'a stale profile does not erase an unrelated field')
  assert.equal(remote.profile.dailyGoalMinutes, 15)
  a.accept(remote)
  a.update({ ...a.getSnapshot(), progress: { ...a.getSnapshot().progress, mistakes: [{ id: 'm1', said: 'x', better: 'y', why: 'z', date: '2026-11-04' }], difficultWords: ['word'] } })
  await sync(a); b.accept(remote)
  b.update({ ...b.getSnapshot(), progress: { ...b.getSnapshot().progress, mistakes: [], difficultWords: [] } })
  await sync(b); await sync(a)
  assert.equal(a.getSnapshot().progress.mistakes.length, 0, 'deleted corrections stay deleted on refresh')
  assert.equal(a.getSnapshot().progress.difficultWords.length, 0)
  const cancelled = make()
  learn(cancelled, 'vida-work')
  let sent = false
  await synchronize(cancelled, { pull: api.pull, commit: async () => { sent = true; throw new Error('must not send') } }, () => false)
  assert(!sent, 'late responses do not sync after switching accounts')
  const quota = new MemoryStorage()
  quota.setItem = () => { throw new Error('QuotaExceededError') }
  const limited = make(quota)
  learn(limited, 'vida-bank')
  assert(limited.persistenceError)
  assert.equal(limited.pending().length, 1, 'storage failure retains an in-session retry')
  await sync(limited)
  const earlier = freshData()
  earlier.progress.certificates.A2 = '2026-11-03'
  const later = freshData()
  later.progress.certificates.A2 = '2026-11-04'
  assert.equal(applyActivities(earlier, [{ id: 'test', createdAt: '', changes: changesBetween(freshData(), later) }]).progress.certificates.A2, '2026-11-03')
  const reviewed = freshData()
  reviewed.progress.reviews.word = { due: '2026-11-08', interval: 4, ease: 2.5 }
  assert(changesBetween(freshData(), reviewed).some((c) => c.path.join('.') === 'progress.reviews.word' && c.kind === 'set'))
  const manifest = JSON.parse(await readFile('public/manifest.webmanifest', 'utf8'))
  assert.equal(manifest.display, 'standalone')
  assert.equal(manifest.start_url, '/app')
  for (const icon of manifest.icons) assert((await readFile(`public${icon.src}`)).length > 100)
  const worker = await readFile('dist/sw.js', 'utf8')
  assert(!worker.includes('__PRECACHE__'))
  console.log('Milestone 6: concurrent devices, ambiguous retries, reopen, account isolation, tabs, profile edits, removals, quota, install assets passed.')
} finally { await server.close() }
