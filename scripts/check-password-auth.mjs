import assert from 'node:assert/strict'
import { createServer } from 'vite'
const calls = []
let error = null, confirmed = false
const method = (name) => async (...args) => { calls.push({ name, args }); return { error, data: { session: confirmed ? { user: { id: 'existing-account' } } : null } } }
globalThis.passwordAuthFixture = { auth: { signInWithPassword: method('password'), signInWithOtp: method('magic'), signUp: method('signup'), resetPasswordForEmail: method('reset'), updateUser: method('update') } }
globalThis.window = { location: { origin: 'https://quest.test' } }
const server = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true, ws: false }, appType: 'custom', plugins: [{ name: 'password-auth-fixture', enforce: 'pre', resolveId(id, importer) { if (id === './supabase' && importer?.endsWith('/services/cloud.ts')) return '\0password-auth-fixture' }, load(id) { if (id === '\0password-auth-fixture') return 'export const supabase = globalThis.passwordAuthFixture' } }] })
try {
  const { cloud } = await server.ssrLoadModule('/src/services/cloud.ts')
  // These are synthetic fixture credentials; no network or real account is involved.
  assert.equal(await cloud.signInPassword('fixture@example.test', 'fixture-password'), null)
  assert.deepEqual(calls.at(-1), { name: 'password', args: [{ email: 'fixture@example.test', password: 'fixture-password' }] })
  assert(!calls.some((c) => c.name === 'magic'), 'password sign-in never sends an email link')
  error = { message: 'invalid login credentials' }
  assert.match(await cloud.signInPassword('fixture@example.test', 'wrong'), /Check your email and password/)
  error = null
  assert((await cloud.signUp('fixture@example.test', 'fixture-password')).confirmationRequired)
  confirmed = true
  assert(!(await cloud.signUp('fixture@example.test', 'fixture-password')).confirmationRequired)
  await cloud.resetPassword('fixture@example.test')
  assert.deepEqual(calls.at(-1).args, ['fixture@example.test', { redirectTo: 'https://quest.test/app' }])
  await cloud.setPassword('new-fixture-password')
  assert.deepEqual(calls.at(-1), { name: 'update', args: [{ password: 'new-fixture-password' }] }, 'password setup updates the existing identity rather than creating another account')
  error = { message: 'Password is too weak' }
  assert.equal(await cloud.setPassword('weak'), 'Password is too weak')
  console.log('Password auth: direct sign-in, error handling, confirmation, recovery callback and existing-account setup passed.')
} finally { await server.close(); delete globalThis.passwordAuthFixture; delete globalThis.window }
