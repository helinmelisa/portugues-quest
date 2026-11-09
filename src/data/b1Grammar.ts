import type { GrammarBite } from './grammar'

export const b1Grammar: GrammarBite[] = [
  {
    id: 'b1-connectors',
    title: 'Linking opinions and reasons',
    summary: 'Build an argument with porque, por isso, no entanto and além disso.',
    sections: [
      {
        text: 'Give a reason with porque, then a consequence with por isso.',
        examples: [
          { pt: 'Estava cansado, por isso fiquei em casa.', en: 'I was tired, so I stayed at home.' },
          { pt: 'Fiquei em casa porque estava cansado.', en: 'I stayed at home because I was tired.' },
        ],
      },
      {
        text: 'Use no entanto for contrast and além disso to add another point.',
        examples: [
          { pt: 'É caro. No entanto, é muito útil.', en: 'It is expensive. However, it is very useful.' },
          { pt: 'Fica perto. Além disso, é barato.', en: 'It is nearby. Furthermore, it is cheap.' },
        ],
      },
      {
        text: 'Useful opinion frames:',
        examples: [
          { pt: 'Na minha opinião, devíamos tentar.', en: 'In my opinion, we should try.' },
          { pt: 'Concordo contigo, mas…', en: 'I agree with you, but…' },
        ],
      },
    ],
  },
  {
    id: 'conditional',
    title: 'The conditional',
    summary: 'Would, could and polite suggestions: falaria, poderia, gostaria.',
    sections: [
      {
        text: 'Add these endings to the infinitive:',
        table: [
          ['', 'falar'],
          ['eu', 'falaria'],
          ['tu', 'falarias'],
          ['ele / ela', 'falaria'],
          ['nós', 'falaríamos'],
          ['eles / elas', 'falariam'],
        ],
      },
      {
        text: 'Use it for hypothetical actions and polite requests. Common irregular stems: fazer → far-, dizer → dir-, trazer → trar-.',
        examples: [
          { pt: 'Poderia repetir, por favor?', en: 'Could you repeat, please?' },
          { pt: 'No seu lugar, falaria com a equipa.', en: 'In your position, I would speak to the team.' },
          { pt: 'Gostaria de saber mais.', en: 'I would like to know more.' },
        ],
      },
      {
        text: 'Learn “se fosse possível…” as a useful frame. The full past subjunctive pattern comes later.',
        examples: [
          { pt: 'Se fosse possível, sairíamos mais cedo.', en: 'If it were possible, we would leave earlier.' },
        ],
      },
    ],
  },
  {
    id: 'future',
    title: 'The written future',
    summary: 'Falarei, terei, farei: predictions, promises and written announcements.',
    sections: [
      {
        text: 'Attach the same endings to -ar, -er and -ir infinitives.',
        table: [
          ['', 'falar'],
          ['eu', 'falarei'],
          ['tu', 'falarás'],
          ['ele / ela', 'falará'],
          ['nós', 'falaremos'],
          ['eles / elas', 'falarão'],
        ],
      },
      {
        text: 'Three irregular stems: fazer → far-, dizer → dir-, trazer → trar-.',
        examples: [
          { pt: 'Enviarei a resposta amanhã.', en: 'I will send the reply tomorrow.' },
          { pt: 'Farei o possível.', en: 'I will do what I can.' },
          { pt: 'Provavelmente haverá menos trânsito.', en: 'There will probably be less traffic.' },
        ],
      },
      {
        text: 'The spoken ir + infinitive form remains common too: vou enviar. Recognise both forms; you do not need the written future for every plan.',
      },
    ],
  },
  {
    id: 'subjunctive',
    title: 'First steps into the subjunctive',
    summary: 'Hopes, uncertainty and recommendations: espero que, talvez, é importante que.',
    sections: [
      {
        text: 'For many regular verbs, start with the eu present form, remove -o and switch the ending: falar → fale; comer → coma; abrir → abra.',
        table: [
          ['', 'falar', 'comer'],
          ['eu / ele / ela', 'fale', 'coma'],
          ['tu', 'fales', 'comas'],
          ['nós', 'falemos', 'comamos'],
          ['eles / elas', 'falem', 'comam'],
        ],
      },
      {
        text: 'Useful frames and irregular forms:',
        examples: [
          { pt: 'Espero que esteja tudo bem.', en: 'I hope everything is well.' },
          { pt: 'É importante que chegues cedo.', en: 'It is important that you arrive early.' },
          { pt: 'Talvez ele venha amanhã.', en: 'Perhaps he will come tomorrow.' },
          { pt: 'Espero que seja útil.', en: 'I hope it is useful.' },
        ],
      },
      {
        text: 'For now, practise these frames. They express hopes or uncertainty, rather than reporting a confirmed fact.',
      },
    ],
  },
]
