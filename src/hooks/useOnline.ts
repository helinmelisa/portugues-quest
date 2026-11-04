import { useSyncExternalStore } from 'react'
const subscribe = (change: () => void) => {
  window.addEventListener('online', change)
  window.addEventListener('offline', change)
  return () => { window.removeEventListener('online', change); window.removeEventListener('offline', change) }
}
export const useOnline = () => useSyncExternalStore(subscribe, () => navigator.onLine, () => true)
