import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm, stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { execFileSync } from 'node:child_process'
import { createServer } from 'vite'

const temporary = await mkdtemp(join(tmpdir(), 'pq-reminders-'))
try {
  const script=resolve('scripts/prepare-reminders.mjs')
  execFileSync(process.execPath,[script],{cwd:temporary,stdio:'pipe'})
  const env=await readFile(join(temporary,'.local-reminders/reminders.env'),'utf8')
  assert.equal(env.trim().split('\n').length,4,'environment entries use real newlines')
  assert(!env.includes('\\n'))
  assert.equal((await stat(join(temporary,'.local-reminders/reminders.env'))).mode & 0o777,0o600)
  assert.throws(()=>execFileSync(process.execPath,[script],{cwd:temporary,stdio:'pipe'}),'existing secrets cannot be overwritten')
} finally { await rm(temporary,{recursive:true,force:true}) }
let permission='denied',writes=0,subscribed=0,unsubscribed=0,fail=false,token=null
let session={user:{id:'alice',email:'alice@example.test'},access_token:'alice-token'}
const subscription={endpoint:'https://web.push.apple.com/test',toJSON:()=>({keys:{p256dh:'fixture',auth:'fixture'}}),unsubscribe:async()=>{unsubscribed++;return true}}
const registration={active:true,pushManager:{getSubscription:async()=>null,subscribe:async()=>{subscribed++;return subscription}}}
Object.defineProperty(globalThis,'navigator',{configurable:true,value:{userAgent:'iPhone',platform:'iPhone',maxTouchPoints:1,serviceWorker:{getRegistration:async()=>registration}}})
globalThis.window={PushManager:{},Notification:{},matchMedia:()=>({matches:true})}
globalThis.Notification={requestPermission:async()=>permission}
globalThis.reminderFixture={auth:{getSession:async()=>({data:{session}})},from:()=>({upsert:()=>{writes++;return {setHeader:async(name,value)=>{token=value;return {error:fail?{}:null}}}}})}
const server=await createServer({configFile:false,optimizeDeps:{noDiscovery:true,include:[]},server:{middlewareMode:true,ws:false},appType:'custom',plugins:[{name:'reminder-fixture',enforce:'pre',resolveId(id,importer){if(id==='../../services/supabase'&&importer?.endsWith('/reminders/client.ts'))return '\0reminder-fixture'},load(id){if(id==='\0reminder-fixture')return 'export const supabase=globalThis.reminderFixture'}}]})
try {
  const {enableReminder,installedOnApple,decodePublicKey}=await server.ssrLoadModule('/src/features/reminders/client.ts')
  assert(installedOnApple())
  window.matchMedia=()=>({matches:false});assert(!installedOnApple());window.matchMedia=()=>({matches:true})
  assert.equal(decodePublicKey('AQID').length,3)
  assert.equal(writes,0,'loading the module never asks permission or subscribes')
  await assert.rejects(enableReminder('AQID','20:00','alice@example.test'),/not allowed/)
  assert.equal(subscribed,0)
  permission='granted'
  await assert.rejects(enableReminder('AQID','20:00','bob@example.test'),/account changed/)
  assert.equal(subscribed,0)
  await enableReminder('AQID','20:00','alice@example.test')
  assert.equal(token,'Bearer alice-token')
  fail=true
  await assert.rejects(enableReminder('AQID','20:00','alice@example.test'),/Couldn’t save/)
  assert.equal(unsubscribed,1,'a failed save revokes the new subscription')
  console.log('Reminders: private setup files, non-overwriting keys, opt-in permission, iPhone installation, account pinning and failure cleanup passed.')
} finally {await server.close();delete globalThis.reminderFixture;delete globalThis.window;delete globalThis.Notification;delete globalThis.navigator}
