import type { Lesson } from '../../types'

const upcoming = (id: string, title: string, objective: string): Lesson => ({
  id, destinationId: 'porto', title, objective, intro: '', minutes: 5, xp: 20, skills: ['vocabulary'], vocabulary: [], exercises: [],
})

export const portoLessons: Lesson[] = [
  {
    id: 'porto-coffee',
    destinationId: 'porto',
    title: 'One coffee, please!',
    objective: 'Order a coffee politely and ask for the bill.',
    intro: 'Pop into a cozy café in Porto. The empregado is waiting for your order…',
    minutes: 5,
    xp: 25,
    skills: ['vocabulary', 'speaking', 'culture'],
    vocabulary: [
      { id: 'queria', pt: 'Queria…', en: 'I would like…', pronunciation: 'keh-REE-ah', context: 'The polite way to order in Portugal.', example: { pt: 'Queria um café, por favor.', en: 'I would like a coffee, please.' } },
      { id: 'um-cafe', pt: 'Um café', en: 'An espresso', pronunciation: 'oong kah-FEH', context: 'In Portugal, “um café” is always a short espresso.' },
      { id: 'galao', pt: 'Um galão', en: 'A milky coffee in a tall glass', pronunciation: 'oong gah-LOWNG' },
      { id: 'meia-de-leite', pt: 'Uma meia de leite', en: 'Half coffee, half milk in a cup', pronunciation: 'OO-mah MAY-ah deh LAYT' },
      { id: 'pastel-de-nata', pt: 'Um pastel de nata', en: 'A custard tart', pronunciation: 'oong pash-TEL deh NAH-tah' },
      { id: 'se-faz-favor', pt: 'Se faz favor', en: 'Excuse me / Please', pronunciation: 'seh fash fah-VOR', context: 'Used to call the waiter and as a polite “please”.' },
      { id: 'a-conta', pt: 'A conta', en: 'The bill', pronunciation: 'ah KOHN-tah', example: { pt: 'A conta, se faz favor.', en: 'The bill, please.' } },
    ],
    exercises: [
      { id: 'c1', type: 'multiple-choice', prompt: 'You walk into a café. How would you politely order a coffee?', options: ['Eu sou um café.', 'Queria um café, por favor.', 'Onde está o café?'], answer: 1, explanation: '“Queria…” (I would like) is the polite way to order. “Eu sou um café” means “I am a coffee”!' },
      { id: 'c2', type: 'multiple-choice', prompt: 'You order “um café”. What arrives?', options: ['A big filter coffee', 'A cappuccino', 'A short espresso'], answer: 2, explanation: 'In Portugal, “um café” is always a small, strong espresso.' },
      { id: 'c3', type: 'multiple-choice', prompt: 'You want a milky coffee served in a tall glass. What do you order?', options: ['Um galão', 'Um pastel de nata', 'Uma conta'], answer: 0, explanation: 'A “galão” is milky coffee in a glass. A “meia de leite” is similar, but in a cup.' },
      { id: 'c4', type: 'multiple-choice', prompt: 'How do you get the waiter’s attention?', options: ['Olá, coffee!', 'Se faz favor!', 'Até logo!'], answer: 1, explanation: '“Se faz favor!” is the polite way to call someone over in Portugal.' },
      { id: 'c5', type: 'multiple-choice', prompt: 'You are ready to pay. What do you say?', options: ['A conta, se faz favor.', 'Bom dia, conta.', 'Queria um galão.'], answer: 0, explanation: '“A conta, se faz favor” means “The bill, please”.' },
    ],
  },
  upcoming('porto-menu', 'Reading the café menu', 'Understand a typical café menu.'),
  upcoming('porto-pastries', 'Ordering pastries', 'Choose between bolos and salgados.'),
  upcoming('porto-paying', 'Paying at the café', 'Numbers, prices and paying by card.'),
]
