import type { Destination } from '../types'
import { lisboaLessons } from './curriculum/lisboa'
import { portoLessons } from './curriculum/porto'

export const destinations: Destination[] = [
  { id: 'lisboa', name: 'Lisboa', theme: 'First days in Portugal', description: 'Say your first “Olá” and introduce yourself in the city of seven hills.', level: 'A0', unlocked: true, map: { x: 22, y: 64 }, lessonIds: lisboaLessons.map((l) => l.id) },
  { id: 'porto', name: 'Porto', theme: 'Everyday café life', description: 'Order a coffee, a pastel de nata and ask for the bill by the Douro.', level: 'A0', unlocked: true, map: { x: 30, y: 20 }, lessonIds: portoLessons.map((l) => l.id) },
  { id: 'braga', name: 'Braga', theme: 'Shopping and everyday life', description: 'Prices, quantities and the local mercado.', level: 'A1', unlocked: false, map: { x: 36, y: 9 }, lessonIds: [] },
  { id: 'aveiro', name: 'Aveiro', theme: 'Getting around', description: 'Tickets, comboios and asking the way.', level: 'A1', unlocked: false, map: { x: 28, y: 32 }, lessonIds: [] },
  { id: 'coimbra', name: 'Coimbra', theme: 'Student life', description: 'Numbers, days, times and your daily routine.', level: 'A1', unlocked: false, map: { x: 34, y: 41 }, lessonIds: [] },
  { id: 'sintra', name: 'Sintra', theme: 'Day trips', description: 'Palaces, forests and making plans with friends.', level: 'A1', unlocked: false, map: { x: 14, y: 60 }, lessonIds: [] },
  { id: 'algarve', name: 'Algarve', theme: 'Leisure and social life', description: 'Weather, the beach and casual conversation.', level: 'A1', unlocked: false, map: { x: 40, y: 92 }, lessonIds: [] },
  { id: 'madeira', name: 'Madeira', theme: 'Island adventures', description: 'Nature, hiking and talking about your holidays.', level: 'A2', unlocked: false, map: { x: 80, y: 85 }, lessonIds: [] },
]
