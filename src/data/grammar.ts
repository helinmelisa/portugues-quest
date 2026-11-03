export interface GrammarSection {
  text: string
  examples?: { pt: string; en: string }[]
  table?: string[][] // first row is the header
}

export interface GrammarBite {
  id: string
  title: string
  summary: string
  sections: GrammarSection[]
}

export const grammarBites: GrammarBite[] = [
  {
    id: 'gender',
    title: 'Gender and articles',
    summary: 'Every noun is masculine or feminine — and “the” and “a” change to match.',
    sections: [
      {
        text: 'Most words ending in -o are masculine and most ending in -a are feminine. The articles follow:',
        table: [['', 'masculine', 'feminine'], ['the', 'o / os', 'a / as'], ['a, some', 'um / uns', 'uma / umas']],
      },
      { text: 'Examples:', examples: [{ pt: 'o café, um galão', en: 'the coffee, a milky coffee' }, { pt: 'a conta, uma bica', en: 'the bill, an espresso' }, { pt: 'os bolos, as calças', en: 'the cakes, the trousers' }] },
      { text: 'Watch out for a few exceptions:', examples: [{ pt: 'o dia, o mapa', en: 'the day, the map (masculine!)' }, { pt: 'a mão', en: 'the hand (feminine!)' }] },
      { text: 'Adjectives match too. And in Portugal, people often put “o / a” before names.', examples: [{ pt: 'uma casa pequena', en: 'a small house' }, { pt: 'A Maria está em casa.', en: 'Maria is at home.' }] },
    ],
  },
  {
    id: 'ser-estar',
    title: 'Ser vs estar',
    summary: 'Two verbs for “to be”: who you are vs how or where you are right now.',
    sections: [
      { text: 'Use “ser” for identity: who you are, where you’re from, your job.', examples: [{ pt: 'Sou estudante.', en: 'I am a student.' }, { pt: 'Ela é de Itália.', en: 'She is from Italy.' }] },
      { text: 'Use “estar” for states and locations that can change.', examples: [{ pt: 'Estou cansado.', en: 'I am tired.' }, { pt: 'Estamos em Lisboa.', en: 'We are in Lisbon.' }, { pt: 'O comboio está atrasado.', en: 'The train is delayed.' }] },
      {
        text: 'Present tense:',
        table: [['', 'ser', 'estar'], ['eu', 'sou', 'estou'], ['tu', 'és', 'estás'], ['ele / ela / você', 'é', 'está'], ['nós', 'somos', 'estamos'], ['eles / elas / vocês', 'são', 'estão']],
      },
      { text: 'In Portugal, “estar a + verb” describes what’s happening now.', examples: [{ pt: 'Estou a estudar.', en: 'I am studying.' }] },
    ],
  },
  {
    id: 'ar-verbs',
    title: 'Regular -ar verbs',
    summary: 'The biggest verb family. Learn one pattern and you know hundreds of verbs.',
    sections: [
      {
        text: 'Take off -ar and add the endings. Here is “falar” (to speak):',
        table: [['', 'falar'], ['eu', 'falo'], ['tu', 'falas'], ['ele / ela / você', 'fala'], ['nós', 'falamos'], ['eles / elas / vocês', 'falam']],
      },
      { text: 'The same pattern works for estudar, trabalhar, morar, jantar, almoçar…', examples: [{ pt: 'Estudo Medicina.', en: 'I study Medicine.' }, { pt: 'Trabalhas aqui?', en: 'Do you work here?' }, { pt: 'Jantamos às oito.', en: 'We have dinner at eight.' }] },
      { text: 'You don’t need “vós” — use “vocês” for “you” (plural).' },
    ],
  },
  {
    id: 'pronouns',
    title: 'Where “me” goes',
    summary: 'In Portugal, little words like “me” and “te” usually come after the verb.',
    sections: [
      { text: 'In normal positive sentences, the pronoun goes after the verb with a hyphen.', examples: [{ pt: 'Chamo-me Ana.', en: 'My name is Ana.' }, { pt: 'Levanto-me às sete.', en: 'I get up at seven.' }, { pt: 'Dê-me um café.', en: 'Give me a coffee.' }] },
      { text: 'It moves before the verb after “não”, question words and some little words like “também”.', examples: [{ pt: 'Não me chamo Ana.', en: 'My name isn’t Ana.' }, { pt: 'Como te chamas?', en: 'What’s your name?' }, { pt: 'Também me levanto cedo.', en: 'I also get up early.' }] },
      { text: 'Brazilians usually put it before the verb (“Me chamo Ana”), so this is one of the clearest signs of European Portuguese.' },
    ],
  },
  {
    id: 'er-ir-verbs',
    title: 'Regular -er and -ir verbs',
    summary: 'Two more verb families, with endings very close to -ar verbs.',
    sections: [
      {
        text: 'Take off -er / -ir and add these endings:',
        table: [['', 'comer (eat)', 'abrir (open)'], ['eu', 'como', 'abro'], ['tu', 'comes', 'abres'], ['ele / ela / você', 'come', 'abre'], ['nós', 'comemos', 'abrimos'], ['eles / elas / vocês', 'comem', 'abrem']],
      },
      { text: 'Other useful verbs: beber (drink), viver (live), escrever (write), partir (leave), decidir (decide).', examples: [{ pt: 'Não como carne.', en: 'I don’t eat meat.' }, { pt: 'Vives em Lisboa?', en: 'Do you live in Lisbon?' }, { pt: 'O comboio parte às dez.', en: 'The train leaves at ten.' }] },
    ],
  },
  {
    id: 'ir-infinitive',
    title: 'Ir + verb: the near future',
    summary: 'The easiest way to talk about plans: “I’m going to…”.',
    sections: [
      { text: 'Use the present of “ir” (to go) plus any verb in its basic form.', table: [['', 'ir'], ['eu', 'vou'], ['tu', 'vais'], ['ele / ela / você', 'vai'], ['nós', 'vamos'], ['eles / elas / vocês', 'vão']] },
      { text: 'Examples:', examples: [{ pt: 'Vou visitar Sintra.', en: 'I’m going to visit Sintra.' }, { pt: 'Vais jantar connosco?', en: 'Are you going to have dinner with us?' }, { pt: 'Vamos nadar!', en: 'Let’s swim! / We’re going to swim!' }] },
      { text: '“Vamos” on its own is also a friendly way to suggest something: “Vamos?” = Shall we go?' },
    ],
  },
  {
    id: 'past',
    title: 'The past tense (pretérito perfeito)',
    summary: 'For finished actions: I went, I ate, I visited.',
    sections: [
      {
        text: 'Regular endings:',
        table: [['', '-ar (visitar)', '-er (comer)', '-ir (partir)'], ['eu', 'visitei', 'comi', 'parti'], ['tu', 'visitaste', 'comeste', 'partiste'], ['ele / ela / você', 'visitou', 'comeu', 'partiu'], ['nós', 'visitámos', 'comemos', 'partimos'], ['eles / elas / vocês', 'visitaram', 'comeram', 'partiram']],
      },
      { text: 'In Portugal, the “nós” form of -ar verbs has an accent in the past: “visitámos” (we visited) vs “visitamos” (we visit).' },
      { text: '“Ir” (go) and “ser” (be) share the same irregular past: fui, foste, foi, fomos, foram.', examples: [{ pt: 'Fui ao Funchal.', en: 'I went to Funchal.' }, { pt: 'Foi incrível!', en: 'It was amazing!' }] },
    ],
  },
]

export const getGrammarBite = (id: string) => grammarBites.find((g) => g.id === id)
