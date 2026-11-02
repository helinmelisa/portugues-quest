import type { UserProfile } from '../../types'

export interface OnboardingStep {
  key: keyof UserProfile
  title: string
  subtitle?: string
  optional: boolean
  options: { value: string | number; label: string; hint?: string }[]
}

export const onboardingSteps: OnboardingStep[] = [
  {
    key: 'interfaceLanguage',
    title: 'Which language should we explain things in?',
    subtitle: 'More languages are coming soon.',
    optional: false,
    options: [{ value: 'en', label: 'English' }],
  },
  {
    key: 'motivation',
    title: 'What brings you to Portuguese?',
    optional: true,
    options: [
      { value: 'live', label: 'I live in Portugal' },
      { value: 'moving', label: 'I am moving to Portugal' },
      { value: 'people', label: 'I want to talk with Portuguese people' },
      { value: 'study-work', label: 'I want to study or work in Portugal' },
      { value: 'fun', label: 'I am learning for fun' },
    ],
  },
  {
    key: 'experience',
    title: 'Have you studied Portuguese before?',
    optional: true,
    options: [
      { value: 'none', label: 'Never — this is brand new' },
      { value: 'some-pt', label: 'A little European Portuguese' },
      { value: 'brazilian', label: 'Some Brazilian Portuguese', hint: 'We’ll point out where Portugal says it differently.' },
      { value: 'classes', label: 'I took classes before' },
    ],
  },
  {
    key: 'level',
    title: 'How would you describe your level?',
    optional: true,
    options: [
      { value: 'A0', label: 'Complete beginner', hint: 'I know “olá” and maybe “obrigado”.' },
      { value: 'A1', label: 'I know some basics', hint: 'I can greet people and order a coffee.' },
    ],
  },
  {
    key: 'dailyGoalMinutes',
    title: 'Pick a daily goal',
    subtitle: 'You can always change it later. Little and often works best.',
    optional: false,
    options: [
      { value: 5, label: '5 minutes a day', hint: 'Casual' },
      { value: 10, label: '10 minutes a day', hint: 'Regular' },
      { value: 15, label: '15 minutes a day', hint: 'Serious' },
      { value: 20, label: '20 minutes a day', hint: 'Intense' },
    ],
  },
]
