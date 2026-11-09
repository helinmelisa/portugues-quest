export interface Dialogue {
  id: string
  title: string
  objective: string
  turns: { speaker: string; pt: string; en: string }[]
  questions: { prompt: string; options: string[]; answer: number; explanation: string }[]
  vocabulary: { id: string; pt: string; en: string }[]
}

// Authored A2 dialogues. Travel and housing details are fictional language examples.
export const dialogues: Dialogue[] = [
  {
    id: 'train',
    title: 'A missed train',
    objective: 'Ask for alternatives after missing a connection.',
    turns: [
      {
        speaker: 'Rita',
        pt: 'Boa tarde. O meu comboio chegou atrasado e perdi a ligação para Coimbra.',
        en: 'Good afternoon. My train arrived late and I missed the connection to Coimbra.',
      },
      {
        speaker: 'Funcionário',
        pt: 'Lamento. A que horas devia sair o seu comboio?',
        en: 'I am sorry. What time was your train supposed to leave?',
      },
      {
        speaker: 'Rita',
        pt: 'Às duas e vinte. Tenho este bilhete, mas não sei se posso usá-lo no próximo.',
        en: 'At twenty past two. I have this ticket, but I do not know whether I can use it on the next one.',
      },
      {
        speaker: 'Funcionário',
        pt: 'Vou verificar. O próximo serviço sai às três e dez e demora cerca de uma hora.',
        en: 'I will check. The next service leaves at ten past three and takes about an hour.',
      },
      {
        speaker: 'Rita',
        pt: 'Obrigada. Tenho uma reunião às cinco. Ainda consigo chegar a tempo?',
        en: 'Thank you. I have a meeting at five. Can I still get there in time?',
      },
      {
        speaker: 'Funcionário',
        pt: 'Se não houver mais atrasos, sim. Tem tempo para ir da estação ao centro.',
        en: 'If there are no more delays, yes. You have time to get from the station to the centre.',
      },
      {
        speaker: 'Rita',
        pt: 'Preciso de trocar o bilhete ou posso entrar diretamente?',
        en: 'Do I need to change the ticket or can I board directly?',
      },
      {
        speaker: 'Funcionário',
        pt: 'Neste exemplo, vou emitir um novo bilhete. Aguarde aqui um momento, por favor.',
        en: 'In this example, I will issue a new ticket. Please wait here a moment.',
      },
    ],
    questions: [
      {
        prompt: 'Why does Rita need help?',
        options: [
          'She missed a connection after a delay',
          'She lost her suitcase',
          'She wants to cancel tomorrow’s trip',
        ],
        answer: 0,
        explanation: 'She missed a connection after a delay. Listen again for the line that supports your answer.',
      },
      {
        prompt: 'When does the next service leave?',
        options: ['14:20', '17:00', '15:10'],
        answer: 2,
        explanation: '15:10. Listen again for the line that supports your answer.',
      },
      {
        prompt: 'Why does Rita ask about arrival time?',
        options: ['She works at the station', 'She has a meeting at five', 'She has a flight at three'],
        answer: 1,
        explanation: 'She has a meeting at five. Listen again for the line that supports your answer.',
      },
    ],
    vocabulary: [
      { id: 'dialogue-train-word-0', pt: 'a ligação', en: 'connection' },
      { id: 'dialogue-train-word-1', pt: 'o atraso', en: 'delay' },
      { id: 'dialogue-train-word-2', pt: 'chegar a tempo', en: 'arrive in time' },
      { id: 'dialogue-train-word-3', pt: 'emitir um bilhete', en: 'issue a ticket' },
    ],
  },
  {
    id: 'flat',
    title: 'A flat viewing',
    objective: 'Follow a conversation about a home and its practical details.',
    turns: [
      {
        speaker: 'Senhoria',
        pt: 'Entre, por favor. Este T1 fica no segundo andar. O prédio não tem elevador.',
        en: 'Please come in. This one-bedroom flat is on the second floor. The building has no lift.',
      },
      {
        speaker: 'Miguel',
        pt: 'A sala é mais luminosa do que parecia nas fotografias. As janelas são novas?',
        en: 'The living room is brighter than it looked in the photos. Are the windows new?',
      },
      {
        speaker: 'Senhoria',
        pt: 'Sim, foram substituídas no ano passado. Antes entrava muito frio no inverno.',
        en: 'Yes, they were replaced last year. Before, a lot of cold air came in during winter.',
      },
      {
        speaker: 'Miguel',
        pt: 'E a renda inclui alguma despesa? Trabalho em casa e uso bastante eletricidade.',
        en: 'And does the rent include any bills? I work at home and use quite a lot of electricity.',
      },
      {
        speaker: 'Senhoria',
        pt: 'Neste anúncio fictício, a água está incluída. A eletricidade e a internet ficam à parte.',
        en: 'In this fictional listing, water is included. Electricity and internet are separate.',
      },
      {
        speaker: 'Miguel',
        pt: 'Percebo. Quando seria possível mudar-me? O meu contrato atual termina no fim do mês.',
        en: 'I see. When would it be possible to move in? My current contract ends at the end of the month.',
      },
      {
        speaker: 'Senhoria',
        pt: 'A partir do dia um. Se estiver interessado, podemos voltar a falar amanhã.',
        en: 'From the first. If you are interested, we can speak again tomorrow.',
      },
      {
        speaker: 'Miguel',
        pt: 'Gostei do apartamento. Vou pensar e amanhã dou-lhe uma resposta. Obrigado pela visita.',
        en: 'I liked the flat. I will think about it and give you an answer tomorrow. Thank you for the viewing.',
      },
    ],
    questions: [
      {
        prompt: 'What drawback does the building have?',
        options: ['There are no windows', 'It has no water', 'There is no lift'],
        answer: 2,
        explanation: 'There is no lift. Listen again for the line that supports your answer.',
      },
      {
        prompt: 'Which bill is included in this fictional rent?',
        options: ['Internet', 'Water', 'Electricity'],
        answer: 1,
        explanation: 'Water. Listen again for the line that supports your answer.',
      },
      {
        prompt: 'When will Miguel give an answer?',
        options: ['Tomorrow', 'At the end of the month', 'On the first'],
        answer: 0,
        explanation: 'Tomorrow. Listen again for the line that supports your answer.',
      },
    ],
    vocabulary: [
      { id: 'dialogue-flat-word-0', pt: 'luminoso', en: 'bright' },
      { id: 'dialogue-flat-word-1', pt: 'à parte', en: 'separately' },
      { id: 'dialogue-flat-word-2', pt: 'mudar-me', en: 'move in' },
      { id: 'dialogue-flat-word-3', pt: 'dar uma resposta', en: 'give an answer' },
    ],
  },
  {
    id: 'work',
    title: 'Changing a work schedule',
    objective: 'Understand a request, a compromise and an agreed plan.',
    turns: [
      {
        speaker: 'Ana',
        pt: 'Tens um minuto, Pedro? Queria falar contigo sobre o horário de sexta-feira.',
        en: 'Have you got a minute, Pedro? I would like to talk to you about Friday’s schedule.',
      },
      {
        speaker: 'Pedro',
        pt: 'Claro. Costumas entrar às nove. Precisas de chegar mais tarde?',
        en: 'Of course. You usually start at nine. Do you need to arrive later?',
      },
      {
        speaker: 'Ana',
        pt: 'Sim. Tenho de acompanhar a minha mãe a uma consulta e só consigo chegar às onze.',
        en: 'Yes. I need to accompany my mother to an appointment and can only arrive at eleven.',
      },
      {
        speaker: 'Pedro',
        pt: 'Nessa manhã há uma entrega grande. Consegues deixar os documentos preparados na quinta-feira?',
        en: 'There is a large delivery that morning. Can you leave the documents ready on Thursday?',
      },
      {
        speaker: 'Ana',
        pt: 'Consigo. Posso também ficar mais duas horas na sexta-feira para compensar.',
        en: 'I can. I can also stay two extra hours on Friday to make up for it.',
      },
      {
        speaker: 'Pedro',
        pt: 'Parece-me bem. Eu recebo a entrega e tu tratas do resto quando chegares.',
        en: 'That sounds good. I will receive the delivery and you can handle the rest when you arrive.',
      },
      {
        speaker: 'Ana',
        pt: 'Obrigada pela ajuda. Envio-te uma mensagem quando sair do centro de saúde.',
        en: 'Thank you for helping. I will send you a message when I leave the health centre.',
      },
      {
        speaker: 'Pedro',
        pt: 'Combinado. Deixa só uma nota no calendário para a equipa saber da alteração.',
        en: 'Agreed. Just leave a note in the calendar so the team knows about the change.',
      },
    ],
    questions: [
      {
        prompt: 'Why does Ana need a different start time?',
        options: [
          'She is moving home',
          'She is accompanying her mother to an appointment',
          'She is taking a train to Porto',
        ],
        answer: 1,
        explanation:
          'She is accompanying her mother to an appointment. Listen again for the line that supports your answer.',
      },
      {
        prompt: 'What will Ana prepare on Thursday?',
        options: ['The documents', 'Lunch for the team', 'A new calendar'],
        answer: 0,
        explanation: 'The documents. Listen again for the line that supports your answer.',
      },
      {
        prompt: 'What else does Pedro ask her to do?',
        options: ['Cancel the delivery', 'Arrive at nine anyway', 'Put a note in the calendar'],
        answer: 2,
        explanation: 'Put a note in the calendar. Listen again for the line that supports your answer.',
      },
    ],
    vocabulary: [
      { id: 'dialogue-work-word-0', pt: 'o horário', en: 'schedule' },
      { id: 'dialogue-work-word-1', pt: 'acompanhar', en: 'accompany' },
      { id: 'dialogue-work-word-2', pt: 'compensar', en: 'make up for' },
      { id: 'dialogue-work-word-3', pt: 'a alteração', en: 'change' },
    ],
  },
  {
    id: 'trip',
    title: 'A weekend that changed',
    objective: 'Follow past events, background details and a change of plan.',
    turns: [
      {
        speaker: 'Inês',
        pt: 'Então, como foi o vosso fim de semana no Alentejo? Conseguiram fazer a caminhada?',
        en: 'So, how was your weekend in the Alentejo? Did you manage to go on the hike?',
      },
      {
        speaker: 'Sara',
        pt: 'Quase! Quando saímos do alojamento, o céu estava cinzento, mas ainda não chovia.',
        en: 'Almost! When we left the accommodation, the sky was grey, but it was not raining yet.',
      },
      {
        speaker: 'Inês',
        pt: 'E depois começou a chover a meio do caminho?',
        en: 'And then it started raining halfway there?',
      },
      {
        speaker: 'Sara',
        pt: 'Sim. Primeiro esperámos debaixo de uma árvore. Como a chuva não parava, voltámos à aldeia.',
        en: 'Yes. First we waited under a tree. As the rain did not stop, we went back to the village.',
      },
      {
        speaker: 'Inês',
        pt: 'Que pena! Ficaram no alojamento o resto do dia?',
        en: 'What a shame! Did you stay at the accommodation for the rest of the day?',
      },
      {
        speaker: 'Sara',
        pt: 'Não. Uma senhora recomendou-nos um pequeno museu. Era muito interessante e quase não havia turistas.',
        en: 'No. A woman recommended a small museum to us. It was very interesting and there were hardly any tourists.',
      },
      {
        speaker: 'Inês',
        pt: 'Afinal, ainda aproveitaram o passeio. Voltavam lá?',
        en: 'So you still made the most of the trip. Would you go back?',
      },
      {
        speaker: 'Sara',
        pt: 'Sem dúvida. Da próxima vez vamos ver a previsão do tempo antes de sair!',
        en: 'Definitely. Next time we are going to check the weather forecast before leaving!',
      },
    ],
    questions: [
      {
        prompt: 'What was the weather like when they left?',
        options: ['Grey, but not raining yet', 'Sunny and hot', 'Already raining heavily'],
        answer: 0,
        explanation: 'Grey, but not raining yet. Listen again for the line that supports your answer.',
      },
      {
        prompt: 'Why did they go back to the village?',
        options: ['The museum was closing', 'They had lost their map', 'The rain did not stop'],
        answer: 2,
        explanation: 'The rain did not stop. Listen again for the line that supports your answer.',
      },
      {
        prompt: 'What did they do instead of staying at the accommodation?',
        options: ['Went shopping in Lisboa', 'Visited a small museum', 'Took the train home'],
        answer: 1,
        explanation: 'Visited a small museum. Listen again for the line that supports your answer.',
      },
    ],
    vocabulary: [
      { id: 'dialogue-trip-word-0', pt: 'o alojamento', en: 'accommodation' },
      { id: 'dialogue-trip-word-1', pt: 'a meio do caminho', en: 'halfway there' },
      { id: 'dialogue-trip-word-2', pt: 'aproveitar', en: 'make the most of' },
      { id: 'dialogue-trip-word-3', pt: 'sem dúvida', en: 'definitely' },
    ],
  },
]
export const getDialogue = (id: string) => dialogues.find((d) => d.id === id)
export const dialogueAudio = (dialogue: Dialogue) => dialogue.turns.map((t) => t.pt).join(' ')
