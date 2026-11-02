// Thin wrapper around localStorage so it can be swapped for Supabase later.
const PREFIX = 'pq:v1:'

export const storage = {
  load<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(PREFIX + key)
      return raw ? { ...fallback, ...JSON.parse(raw) } : fallback
    } catch {
      return fallback
    }
  },
  save<T>(key: string, value: T) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value))
    } catch {
      // Storage full or blocked: progress just won't persist this session.
    }
  },
}
