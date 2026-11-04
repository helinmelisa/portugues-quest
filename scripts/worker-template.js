/* Public assets only. Account data and tokens stay outside Cache Storage. */
const CACHE = 'pq-shell-__VERSION__'
const PRECACHE = __PRECACHE__
const ASSETS = new Set(PRECACHE)
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)))
})
// Do not skip waiting: open lessons and calls must finish on their existing version.
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith('pq-shell-') && key !== CACHE).map((key) => caches.delete(key)))))
})
const checks = new Map()
self.addEventListener('message', (event) => {
  if (event.data?.type === 'UPDATE_READY') {
    const check = checks.get(event.data.token)
    if (check && event.source?.id) check.set(event.source.id, event.data.safe === true)
  }
  if (event.data?.type === 'ACTIVATE_UPDATE') event.waitUntil((async () => {
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    const token = crypto.randomUUID()
    const replies = new Map()
    checks.set(token, replies)
    for (const client of clients) client.postMessage({ type: 'UPDATE_CHECK', token })
    await new Promise((resolve) => setTimeout(resolve, 1200))
    checks.delete(token)
    if (clients.every((client) => replies.get(client.id) === true)) await self.skipWaiting()
    else for (const client of clients) client.postMessage({ type: 'UPDATE_BLOCKED' })
  })())
})
self.addEventListener('fetch', (event) => {
  const request = event.request
  const url = new URL(request.url)
  if (request.method !== 'GET' || url.origin !== self.location.origin) return
  // Never handle callbacks containing credentials, nor APIs, even on our origin.
  if (url.search || /\/(auth|api|functions)\//.test(url.pathname)) return
  if (request.mode === 'navigate') {
    event.respondWith(caches.open(CACHE).then(async (cache) => {
      const shell = await cache.match('/index.html')
      if (shell) return shell
      try { return await fetch(request) } catch {
        return new Response('You are offline and this app is not cached. Reconnect and reopen Português Quest.', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
      }
    }))
  } else if (ASSETS.has(url.pathname)) {
    event.respondWith(caches.open(CACHE).then(async (cache) => (await cache.match(url.pathname)) ?? fetch(request)))
  }
})
