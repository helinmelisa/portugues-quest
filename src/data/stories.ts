import type { CefrLevel } from '../types'

export interface Story {
  id: string
  destinationId: string
  title: string
  level: CefrLevel
  sentences: { pt: string; en: string }[]
  glossary: Record<string, string> // lowercase word or phrase → English
  questions: { prompt: string; options: string[]; answer: number; explanation: string }[]
}

export const stories: Story[] = [
  {
    id: 'lisboa-vizinho',
    destinationId: 'lisboa',
    title: 'Um novo vizinho',
    level: 'A0',
    sentences: [
      { pt: 'Olá! Chamo-me Tom e sou de Inglaterra.', en: 'Hi! My name is Tom and I’m from England.' },
      { pt: 'Vivo em Lisboa, num apartamento pequeno em Alfama.', en: 'I live in Lisbon, in a small flat in Alfama.' },
      { pt: 'Todas as manhãs, encontro a minha vizinha nas escadas.', en: 'Every morning I meet my neighbour on the stairs.' },
      { pt: 'Ela chama-se Dona Fátima e é muito simpática.', en: 'Her name is Dona Fátima and she’s very kind.' },
      { pt: '— Bom dia, Tom! Tudo bem?', en: '— Good morning, Tom! All good?' },
      { pt: '— Tudo bem, obrigado! E a senhora?', en: '— All good, thank you! And you?' },
    ],
    glossary: { vivo: 'I live', apartamento: 'flat, apartment', pequeno: 'small', 'todas as manhãs': 'every morning', encontro: 'I meet', vizinha: 'neighbour (woman)', escadas: 'stairs', simpática: 'kind, friendly', senhora: 'you (polite, to a woman)' },
    questions: [
      { prompt: 'Where is Tom from?', options: ['England', 'Lisbon', 'Alfama'], answer: 0, explanation: '“Sou de Inglaterra” = I’m from England.' },
      { prompt: 'Where does Tom meet Dona Fátima?', options: ['On the stairs', 'At a café', 'At the station'], answer: 0, explanation: '“Nas escadas” = on the stairs.' },
      { prompt: 'How does Tom politely say “and you?” to Dona Fátima?', options: ['E a senhora?', 'E tu?', 'E você?'], answer: 0, explanation: 'With an older lady, “a senhora” is the polite choice.' },
    ],
  },
  {
    id: 'porto-cimbalino',
    destinationId: 'porto',
    title: 'O primeiro cimbalino',
    level: 'A0',
    sentences: [
      { pt: 'A Sara está no Porto pela primeira vez.', en: 'Sara is in Porto for the first time.' },
      { pt: 'Entra num café pequeno perto do rio.', en: 'She goes into a small café near the river.' },
      { pt: '— Bom dia! O que vai ser?', en: '— Good morning! What will it be?' },
      { pt: '— Queria um café e um pastel de nata, se faz favor.', en: '— I’d like a coffee and a custard tart, please.' },
      { pt: 'O empregado sorri: — Aqui no Porto, um café é um cimbalino!', en: 'The waiter smiles: — Here in Porto, a coffee is a “cimbalino”!' },
      { pt: 'A Sara paga dois euros e diz: — Obrigada, até amanhã!', en: 'Sara pays two euros and says: — Thanks, see you tomorrow!' },
    ],
    glossary: { 'pela primeira vez': 'for the first time', entra: 'she goes in', perto: 'near', rio: 'river', empregado: 'waiter', sorri: 'smiles', paga: 'pays', diz: 'says' },
    questions: [
      { prompt: 'What does Sara order?', options: ['A coffee and a custard tart', 'A galão', 'A tea'], answer: 0, explanation: '“Um café e um pastel de nata”.' },
      { prompt: 'What does the waiter say an espresso is called in Porto?', options: ['Um cimbalino', 'Uma bica', 'Um galão'], answer: 0, explanation: 'In Porto, “cimbalino”; in Lisboa, “bica”.' },
      { prompt: 'How much does Sara pay?', options: ['Two euros', 'One euro', 'Twenty euros'], answer: 0, explanation: '“Dois euros” = two euros.' },
    ],
  },
  {
    id: 'coimbra-aulas',
    destinationId: 'coimbra',
    title: 'Um dia de aulas',
    level: 'A1',
    sentences: [
      { pt: 'O Miguel estuda Direito na Universidade de Coimbra.', en: 'Miguel studies Law at the University of Coimbra.' },
      { pt: 'Levanta-se às sete e toma o pequeno-almoço em casa.', en: 'He gets up at seven and has breakfast at home.' },
      { pt: 'Às nove tem aula de História, a sua cadeira favorita.', en: 'At nine he has History class, his favourite subject.' },
      { pt: 'Ao meio-dia almoça na cantina com os colegas.', en: 'At noon he has lunch in the canteen with his classmates.' },
      { pt: 'À tarde estuda na biblioteca até às seis.', en: 'In the afternoon he studies in the library until six.' },
      { pt: 'À noite, às vezes, ouve fado com os amigos.', en: 'In the evening, sometimes, he listens to fado with his friends.' },
    ],
    glossary: { direito: 'Law (subject)', 'levanta-se': 'he gets up', cadeira: 'university subject', favorita: 'favourite', colegas: 'classmates', biblioteca: 'library', até: 'until', 'às vezes': 'sometimes', ouve: 'listens to', fado: 'traditional Portuguese song' },
    questions: [
      { prompt: 'What does Miguel study?', options: ['Law', 'History', 'Medicine'], answer: 0, explanation: '“Estuda Direito” = he studies Law. History is just his favourite subject.' },
      { prompt: 'Where does he have lunch?', options: ['In the canteen', 'At home', 'In the library'], answer: 0, explanation: '“Almoça na cantina”.' },
      { prompt: 'What does he sometimes do in the evening?', options: ['Listens to fado', 'Studies until late', 'Goes to the beach'], answer: 0, explanation: 'Coimbra has its own style of fado, sung by students.' },
    ],
  },
  {
    id: 'aveiro-comboio',
    destinationId: 'aveiro',
    title: 'O comboio atrasado',
    level: 'A1',
    sentences: [
      { pt: 'A Ana quer ir de Aveiro para Lisboa.', en: 'Ana wants to go from Aveiro to Lisbon.' },
      { pt: 'Na estação, compra um bilhete de ida e volta.', en: 'At the station, she buys a return ticket.' },
      { pt: 'O comboio das dez parte da linha 2.', en: 'The ten o’clock train leaves from platform 2.' },
      { pt: 'Mas no painel aparece: “Atrasado 20 minutos”.', en: 'But the board says: “Delayed 20 minutes”.' },
      { pt: 'A Ana não fica chateada: compra um café e uns ovos moles.', en: 'Ana doesn’t get upset: she buys a coffee and some ovos moles.' },
      { pt: 'Às dez e vinte, o comboio chega e ela parte para Lisboa.', en: 'At twenty past ten, the train arrives and she leaves for Lisbon.' },
    ],
    glossary: { quer: 'wants', compra: 'buys', painel: 'information board', aparece: 'appears', chateada: 'annoyed, upset', 'ovos moles': 'Aveiro’s sweet egg-yolk treat', chega: 'arrives' },
    questions: [
      { prompt: 'Which ticket does Ana buy?', options: ['A return ticket', 'A one-way ticket', 'A monthly pass'], answer: 0, explanation: '“Ida e volta” = return.' },
      { prompt: 'Which platform does the train leave from?', options: ['Platform 2', 'Platform 10', 'Platform 20'], answer: 0, explanation: '“Linha 2” = platform 2.' },
      { prompt: 'How late is the train?', options: ['20 minutes', '10 minutes', 'One hour'], answer: 0, explanation: '“Atrasado 20 minutos”.' },
    ],
  },
  {
    id: 'braga-mercado',
    destinationId: 'braga',
    title: 'No mercado',
    level: 'A1',
    sentences: [
      { pt: 'Ao sábado de manhã, o João vai ao mercado de Braga.', en: 'On Saturday mornings, João goes to the Braga market.' },
      { pt: 'Primeiro compra um quilo de laranjas e meio quilo de tomates.', en: 'First he buys a kilo of oranges and half a kilo of tomatoes.' },
      { pt: '— Quanto custa tudo? — pergunta o João.', en: '— How much is everything? — João asks.' },
      { pt: '— São três euros e cinquenta — responde a senhora.', en: '— That’s three euros fifty — the lady answers.' },
      { pt: 'Depois compra uma dúzia de ovos e um bocadinho de queijo.', en: 'Then he buys a dozen eggs and a little bit of cheese.' },
      { pt: 'Na caixa, diz: — Não preciso de saco, obrigado. Tenho o meu.', en: 'At the till, he says: — I don’t need a bag, thanks. I have my own.' },
    ],
    glossary: { 'ao sábado': 'on Saturdays', mercado: 'market', laranjas: 'oranges', tudo: 'everything', pergunta: 'asks', responde: 'answers', queijo: 'cheese', 'preciso de': 'I need', 'o meu': 'my own' },
    questions: [
      { prompt: 'When does João go to the market?', options: ['Saturday mornings', 'Sunday afternoons', 'Every evening'], answer: 0, explanation: '“Ao sábado de manhã”.' },
      { prompt: 'How much do the oranges and tomatoes cost?', options: ['€3.50', '€5.30', '€13.00'], answer: 0, explanation: '“Três euros e cinquenta”.' },
      { prompt: 'Why doesn’t he need a bag?', options: ['He has his own', 'He has no money', 'The shop has no bags'], answer: 0, explanation: '“Tenho o meu” = I have my own.' },
    ],
  },
  {
    id: 'sintra-plano',
    destinationId: 'sintra',
    title: 'Um plano para sábado',
    level: 'A1',
    sentences: [
      { pt: 'A Inês envia uma mensagem à Marta: “Queres ir a Sintra no sábado?”', en: 'Inês sends Marta a message: “Do you want to go to Sintra on Saturday?”' },
      { pt: 'A Marta responde: “Boa ideia! Vamos visitar o Palácio da Pena?”', en: 'Marta replies: “Good idea! Shall we visit the Pena Palace?”' },
      { pt: '“Combinado! Encontramo-nos às nove na estação do Rossio.”', en: '“Deal! Let’s meet at nine at Rossio station.”' },
      { pt: 'No sábado, às nove e um quarto, a Marta ainda não está lá.', en: 'On Saturday, at quarter past nine, Marta still isn’t there.' },
      { pt: 'O telemóvel da Inês toca: “Desculpa, estou a chegar!”', en: 'Inês’s phone rings: “Sorry, I’m on my way!”' },
      { pt: 'Finalmente, apanham o comboio e passam um dia fantástico na serra.', en: 'Finally they catch the train and spend a fantastic day in the hills.' },
    ],
    glossary: { envia: 'sends', mensagem: 'message', responde: 'replies', 'ainda não': 'not yet, still not', lá: 'there', telemóvel: 'mobile phone', toca: 'rings', apanham: 'they catch', passam: 'they spend', serra: 'hills, mountains' },
    questions: [
      { prompt: 'Where do they meet?', options: ['At Rossio station', 'At the palace', 'At Marta’s house'], answer: 0, explanation: '“Na estação do Rossio”.' },
      { prompt: 'Is Marta on time?', options: ['No, she’s a bit late', 'Yes, she’s early', 'She cancels'], answer: 0, explanation: 'At 9:15 she’s “a chegar” — on her way.' },
      { prompt: 'How do they get to Sintra?', options: ['By train', 'By bus', 'By car'], answer: 0, explanation: '“Apanham o comboio” = they catch the train.' },
    ],
  },
  {
    id: 'algarve-jantar',
    destinationId: 'algarve',
    title: 'Um jantar em Lagos',
    level: 'A1',
    sentences: [
      { pt: 'Está calor e o sol está a pôr-se em Lagos.', en: 'It’s warm and the sun is setting in Lagos.' },
      { pt: 'O Pedro e a Rita procuram um restaurante perto do mar.', en: 'Pedro and Rita are looking for a restaurant near the sea.' },
      { pt: '— Boa noite, uma mesa para dois, por favor.', en: '— Good evening, a table for two, please.' },
      { pt: 'Na mesa já há pão, azeitonas e manteiga: é o couvert.', en: 'There’s already bread, olives and butter on the table: it’s the couvert.' },
      { pt: 'A Rita pede peixe grelhado e o Pedro, sardinhas assadas.', en: 'Rita orders grilled fish and Pedro, grilled sardines.' },
      { pt: 'No fim, comem uma sobremesa e dizem: — Estava tudo ótimo!', en: 'At the end, they have dessert and say: — Everything was great!' },
    ],
    glossary: { 'está a pôr-se': 'is setting', procuram: 'are looking for', 'já há': 'there is already', pão: 'bread', azeitonas: 'olives', manteiga: 'butter', pede: 'orders', assadas: 'grilled, roasted', 'no fim': 'at the end' },
    questions: [
      { prompt: 'What’s the weather like?', options: ['Warm', 'Rainy', 'Cold'], answer: 0, explanation: '“Está calor”.' },
      { prompt: 'What’s already on the table?', options: ['Bread, olives and butter', 'Dessert', 'The bill'], answer: 0, explanation: 'That’s the couvert — you pay for it if you eat it.' },
      { prompt: 'What does Pedro order?', options: ['Grilled sardines', 'Grilled fish', 'Meat'], answer: 0, explanation: '“Sardinhas assadas”.' },
    ],
  },
  {
    id: 'madeira-ferias',
    destinationId: 'madeira',
    title: 'As minhas férias na Madeira',
    level: 'A2',
    sentences: [
      { pt: 'No verão passado, fui à Madeira com a minha irmã.', en: 'Last summer I went to Madeira with my sister.' },
      { pt: 'Ficámos uma semana no Funchal, num hotel perto do mar.', en: 'We stayed a week in Funchal, in a hotel near the sea.' },
      { pt: 'Primeiro visitámos o mercado e comemos bolo do caco.', en: 'First we visited the market and ate bolo do caco.' },
      { pt: 'Depois caminhámos numa levada nas montanhas. Foi incrível!', en: 'Then we hiked along a levada in the mountains. It was amazing!' },
      { pt: 'Um dia esteve a chover, mas não faz mal: bebemos poncha num café.', en: 'One day it rained, but no problem: we drank poncha in a café.' },
      { pt: 'Gostei muito e quero voltar no próximo ano.', en: 'I really liked it and I want to go back next year.' },
    ],
    glossary: { 'verão passado': 'last summer', irmã: 'sister', ficámos: 'we stayed', visitámos: 'we visited', comemos: 'we ate', caminhámos: 'we hiked', montanhas: 'mountains', 'esteve a chover': 'it was raining', bebemos: 'we drank', poncha: 'Madeira’s rum and lemon drink', voltar: 'to go back', 'próximo ano': 'next year' },
    questions: [
      { prompt: 'Who did the narrator travel with?', options: ['Her sister', 'Her parents', 'Nobody'], answer: 0, explanation: '“Com a minha irmã”.' },
      { prompt: 'How long did they stay?', options: ['A week', 'A month', 'A weekend'], answer: 0, explanation: '“Uma semana”.' },
      { prompt: 'What did they do on the rainy day?', options: ['Drank poncha in a café', 'Went hiking', 'Stayed at the hotel'], answer: 0, explanation: '“Bebemos poncha num café”.' },
    ],
  },
]

export const getStory = (id: string) => stories.find((s) => s.id === id)
