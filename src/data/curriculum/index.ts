import { vidaLessons } from './vida'
import { b1Lessons } from './b1'
import type { Lesson } from '../../types'
import { algarveLessons } from './algarve'
import { aveiroLessons } from './aveiro'
import { bragaLessons } from './braga'
import { coimbraLessons } from './coimbra'
import { lisboaLessons } from './lisboa'
import { madeiraLessons } from './madeira'
import { portoLessons } from './porto'
import { sintraLessons } from './sintra'

export const lessons: Lesson[] = [...lisboaLessons, ...portoLessons, ...coimbraLessons, ...aveiroLessons, ...bragaLessons, ...sintraLessons, ...algarveLessons, ...madeiraLessons, ...vidaLessons, ...b1Lessons]

export const getLesson = (id: string) => lessons.find((l) => l.id === id)
export const isLessonAvailable = (lesson: Lesson) => lesson.exercises.length > 0
