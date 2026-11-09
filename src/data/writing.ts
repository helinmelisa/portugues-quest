export interface WritingTask {
  id: string
  title: string
  situation: string
  minWords: number
  checklist: string[]
  phrases: { pt: string; en: string }[]
  model: string
}

export const writingTasks: WritingTask[] = [
  {
    id: 'landlord',
    title: 'A message to your landlord',
    situation:
      'The hot water stopped working yesterday. Write a polite message explaining the problem and asking when someone can visit.',
    minWords: 25,
    checklist: [
      'Greet your landlord politely.',
      'Say what happened and when.',
      'Ask for a visit and give your availability.',
    ],
    phrases: [
      { pt: 'Queria informar que…', en: 'I would like to let you know that…' },
      { pt: 'Seria possível…?', en: 'Would it be possible…?' },
    ],
    model:
      'Boa tarde, D. Ana. Desde ontem que não tenho água quente. O esquentador não funciona. Seria possível alguém vir verificar a avaria? Amanhã estou em casa depois das cinco. Obrigada pela ajuda. Com os melhores cumprimentos, Sara.',
  },
  {
    id: 'appointment',
    title: 'Change an appointment',
    situation:
      'You cannot attend an appointment on Tuesday morning. Ask reception for a different day and say when you are available. Use invented details.',
    minWords: 25,
    checklist: [
      'Identify the appointment with fictional details.',
      'Explain that you cannot attend.',
      'Suggest another day or time and thank reception.',
    ],
    phrases: [
      { pt: 'Não vou poder comparecer.', en: 'I will not be able to attend.' },
      { pt: 'Tenho disponibilidade…', en: 'I am available…' },
    ],
    model:
      'Bom dia. Tenho uma consulta marcada para terça-feira às dez, mas não vou poder comparecer porque tenho uma reunião. Seria possível alterar a marcação? Tenho disponibilidade na quinta-feira à tarde. Muito obrigada. Com os melhores cumprimentos, Rita Silva.',
  },
  {
    id: 'weekend',
    title: 'Tell a friend about your weekend',
    situation:
      'Tell a friend where you went, what the place was like and what you did. Use both a finished action and a past description.',
    minWords: 30,
    checklist: [
      'Use a finished past action: fui, visitei, comi…',
      'Add background with era, estava or havia.',
      'Link events with primeiro, depois or enquanto.',
    ],
    phrases: [
      { pt: 'Enquanto esperava…', en: 'While I was waiting…' },
      { pt: 'O sítio era…', en: 'The place was…' },
    ],
    model:
      'Olá, Inês! No sábado fui a Sintra com uma amiga. O tempo estava ótimo e havia muita gente. Primeiro visitámos um palácio e depois almoçámos no centro. Enquanto esperávamos pelo comboio, comemos um travesseiro. Gostei muito do passeio!',
  },
  {
    id: 'application',
    title: 'A short job application',
    situation:
      'Write a short formal email applying for a job in a shop. Mention past experience and your availability. Invent the shop and personal details.',
    minWords: 30,
    checklist: [
      'Use a suitable formal opening.',
      'Mention relevant experience.',
      'Close politely and offer to send your CV.',
    ],
    phrases: [
      { pt: 'Venho apresentar a minha candidatura…', en: 'I am writing to apply…' },
      { pt: 'Fico a aguardar…', en: 'I look forward to…' },
    ],
    model:
      'Exma. Senhora, venho apresentar a minha candidatura à vaga de assistente de loja. Trabalhei numa papelaria, onde atendia clientes e organizava produtos. Tenho disponibilidade para trabalhar de segunda a sexta-feira. Posso enviar o meu currículo. Fico a aguardar o seu contacto. Com os melhores cumprimentos, Luís Costa.',
  },
  {
    id: 'invitation',
    title: 'Make a plan with a friend',
    situation:
      'Invite a friend to do something next weekend. Suggest a time and meeting place, then offer an alternative if it rains.',
    minWords: 25,
    checklist: ['Make an invitation.', 'Suggest a time and place.', 'Offer an alternative and ask for a reply.'],
    phrases: [
      { pt: 'Queres vir connosco?', en: 'Would you like to come with us?' },
      { pt: 'Se chover, podemos…', en: 'If it rains, we can…' },
    ],
    model:
      'Olá, Marta! No próximo sábado vou passear junto ao rio. Queres vir comigo? Podemos encontrar-nos às dez em frente à estação. Se chover, podemos visitar o museu e depois beber um café. Diz-me se podes. Até breve!',
  },
  {
    id: 'comparison',
    title: 'Choose between two flats',
    situation:
      'Describe two fictional flats to a friend. Compare their price, location and size, then explain which one you prefer.',
    minWords: 30,
    checklist: [
      'Make at least two comparisons.',
      'Explain your preference with porque.',
      'Include one disadvantage of your chosen flat.',
    ],
    phrases: [
      { pt: 'É mais… do que…', en: 'It is more… than…' },
      { pt: 'Prefiro… porque…', en: 'I prefer… because…' },
    ],
    model:
      'Vi dois apartamentos. O primeiro é maior, mas fica mais longe do trabalho. O segundo é mais barato e tão luminoso como o primeiro. Prefiro o segundo porque posso ir a pé para o escritório. A cozinha é pequena, mas chega para mim.',
  },
]
export const getWritingTask = (id: string) => writingTasks.find((t) => t.id === id)
