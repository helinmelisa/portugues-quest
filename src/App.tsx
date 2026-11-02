import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { ProgressProvider } from './features/progress/ProgressProvider'
import DashboardPage from './pages/Dashboard/DashboardPage'
import DestinationPage from './pages/Explore/DestinationPage'
import ExplorePage from './pages/Explore/ExplorePage'
import LandingPage from './pages/Landing/LandingPage'
import LessonPage from './pages/Lesson/LessonPage'
import OnboardingPage from './pages/Onboarding/OnboardingPage'
import PracticePage from './pages/Practice/PracticePage'
import TutorPage from './pages/Tutor/TutorPage'

export default function App() {
  return (
    <ProgressProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="explore" element={<ExplorePage />} />
            <Route path="explore/:destinationId" element={<DestinationPage />} />
            <Route path="practice" element={<PracticePage />} />
            <Route path="tutor" element={<TutorPage />} />
          </Route>
          <Route path="/lesson/:lessonId" element={<LessonPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ProgressProvider>
  )
}
