import { dayKey } from '../utils/date'

export interface PtNote {
  id: string
  en: string
  pt: string
  br: string
  note?: string
}

// European vs Brazilian Portuguese: what you'll hear in Portugal.
export const ptNotes: PtNote[] = [
  { id: 'bus', en: 'bus', pt: 'o autocarro', br: 'o ônibus' },
  { id: 'train', en: 'train', pt: 'o comboio', br: 'o trem' },
  { id: 'phone', en: 'mobile phone', pt: 'o telemóvel', br: 'o celular' },
  { id: 'breakfast', en: 'breakfast', pt: 'o pequeno-almoço', br: 'o café da manhã' },
  { id: 'bathroom', en: 'bathroom', pt: 'a casa de banho', br: 'o banheiro' },
  { id: 'ice-cream', en: 'ice cream', pt: 'o gelado', br: 'o sorvete' },
  { id: 'juice', en: 'juice', pt: 'o sumo', br: 'o suco' },
  { id: 'menu', en: 'menu', pt: 'a ementa', br: 'o cardápio' },
  { id: 'fridge', en: 'fridge', pt: 'o frigorífico', br: 'a geladeira' },
  { id: 'cool', en: 'cool!', pt: 'Fixe!', br: 'Legal!' },
  { id: 'understand', en: 'I understand', pt: 'Percebo', br: 'Entendo', note: 'Both are understood, but “perceber” is the everyday choice in Portugal.' },
  { id: 'name', en: 'My name is…', pt: 'Chamo-me…', br: 'Me chamo…', note: 'In Portugal, pronouns like “me” usually come after the verb.' },
  { id: 'doing', en: 'I am studying', pt: 'Estou a estudar', br: 'Estou estudando', note: 'Portugal uses “estar a + verb” for actions happening now.' },
  { id: 'you', en: 'you (polite)', pt: 'o senhor / a senhora', br: 'você', note: '“Você” exists in Portugal but can sound blunt. Use “tu” with friends.' },
  { id: 'cents', en: 'cents', pt: 'cêntimos', br: 'centavos' },
  { id: 'sixteen', en: '16, 17, 19', pt: 'dezasseis, dezassete, dezanove', br: 'dezesseis, dezessete, dezenove' },
  { id: 'fees', en: 'tuition fees', pt: 'as propinas', br: 'a mensalidade', note: 'In Brazil, “propina” means a bribe, so be careful which country you say it in!' },
]

export function noteForDay(day = dayKey()) {
  const n = [...day].reduce((sum, c) => sum + c.charCodeAt(0) * 7, 0)
  return ptNotes[n % ptNotes.length]
}
