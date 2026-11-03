import type { Lesson } from '../../types'
import { aveiroLessons } from './aveiro'
import { bragaLessons } from './braga'
import { coimbraLessons } from './coimbra'
import { lisboaLessons } from './lisboa'
import { portoLessons } from './porto'

export const lessons: Lesson[] = [...lisboaLessons, ...portoLessons, ...coimbraLessons, ...aveiroLessons, ...bragaLessons]

export const getLesson = (id: string) => lessons.find((l) => l.id === id)
export const isLessonAvailable = (lesson: Lesson) => lesson.exercises.length > 0
