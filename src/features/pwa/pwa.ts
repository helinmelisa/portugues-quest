import { useSyncExternalStore } from 'react'
let state = { waiting: false, ready: false, updating: false, error: '' }
let registration: ServiceWorkerRegistration | undefined
let busy = false
const listeners = new Set<() => void>()
const set = (next: Partial<typeof state>) => { state = { ...state, ...next }; for (const fn of listeners) fn() }
const subscribe = (fn: () => void) => { listeners.add(fn); return () => { listeners.delete(fn) } }
export const usePwa = () => useSyncExternalStore(subscribe, () => state)
export const setUpdateBusy = (value: boolean) => { busy = value }
export function installWorker() {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (state.updating) location.reload() })
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data?.type === 'UPDATE_CHECK') {
      const safe = !busy
      if (safe) set({ updating: true })
      event.source?.postMessage({ type: 'UPDATE_READY', token: event.data.token, safe })
    } else if (event.data?.type === 'UPDATE_BLOCKED') set({ updating: false, error: 'Finish lessons and calls in other open tabs, then try updating again.' })
  })
  navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' }).then((reg) => {
    registration = reg
    set({ ready: !!reg.active, waiting: !!reg.waiting })
    reg.addEventListener('updatefound', () => {
      const worker = reg.installing
      worker?.addEventListener('statechange', () => {
        if (worker.state === 'installed') set({ ready: true, waiting: !!navigator.serviceWorker.controller })
      })
    })
    window.addEventListener('online', () => { void reg.update().catch(() => {}) })
  }).catch(() => set({ error: 'Offline preparation failed. Reconnect and reopen the app to try again.' }))
}
export function updateApp() {
  if (busy || !registration?.waiting) return
  set({ error: '', updating: true })
  registration.waiting.postMessage({ type: 'ACTIVATE_UPDATE' })
}
