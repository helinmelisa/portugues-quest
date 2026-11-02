import type { Scenario } from './types'

export const scenarios: Scenario[] = [
  {
    id: 'coffee',
    title: 'Ordering coffee',
    description: 'Inês is the empregada at a little café in Porto.',
    level: 'A0',
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

export const upcomingScenarios = ['Supermarket cashier', 'Asking for directions', 'Talking to a landlord', 'At the pharmacy', 'Public transport', 'Making an appointment']
