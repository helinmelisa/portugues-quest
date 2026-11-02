export interface ExerciseResponse {
  ready: boolean
  correct: boolean
}

export interface ExerciseProps<E> {
  exercise: E
  checked: boolean
  onChange: (response: ExerciseResponse) => void
}
