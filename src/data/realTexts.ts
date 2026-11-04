export interface RealText {
  id: string
  title: string
  kind: string
  context: string
  text: string
  translation: string
  glossary: { pt: string; en: string }[]
  questions: { prompt: string; options: string[]; answer: number; explanation: string }[]
}

// Authored examples, with fictional dates, prices and payment details.
export const realTexts: RealText[] = [
  {
    id: 'sign',
    title: 'A sign at the counter',
    kind: 'Sign',
    context: 'At a public service desk',
    text: 'Atendimento por marcação.\nRetire uma senha e aguarde a sua vez.',
    translation: 'Service by appointment. Take a queue ticket and wait for your turn.',
    glossary: [
      { pt: 'marcação', en: 'appointment' },
      { pt: 'aguarde', en: 'wait' },
    ],
    questions: [
      { prompt: 'Do you need an appointment?', options: ['Yes', 'No', 'Only on Fridays'], answer: 0, explanation: 'Yes. Read the relevant line again to check.' },
      { prompt: 'What should you take?', options: ['A bank card', 'A rental contract', 'A queue ticket'], answer: 2, explanation: 'A queue ticket. Read the relevant line again to check.' },
      { prompt: 'What does “aguarde a sua vez” ask you to do?', options: ['Call tomorrow', 'Wait for your turn', 'Go home'], answer: 1, explanation: 'Wait for your turn. Read the relevant line again to check.' },
    ],
  },
  {
    id: 'notice',
    title: 'Water interruption',
    kind: 'Notice',
    context: 'A notice in your building',
    text: 'Aviso aos moradores\nNa quarta-feira, das 9h às 12h, haverá um corte de água para obras.\nPedimos desculpa pelo incómodo.',
    translation: 'Notice to residents: On Wednesday, from 9 am to noon, the water will be cut off for building work. We apologise for the inconvenience.',
    glossary: [
      { pt: 'moradores', en: 'residents' },
      { pt: 'corte de água', en: 'water interruption' },
    ],
    questions: [
      { prompt: 'When is the interruption?', options: ['Thursday', 'Friday', 'Wednesday'], answer: 2, explanation: 'Wednesday. Read the relevant line again to check.' },
      { prompt: 'How long is it scheduled to last?', options: ['Twelve hours', 'Three hours', 'Nine hours'], answer: 1, explanation: 'Three hours. Read the relevant line again to check.' },
      { prompt: 'Why is the water being cut off?', options: ['Building work', 'An unpaid bill', 'A holiday'], answer: 0, explanation: 'Building work. Read the relevant line again to check.' },
    ],
  },
  {
    id: 'rental',
    title: 'A flat to rent',
    kind: 'Rental ad',
    context: 'A fictional rental listing',
    text: 'Arrenda-se T1 em Coimbra.\nRenda: 750 €/mês. Caução: 1 500 €.\nMobilado, sem elevador. Despesas não incluídas.\nVisitas ao sábado, por marcação.',
    translation: 'One-bedroom flat to rent in Coimbra. Rent: €750/month. Deposit: €1,500. Furnished, no lift. Bills not included. Viewings on Saturday by appointment.',
    glossary: [
      { pt: 'mobilado', en: 'furnished' },
      { pt: 'despesas', en: 'bills / expenses' },
    ],
    questions: [
      { prompt: 'How many bedrooms does the flat have?', options: ['Three', 'One', 'Two'], answer: 1, explanation: 'One. Read the relevant line again to check.' },
      { prompt: 'Are bills included?', options: ['No', 'Yes', 'Only electricity'], answer: 0, explanation: 'No. Read the relevant line again to check.' },
      { prompt: 'When can you view the flat?', options: ['Every morning', 'Sunday without booking', 'Saturday by appointment'], answer: 2, explanation: 'Saturday by appointment. Read the relevant line again to check.' },
    ],
  },
  {
    id: 'sms',
    title: 'A message from the health centre',
    kind: 'SMS',
    context: 'A fictional appointment reminder',
    text: 'Centro de Saúde: a sua consulta foi alterada para 14/05 às 10h30.\nSe não puder comparecer, contacte a receção. Não responda a este SMS.',
    translation: 'Health centre: your appointment has been changed to 14 May at 10:30 am. If you cannot attend, contact reception. Do not reply to this SMS.',
    glossary: [
      { pt: 'alterada', en: 'changed' },
      { pt: 'comparecer', en: 'attend' },
    ],
    questions: [
      { prompt: 'What happened to the appointment?', options: ['It was rescheduled', 'It was cancelled without replacement', 'It was paid for'], answer: 0, explanation: 'It was rescheduled. Read the relevant line again to check.' },
      { prompt: 'What time is the appointment?', options: ['14:05', '05:14', '10:30'], answer: 2, explanation: '10:30. Read the relevant line again to check.' },
      { prompt: 'What should you do if you cannot attend?', options: ['Do nothing', 'Contact reception', 'Reply to the SMS'], answer: 1, explanation: 'Contact reception. Read the relevant line again to check.' },
    ],
  },
  {
    id: 'bill',
    title: 'Reading a utility bill',
    kind: 'Utility bill',
    context: 'A fictional electricity bill',
    text: 'Fatura de eletricidade\nPeríodo de consumo: 1 a 30 de abril\nTotal a pagar: 42,60 €\nData-limite de pagamento: 20 de maio\nReferência de pagamento: 000 000 000 (exemplo)',
    translation: 'Electricity bill. Consumption period: 1–30 April. Total due: €42.60. Payment deadline: 20 May. Payment reference: fictional example.',
    glossary: [
      { pt: 'consumo', en: 'consumption' },
      { pt: 'data-limite', en: 'deadline' },
    ],
    questions: [
      { prompt: 'What is the amount due?', options: ['€20.00', '€30.42', '€42.60'], answer: 2, explanation: '€42.60. Read the relevant line again to check.' },
      { prompt: 'What is the payment deadline?', options: ['1 April', '20 May', '30 April'], answer: 1, explanation: '20 May. Read the relevant line again to check.' },
      { prompt: 'Which period does the bill cover?', options: ['April', 'May', 'The whole year'], answer: 0, explanation: 'April. Read the relevant line again to check.' },
    ],
  },
  {
    id: 'email',
    title: 'An interview invitation',
    kind: 'Email',
    context: 'A fictional message from an employer',
    text: 'Exma. Senhora,\nAgradecemos a sua candidatura. Convidamo-la para uma entrevista na quinta-feira às 15h, por videochamada.\nAgradecemos que confirme a sua disponibilidade.\nCom os melhores cumprimentos,\nA equipa de recrutamento',
    translation: 'Dear Madam, Thank you for your application. We invite you to an interview on Thursday at 3 pm by video call. Please confirm your availability. Kind regards, The recruitment team.',
    glossary: [
      { pt: 'candidatura', en: 'application' },
      { pt: 'disponibilidade', en: 'availability' },
    ],
    questions: [
      { prompt: 'How will the interview take place?', options: ['By email only', 'By video call', 'At a café'], answer: 1, explanation: 'By video call. Read the relevant line again to check.' },
      { prompt: 'What does the employer ask you to confirm?', options: ['Your availability', 'Your bank details', 'Your rent'], answer: 0, explanation: 'Your availability. Read the relevant line again to check.' },
      { prompt: 'Which is a suitable closing for your reply?', options: ['Então, tudo fixe?', 'Até já, pá!', 'Com os melhores cumprimentos,'], answer: 2, explanation: 'Com os melhores cumprimentos,. Read the relevant line again to check.' },
    ],
  },
]

export const getRealText = (id: string) => realTexts.find((t) => t.id === id)
