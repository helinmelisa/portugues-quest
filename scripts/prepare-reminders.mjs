import { createECDH, randomBytes } from 'node:crypto'
import { access, mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

// Run locally. Secrets stay in ignored, owner-readable files; nothing secret is printed or committed.
const directory = resolve('.local-reminders')
for (const name of ['reminders.env', 'schedule.sql']) {
  try { await access(resolve(directory, name)); throw new Error(`Setup file already exists: ${name}. Keep the existing keys.`) }
  catch (error) { if (error.code !== 'ENOENT') throw error }
}
const key = createECDH('prime256v1')
key.generateKeys()
const publicKey = key.getPublicKey().toString('base64url')
const privateKey = key.getPrivateKey().toString('base64url')
const cronSecret = randomBytes(32).toString('base64url')
await mkdir(directory, { recursive: true, mode: 0o700 })
await writeFile(resolve(directory, 'reminders.env'), `VAPID_PUBLIC_KEY=${publicKey}\nVAPID_PRIVATE_KEY=${privateKey}\nVAPID_SUBJECT=https://portugues-quest.vercel.app\nREMINDER_CRON_SECRET=${cronSecret}\n`, { mode: 0o600, flag: 'wx' })
await writeFile(resolve(directory, 'schedule.sql'), `-- Run once in the Supabase SQL editor after deploying the reminders function.\ncreate extension if not exists pg_cron;\ncreate extension if not exists pg_net with schema extensions;\nselect vault.create_secret('${cronSecret}', 'pq_reminder_cron_secret');\nselect cron.schedule('pq-daily-reminders', '*/10 * * * *', $$\n  select net.http_post(\n    url := 'https://embwiettleplfacmudzj.supabase.co/functions/v1/reminders',\n    headers := jsonb_build_object('Content-Type', 'application/json', 'x-reminder-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'pq_reminder_cron_secret' limit 1)),\n    body := '{"action":"send"}'::jsonb\n  );\n$$);\n`, { mode: 0o600, flag: 'wx' })
console.log('Created private setup files in .local-reminders. Keep reminders.env and schedule.sql out of Git and chat.')
console.log('Next: supabase secrets set --env-file .local-reminders/reminders.env --project-ref embwiettleplfacmudzj')
console.log('Then: supabase functions deploy reminders --no-verify-jwt --project-ref embwiettleplfacmudzj')
console.log('Finally, run .local-reminders/schedule.sql in the project SQL editor. The function authenticates users for config and requires the separate cron secret for delivery.')
