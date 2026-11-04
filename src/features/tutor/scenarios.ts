import type { Scenario } from './types'

export const scenarios: Scenario[] = [
  {
    id: 'coffee',
    title: 'Ordering coffee',
    description: 'Inês is the empregada at a little café in Porto.',
    level: 'A0',
    setting: 'You are a waitress (empregada) at a small traditional café in Porto. The learner is a customer ordering coffee and maybe a pastry, then paying.',
    steps: [
      {
        tutor: 'Bom dia! O que vai ser?',
        translation: 'Good morning! What will it be?',
        accept: /queria|quero|caf[eé]|gal[aã]o|meia|pastel/i,
        hint: 'Order something with “Queria…” (I would like…).',
        suggestions: ['Queria um café, por favor.', 'Queria um galão, por favor.'],
        tips: [{ match: /quero/i, tip: '“Quero” is understood, but “Queria” sounds much more polite when ordering.' }],
      },
      {
        tutor: 'Muito bem. Mais alguma coisa?',
        translation: 'Very good. Anything else?',
        accept: /n[aã]o|sim|pastel|obrigad|s[oó] isso/i,
        hint: 'Say “Não, obrigado/obrigada” (No, thank you) or order a pastry.',
        suggestions: ['Não, obrigado.', 'Um pastel de nata, por favor.'],
      },
      {
        tutor: 'Com certeza! São um euro e vinte.',
        translation: 'Of course! That’s one euro twenty.',
        accept: /aqui|obrigad|tome|cart[aã]o|multibanco/i,
        hint: 'Hand over the money with “Aqui tem” (Here you go).',
        suggestions: ['Aqui tem. Obrigado!', 'Posso pagar com cartão?'],
        tips: [{ match: /cart[aã]o|multibanco/i, tip: 'Many Portuguese people say “multibanco” for paying by card.' }],
      },
    ],
    farewell: { text: 'Obrigada! Bom dia e até à próxima!', translation: 'Thank you! Have a good day, see you next time!' },
  },
  {
    id: 'introductions',
    title: 'Introducing yourself',
    description: 'Inês is a friendly classmate you meet on your first day.',
    level: 'A0',
    setting: 'You are a university student in Lisboa meeting the learner, a new international classmate, on the first day. Ask their name, where they are from and where they live.',
    steps: [
      {
        tutor: 'Olá! Eu sou a Inês. Como te chamas?',
        translation: 'Hi! I’m Inês. What’s your name?',
        accept: /chamo|sou|nome/i,
        hint: 'Say your name with “Chamo-me…” or “Sou o/a…”.',
        suggestions: ['Chamo-me Alex.', 'Sou a Sam.'],
        tips: [{ match: /me chamo/i, tip: 'In Portugal people say “Chamo-me”, with “me” after the verb. “Me chamo” sounds Brazilian.' }],
      },
      {
        tutor: 'Muito prazer! De onde és?',
        translation: 'Nice to meet you! Where are you from?',
        accept: /sou d|venho|de /i,
        hint: 'Say where you are from: “Sou de…” (I am from…).',
        suggestions: ['Sou de Inglaterra.', 'Sou do Brasil.', 'Sou da Turquia.'],
      },
      {
        tutor: 'Que fixe! E vives em Lisboa?',
        translation: 'How cool! And do you live in Lisbon?',
        accept: /sim|n[aã]o|vivo|moro/i,
        hint: 'Answer with “Sim, vivo em…” or “Não, vivo em…”.',
        suggestions: ['Sim, vivo em Lisboa.', 'Não, vivo no Porto.'],
      },
    ],
    farewell: { text: 'Bem-vindo a Portugal! Foi um prazer. Até logo!', translation: 'Welcome to Portugal! It was a pleasure. See you later!' },
  },
]

const aiOnly = (id: string, title: string, description: string, setting: string, level: Scenario['level'] = 'A1'): Scenario => ({ id, title, description, level, setting })

// These need the AI tutor (no scripted version).
scenarios.unshift(
  aiOnly('free-chat', 'Free chat', 'Talk about your day, your plans or anything you like.', 'A relaxed, friendly chat between friends about everyday life: the learner’s day, week, plans, hobbies and life in Portugal. Ask about them and share a little about yourself.', 'A1'),
)

scenarios.push(
  aiOnly('supermarket', 'Supermarket cashier', 'Inês works at the till of a Pingo Doce.', 'You are a cashier at a Portuguese supermarket. Greet the customer, ask if they want a bag (saco) and if they have a loyalty card, tell them the total and ask how they want to pay.', 'A0'),
  aiOnly('directions', 'Asking for directions', 'You’re lost in Lisboa and Inês is a passer-by.', 'You are a friendly local on a street in Baixa, Lisboa. The learner is lost and asks for directions to places like the metro, Praça do Comércio or a pharmacy. Give simple directions (em frente, à direita, à esquerda).'),
  aiOnly('landlord', 'Talking to a landlord', 'Inês is renting out a flat in Coimbra.', 'You are a landlady (senhoria) showing a small flat (T1) in Coimbra to the learner. Talk about rent (renda), bills (contas), the deposit (caução) and when they can move in. The learner should address you as “a senhora”.'),
  aiOnly('pharmacy', 'At the pharmacy', 'Inês is the pharmacist at a farmácia.', 'A fictional pharmacy language rehearsal. Ask about symptoms, allergies and whether the learner has a prescription. Practise vocabulary without diagnosing or choosing medicines or doses.'),
  aiOnly('transport', 'Public transport', 'Inês works at the metro ticket office.', 'You work at a Lisboa metro ticket office. Help the learner buy and top up a Navegante card, explain prices simply and which line to take.'),
  aiOnly('appointment', 'Making an appointment', 'Inês is the receptionist at a health centre.', 'You are a receptionist at a centro de saúde. The learner wants to book a doctor appointment (marcar uma consulta). Ask for their name, utente number, and offer days and times.'),
)

scenarios.push(
  { ...aiOnly('call-health', 'Call the health centre', 'Book or change an appointment over the phone.', 'Answer the telephone as a health centre receptionist. Help book or change an appointment. Use fictional names and numbers, never ask for real sensitive data.', 'A2'), call: true },
  { ...aiOnly('call-landlord', 'Call your landlord', 'Explain that the hot water has stopped working.', 'Answer as the learner’s landlady. Ask what happened to the hot water, when it stopped and arrange a repair visit. Practise past events and polite requests.', 'A2'), call: true },
  { ...aiOnly('call-services', 'Book a public service visit', 'Ask about an appointment at the Loja do Cidadão.', 'Answer the phone at a fictional Loja do Cidadão. Help the learner request an appointment for Finanças or Segurança Social. Practise asking which documents to bring without presenting invented requirements as real rules.', 'A2'), call: true },
  { ...aiOnly('call-bank', 'Call the bank', 'Ask about an account and arrange a visit.', 'Answer the phone as a bank employee. Discuss a fictional account’s monthly fees and arrange a visit. Never ask for real account details, credentials or payment information.', 'A2'), call: true },
)
