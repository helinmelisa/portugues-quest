import type { Lesson } from '../../types'

const upcoming = (id: string, title: string, objective: string): Lesson => ({
  id, destinationId: 'lisboa', title, objective, intro: '', minutes: 5, xp: 20, skills: ['vocabulary'], vocabulary: [], exercises: [],
})

export const lisboaLessons: Lesson[] = [
  {
    id: 'lisboa-hello',
    destinationId: 'lisboa',
    title: 'Saying hello',
    objective: 'Greet people at any time of day and say goodbye.',
    intro: 'You just arrived in Lisboa. Your neighbour smiles at you on the stairs — time for your first Portuguese words!',
    minutes: 4,
    xp: 20,
    skills: ['vocabulary', 'culture'],
    vocabulary: [
      { id: 'ola', pt: 'Olá', en: 'Hello', pronunciation: 'oh-LAH', context: 'Friendly and works anywhere, any time.' },
      { id: 'bom-dia', pt: 'Bom dia', en: 'Good morning', pronunciation: 'bohng DEE-ah', context: 'Used until lunchtime (around 12–1 pm).', example: { pt: 'Bom dia, Dona Maria!', en: 'Good morning, Mrs Maria!' } },
      { id: 'boa-tarde', pt: 'Boa tarde', en: 'Good afternoon', pronunciation: 'BOH-ah TARD', context: 'From lunch until it gets dark.' },
      { id: 'boa-noite', pt: 'Boa noite', en: 'Good evening / Good night', pronunciation: 'BOH-ah NOYT', context: 'Both a greeting and a goodbye after dark.' },
      { id: 'tudo-bem', pt: 'Tudo bem?', en: 'How are you? / All good?', pronunciation: 'TOO-doo bayng', context: 'Casual. Answer with “Tudo bem, e contigo?”', example: { pt: 'Olá! Tudo bem?', en: 'Hi! All good?' } },
      { id: 'obrigado', pt: 'Obrigado / Obrigada', en: 'Thank you', pronunciation: 'oh-bree-GAH-doo / -dah', context: 'Men say obrigado, women say obrigada — it matches the speaker.' },
      { id: 'ate-logo', pt: 'Até logo', en: 'See you later', pronunciation: 'ah-TEH LOH-goo', context: 'A very common, warm goodbye.' },
      { id: 'ate-amanha', pt: 'Até amanhã', en: 'See you tomorrow', pronunciation: 'ah-TEH ah-mah-NYAH' },
    ],
    exercises: [
      { id: 'h1', type: 'multiple-choice', prompt: 'It is 9 in the morning. How do you greet your neighbour?', options: ['Boa noite', 'Bom dia', 'Boa tarde'], answer: 1, explanation: '“Bom dia” is used in the morning, until about lunchtime.' },
      { id: 'h2', type: 'multiple-choice', prompt: 'It is 3 pm and you walk into a shop. What do you say?', options: ['Boa tarde', 'Bom dia', 'Até amanhã'], answer: 0, explanation: 'After lunch, Portuguese people switch to “Boa tarde”.' },
      { id: 'h3', type: 'multiple-choice', prompt: 'What does “Até amanhã” mean?', options: ['Good morning', 'See you later', 'See you tomorrow'], answer: 2, explanation: '“Amanhã” means tomorrow, so “Até amanhã” is “See you tomorrow”.' },
      { id: 'h4', type: 'multiple-choice', prompt: 'Ana wants to thank the baker. What does she say?', options: ['Obrigado', 'Obrigada', 'Olá'], answer: 1, explanation: 'The word matches the person speaking: Ana is a woman, so she says “obrigada”.' },
      { id: 'h5', type: 'multiple-choice', prompt: 'A friend says “Olá! Tudo bem?” What is a natural reply?', options: ['Tudo bem, e contigo?', 'Boa noite, obrigado.', 'Sou bem.'], answer: 0, explanation: '“Tudo bem, e contigo?” means “All good, and you?”. In Portugal, “contigo” is the friendly way to say “with you”.' },
    ],
  },
  upcoming('lisboa-introduce', 'Introducing yourself', 'Say your name and a little about you.'),
  upcoming('lisboa-name', "Asking someone's name", 'Ask “Como te chamas?” and “Como se chama?”.'),
  upcoming('lisboa-from', 'Where are you from?', 'Say where you are from and where you live.'),
  upcoming('lisboa-polite', 'Polite expressions', 'Por favor, desculpe, com licença and more.'),
]
