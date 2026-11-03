// Inês, the AI tutor. Calls Groq with a European Portuguese role-play prompt.
// Secrets: GROQ_API_KEY (required), GROQ_MODEL (optional).
import { createClient } from 'npm:@supabase/supabase-js@2'

const DAILY_LIMIT = 50
const MODEL = Deno.env.get('GROQ_MODEL') ?? 'openai/gpt-oss-120b'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } })

async function transcribe(audio: string, mimeType: string) {
  if (!audio || audio.length > 2_000_000) return json({ error: 'That recording is too long. Try a shorter one.' }, 413)
  const bytes = Uint8Array.from(atob(audio), (c) => c.charCodeAt(0))
  const ext = mimeType.includes('mp4') ? 'mp4' : mimeType.includes('ogg') ? 'ogg' : 'webm'
  const form = new FormData()
  form.append('file', new Blob([bytes], { type: mimeType }), `speech.${ext}`)
  form.append('model', 'whisper-large-v3-turbo')
  form.append('language', 'pt')
  form.append('response_format', 'json')
  const res = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${Deno.env.get('GROQ_API_KEY')}` },
    body: form,
  })
  if (!res.ok) {
    console.error('Whisper error', res.status, await res.text())
    return json({ error: 'Couldn’t understand the recording. Try again?' }, 502)
  }
  const { text } = await res.json()
  return json({ text: String(text ?? '').trim() })
}

const levelGuide: Record<string, string> = {
  A0: 'The learner is a complete beginner. Use very short sentences (max 10 words), only basic everyday words, present tense.',
  A1: 'The learner knows the basics. Use short, simple sentences (max 15 words), common vocabulary, mostly present tense.',
}

function systemPrompt(setting: string, level: string) {
  return `You are Inês, a warm, friendly young woman from Lisboa helping someone practise Portuguese through role-play.

SCENE: ${setting}
LEVEL: ${levelGuide[level] ?? levelGuide.A0}

LANGUAGE RULES (very important):
- Speak ONLY European Portuguese (Portugal), never Brazilian Portuguese.
- Use "tu" with peers, "o senhor / a senhora" for polite address. Avoid "você".
- Put clitic pronouns after the verb in affirmative sentences: "chamo-me", "levanto-me" (not "me chamo").
- Use "estar a + infinitive" ("estou a trabalhar"), never the gerund ("estou trabalhando").
- Portuguese vocabulary: autocarro, comboio, telemóvel, pequeno-almoço, casa de banho, gelado, sumo, ementa, fixe, perceber, cêntimos, multibanco, rapariga.

BEHAVIOUR:
- Stay in character for the scene. Reply in 1–2 short sentences and usually end with a question so the learner keeps talking.
- If the learner makes a mistake, keep the conversation going but add a short, kind correction in English in "tip", including the corrected Portuguese.
- If they used a Brazilian form, mention the Portuguese one in "tip".
- If the learner writes in English, help them say it in Portuguese (in "tip") and reply simply.
- Never use complicated grammar or long explanations.

Respond ONLY with JSON in this exact shape:
{"reply": "<your Portuguese line>", "translation": "<English translation of reply>", "tip": "<short English tip or null>", "suggestions": ["<short Portuguese reply the learner could give>", "<another>"]}`
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const token = (req.headers.get('Authorization') ?? '').replace('Bearer ', '')
  const { data: { user } } = await admin.auth.getUser(token)
  if (!user) return json({ error: 'Please sign in to chat with Inês.' }, 401)

  const body = await req.json().catch(() => ({}))
  if (body.action === 'transcribe') return transcribe(String(body.audio ?? ''), String(body.mimeType ?? 'audio/webm'))

  const day = new Date().toISOString().slice(0, 10)
  const { data: usage } = await admin.from('tutor_usage').select('count').eq('user_id', user.id).eq('day', day).maybeSingle()
  const count = usage?.count ?? 0
  if (count >= DAILY_LIMIT) return json({ error: `You’ve reached today’s ${DAILY_LIMIT} messages with Inês. Até amanhã!` }, 429)
  await admin.from('tutor_usage').upsert({ user_id: user.id, day, count: count + 1 })

  const setting = String(body.setting ?? 'A casual chat.').slice(0, 400)
  const level = String(body.level ?? 'A0')
  const history = (Array.isArray(body.messages) ? body.messages : [])
    .filter((m: { role?: string }) => m.role === 'user' || m.role === 'assistant')
    .slice(-12)
    .map((m: { role: string; content: unknown }) => ({ role: m.role, content: String(m.content).slice(0, 500) }))
  if (history.length === 0) history.push({ role: 'user', content: '(Start the role-play now with a greeting that fits the scene.)' })

  const groq = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${Deno.env.get('GROQ_API_KEY')}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.7,
      max_tokens: 1000,
      reasoning_effort: 'low',
      response_format: { type: 'json_object' },
      messages: [{ role: 'system', content: systemPrompt(setting, level) }, ...history],
    }),
  })
  if (!groq.ok) {
    console.error('Groq error', groq.status, await groq.text())
    return json({ error: 'Inês is taking a little break. Try again in a moment.' }, 502)
  }

  try {
    // Some models use non-breaking hyphens (bem‑vindo); normalise them.
    const content = JSON.parse((await groq.json()).choices[0].message.content.replace(/\u2011/g, '-'))
    return json({
      reply: String(content.reply ?? ''),
      translation: content.translation ? String(content.translation) : undefined,
      tip: content.tip ? String(content.tip) : undefined,
      suggestions: Array.isArray(content.suggestions) ? content.suggestions.slice(0, 3).map(String) : [],
    })
  } catch {
    return json({ error: 'Inês got a bit confused. Try saying that another way.' }, 502)
  }
})
