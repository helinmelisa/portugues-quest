import assert from 'node:assert/strict'
import { createServer } from 'vite'
let session = { user: { id: 'alice' }, access_token: 'test-alice-token' }
const requests = []
globalThis.syncTestSupabase = {
  auth: { getSession: async () => ({ data: { session }, error: null }) },
  rpc: (_name, body) => {
    session = { user: { id: 'bob' }, access_token: 'test-bob-token' }
    return { setHeader: async (name, value) => { requests.push({ name, value, body }); return { data: { accepted: true }, error: null } } }
  },
}
const server = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true, ws: false }, appType: 'custom', plugins: [{ name: 'sync-identity-fixture', enforce: 'pre', resolveId(id, importer) { if (id === './supabase' && importer?.endsWith('/services/cloud.ts')) return '\0sync-identity-fixture' }, load(id) { if (id === '\0sync-identity-fixture') return 'export const supabase = globalThis.syncTestSupabase' } }] })
try {
  const { cloud } = await server.ssrLoadModule('/src/services/cloud.ts')
  const snapshot = { progress: { xp: 30 }, profile: {} }
  await cloud.commit('alice', 0, ['activity'], snapshot)
  assert.equal(requests[0].value, 'Bearer test-alice-token', 'an in-flight request keeps its original account identity')
  await assert.rejects(cloud.commit('alice', 0, ['activity'], snapshot), /Account changed/)
  assert.equal(requests.length, 1, 'a session that already switched cannot submit another account’s queue')
  session = null
  await assert.rejects(cloud.commit('alice', 0, ['activity'], snapshot), /Account changed/)
  console.log('Sync identity: token pinned during switch; wrong or missing account refuses submission.')
} finally { await server.close(); delete globalThis.syncTestSupabase }
