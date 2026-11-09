import assert from 'node:assert/strict'
import vm from 'node:vm'
import { readFile } from 'node:fs/promises'
const handlers = new Map(), entries = new Map(), deleted = []
let offline = false, skipped = false, safe = true
const client = { id: 'one', postMessage(data) { if (data.type === 'UPDATE_CHECK') handlers.get('message')({ data: { type: 'UPDATE_READY', token: data.token, safe }, source: client }) } }
const cache = { addAll: async (paths) => { for (const path of paths) entries.set(path, new Response(path === '/index.html' ? 'cached shell' : path)) }, match: async (key) => entries.get(key)?.clone() }
const self = { location: { origin: 'https://quest.test' }, addEventListener: (type, fn) => handlers.set(type, fn), clients: { matchAll: async () => [client] }, skipWaiting: async () => { skipped = true } }
vm.runInNewContext(await readFile('dist/sw.js', 'utf8'), { self, caches: { open: async () => cache, keys: async () => ['pq-shell-obsolete', 'unrelated-app'], delete: async (k) => deleted.push(k) }, URL, Response, Set, Map, crypto, setTimeout: (fn) => queueMicrotask(fn), fetch: async () => { if (offline) throw new Error('offline'); return new Response('network') } })
const lifecycle = async (type, data) => { let promise; handlers.get(type)({ data, waitUntil: (p) => { promise = p } }); await promise }
await lifecycle('install')
assert(entries.has('/index.html'))
assert([...entries.keys()].every((key) => !key.includes('supabase') && !key.includes('token')))
const request = async (path, mode = 'navigate', method = 'GET') => { let response; handlers.get('fetch')({ request: { url: new URL(path, self.location.origin).href, mode, method }, respondWith: (p) => { response = p } }); return response ? (await response).text() : undefined }
offline = true
assert.equal(await request('/app/practice/grammar'), 'cached shell')
assert.equal(await request('/auth/callback?token=secret'), undefined, 'auth callbacks bypass Cache Storage')
assert.equal(await request('/api/private'), undefined)
assert.equal(await request('https://example.supabase.co/rest/v1/user_data'), undefined)
assert.equal(await request('/app', 'navigate', 'POST'), undefined)
await lifecycle('activate')
assert.deepEqual(deleted, ['pq-shell-obsolete'], 'other apps’ caches are preserved')
safe = false
await lifecycle('message', { type: 'ACTIVATE_UPDATE' })
assert(!skipped, 'an active lesson in another tab prevents activation')
safe = true
await lifecycle('message', { type: 'ACTIVATE_UPDATE' })
assert(skipped, 'activation follows explicit consent and idle clients')
entries.delete('/index.html')
assert((await request('/app')).includes('Reconnect'), 'evicted caches have a recovery message')
console.log('Worker: offline routes, API/auth exclusions, cache eviction and cross-tab updates passed.')

let notification
self.registration = { showNotification: async (title, options) => { notification = {title,options} } }
await lifecycle('push', {json:()=>({title:'Practice',body:'Five minutes',url:'https://untrusted.test'})})
assert.equal(notification.title,'Practice')
assert.equal(notification.options.tag,'pq-daily-reminder')
let opened,closed=false
self.clients.matchAll=async()=>[]
self.clients.openWindow=async(path)=>{opened=path}
let pending
handlers.get('notificationclick')({notification:{close:()=>{closed=true},data:{url:'https://untrusted.test'}},waitUntil:(p)=>{pending=p}})
await pending
assert(closed)
assert.equal(opened,'/app','notification clicks never navigate to payload URLs')
console.log('Worker reminders: generic notification and same-origin click target passed.')
