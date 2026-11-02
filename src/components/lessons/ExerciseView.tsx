import type { Exercise } from '../../types'
import { FillBlank } from './FillBlank'
import { Listening } from './Listening'
import { Matching } from './Matching'
import { MultipleChoice } from './MultipleChoice'
import { SentenceBuild } from './SentenceBuild'
import type { ExerciseProps } from './types'

export function ExerciseView({ exercise, ...props }: ExerciseProps<Exercise>) {
  switch (exercise.type) {
    case 'multiple-choice':
      return <MultipleChoice exercise={exercise} {...props} />
    case 'fill-blank':
      return <FillBlank exercise={exercise} {...props} />
    case 'sentence-build':
      return <SentenceBuild exercise={exercise} {...props} />
    case 'matching':
      return <Matching exercise={exercise} {...props} />
    case 'listening':
      return <Listening exercise={exercise} {...props} />
  }
}
