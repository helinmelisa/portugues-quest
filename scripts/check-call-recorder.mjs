import assert from 'node:assert/strict'
import { createServer } from 'vite'

// A minimal hook host lets the real recorder run against controlled browser media.
const server = await createServer({
  configFile: false, optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true, ws: false }, appType: 'custom',
  resolve: { alias: { react: '/__hook-host.js' } },
  plugins: [{ name: 'recorder-hook-host', enforce: 'pre',
    resolveId(id) { if (id === '/__hook-host.js') return '\0hook-host' },
    load(id) { if (id === '\0hook-host') return `export const useRef = (current) => ({ current }); export const useState = (v) => [v, () => {}]; export const useEffect = (fn) => { const cleanup = fn(); if (cleanup) globalThis.hookCleanups.push(cleanup) }` },
  }],
})
let now = 0, level = 0, stopped = 0, recordings = [], errors = []
const timers = new Map()
let timerId = 0
const originalNow = Date.now
const originalNavigator = Object.getOwnPropertyDescriptor(globalThis, 'navigator')
Date.now = () => now
globalThis.window = { setInterval: (fn) => { timers.set(++timerId, fn); return timerId }, clearInterval: (id) => timers.delete(id) }
globalThis.hookCleanups = []
const stream = () => ({ getTracks: () => [{ stop: () => stopped++ }] })
Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { mediaDevices: { getUserMedia: async () => stream() } } })
globalThis.AudioContext = class {
  state = 'running'
  resume() { return Promise.resolve() }
  close() { this.state = 'closed'; return Promise.resolve() }
  createMediaStreamSource() { return { connect() {} } }
  createAnalyser() { return { fftSize: 2048, getFloatTimeDomainData: (data) => data.fill(level) } }
}
globalThis.MediaRecorder = class {
  static instances = []
  static isTypeSupported() { return true }
  state = 'inactive'
  mimeType = 'audio/webm'
  constructor() { MediaRecorder.instances.push(this) }
  start() { this.state = 'recording' }
  stop() { this.state = 'inactive'; this.ondataavailable?.({ data: new Blob(['audio']) }); this.onstop?.() }
}
const tick = (ms, volume) => { now += ms; level = volume; for (const fn of [...timers.values()]) fn() }
try {
  const { useCallRecorder: mountRecorder } = await server.ssrLoadModule('/src/hooks/useCallRecorder.ts')
  const hook = mountRecorder((blob) => recordings.push(blob), (error) => errors.push(error))
  await hook.start()
  tick(100, 0.1)
  tick(1700, 0)
  assert.equal(recordings.length, 1, 'speech followed by silence sends exactly one turn')
  assert.equal(errors.length, 0)
  assert.equal(timers.size, 0)
  assert(stopped > 0, 'microphone released after a turn')
  await hook.start()
  tick(10100, 0)
  assert.equal(recordings.length, 1, 'silence alone never uploads audio')
  assert.equal(errors.length, 1)
  await hook.start()
  tick(100, 0.1)
  hook.cancel()
  tick(2000, 0)
  assert.equal(recordings.length, 1, 'pause discards unfinished audio')
  assert.equal(timers.size, 0)
  let grant
  navigator.mediaDevices.getUserMedia = () => new Promise((resolve) => { grant = resolve })
  const starting = hook.start()
  const before = MediaRecorder.instances.length
  hook.cancel()
  grant(stream())
  await starting
  assert.equal(MediaRecorder.instances.length, before, 'late permission cannot restart a paused call')
  navigator.mediaDevices.getUserMedia = async () => { throw new Error('denied') }
  await hook.start()
  assert.equal(errors.length, 2, 'permission failure is recoverable')
  navigator.mediaDevices.getUserMedia = async () => stream()
  await hook.start()
  for (const cleanup of hookCleanups) cleanup()
  assert.equal(timers.size, 0, 'unmount removes silence timers')
  assert.equal(MediaRecorder.instances.at(-1).state, 'inactive', 'unmount stops recording')
  assert.equal(recordings.length, 1, 'unmount never uploads a final recording')
  console.log('Call recorder: speech, silence, pause, late permission, denial and unmount passed.')
} finally {
  Date.now = originalNow
  if (originalNavigator) Object.defineProperty(globalThis, 'navigator', originalNavigator)
  await server.close()
}
