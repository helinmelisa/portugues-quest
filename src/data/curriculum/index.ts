import type { Lesson } from '../../types'
import { lisboaLessons } from './lisboa'
import { portoLessons } from './porto'

export const lessons: Lesson[] = [...lisboaLessons, ...portoLessons]

export const getLesson = (id: string) => lessons.find((l) => l.id === id)
export const isLessonAvailable = (lesson: Lesson) => lesson.exercises.length > 0
