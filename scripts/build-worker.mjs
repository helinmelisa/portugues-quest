import { createHash } from 'node:crypto'
import { readdir, readFile, writeFile } from 'node:fs/promises'

// Only public, bundled assets enter the worker cache. Auth and API traffic never do.
const assets = (await readdir('dist/assets')).filter((name) => /\.(js|css|woff2?|png|svg)$/.test(name)).map((name) => `/assets/${name}`)
const precache = ['/index.html', '/manifest.webmanifest', '/icon-192.png', '/icon-512.png', '/apple-touch-icon.png', ...assets]
const hash = createHash('sha256')
for (const asset of precache) hash.update(await readFile(`dist${asset}`))
const version = hash.digest('hex').slice(0, 12)
const template = await readFile('scripts/worker-template.js', 'utf8')
await writeFile('dist/sw.js', template.replace('__VERSION__', version).replace('__PRECACHE__', JSON.stringify(precache)))
console.log(`Offline cache ${version}: ${precache.length} public assets`)
