import type { UserData } from '../../services/cloud'

type Json = null | boolean | number | string | Json[] | { [key: string]: Json }
export interface Change {
  path: string[]
  kind: 'set' | 'remove' | 'add' | 'member' | 'first'
  value?: Json
  key?: string
}
export interface PendingActivity {
  id: string
  createdAt: string
  changes: Change[]
}

const equal = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b)
const additive = (path: string[]) => path[0] === 'progress' &&
  (['xp', 'conversations'].includes(path[1]) || ['minutesByDay', 'activityByDay'].includes(path[1]))
const identity = (item: Json) => typeof item === 'object' && item !== null && !Array.isArray(item) ? String(item.id) : String(item)

// Counters add; keyed collections merge by item; settings and individual reviews use last accepted edit.
export function changesBetween(before: UserData, after: UserData): Change[] {
  const changes: Change[] = []
  const visit = (a: Json | undefined, b: Json | undefined, path: string[]) => {
    if (equal(a, b)) return
    if (b === undefined) { changes.push({ kind: 'remove', path }); return }
    if (path[0] === 'progress' && ['completedLessons', 'certificates'].includes(path[1]) && path.length === 3) {
      changes.push({ kind: 'first', path, value: b })
    } else if (path[0] === 'progress' && ['reviews', 'writingDrafts'].includes(path[1]) && path.length === 3) {
      changes.push({ kind: 'set', path, value: b })
    } else if (typeof b === 'number' && additive(path)) {
      changes.push({ kind: 'add', path, value: b - (typeof a === 'number' ? a : 0) })
    } else if (Array.isArray(b)) {
      const old = Array.isArray(a) ? a : []
      const keys = new Set(b.map(identity))
      for (const item of old) if (!keys.has(identity(item))) changes.push({ kind: 'member', path, key: identity(item) })
      for (const item of b) if (!old.some((o) => identity(o) === identity(item) && equal(o, item))) changes.push({ kind: 'member', path, key: identity(item), value: item })
    } else if (b !== null && typeof b === 'object') {
      const old = a && typeof a === 'object' && !Array.isArray(a) ? a : {}
      for (const key of new Set([...Object.keys(old), ...Object.keys(b)])) visit(old[key], b[key], [...path, key])
    } else changes.push({ kind: 'set', path, value: b })
  }
  visit(before as unknown as Json, after as unknown as Json, [])
  return changes
}

export function applyActivities(data: UserData, activities: PendingActivity[]): UserData {
  const next = structuredClone(data) as unknown as Record<string, Json>
  for (const activity of activities) for (const change of activity.changes) {
    if (!change.path.length || change.path.some((p) => ['__proto__', 'constructor', 'prototype'].includes(p))) continue
    let parent = next
    for (const part of change.path.slice(0, -1)) {
      const value = parent[part]
      if (!value || typeof value !== 'object' || Array.isArray(value)) parent[part] = {}
      parent = parent[part] as Record<string, Json>
    }
    const key = change.path.at(-1)!
    if (change.kind === 'remove') delete parent[key]
    else if (change.kind === 'first') {
      if (!parent[key] || String(change.value) < String(parent[key])) parent[key] = change.value!
    } else if (change.kind === 'add') parent[key] = Number(parent[key] ?? 0) + Number(change.value)
    else if (change.kind === 'member') {
      const values = Array.isArray(parent[key]) ? parent[key] : []
      parent[key] = [...values.filter((v) => identity(v) !== change.key), ...(change.value === undefined ? [] : [change.value])]
    } else parent[key] = structuredClone(change.value!)
  }
  return next as unknown as UserData
}
