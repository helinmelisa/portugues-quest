import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { RequireAccount } from './components/layout/RequireAccount'
import LoginPage from './pages/Auth/LoginPage'
import { ProgressProvider } from './features/progress/ProgressProvider'
import DashboardPage from './pages/Dashboard/DashboardPage'
import DestinationPage from './pages/Explore/DestinationPage'
import VidaPage from './pages/Explore/VidaPage'
import ExplorePage from './pages/Explore/ExplorePage'
import LandingPage from './pages/Landing/LandingPage'
import LessonPage from './pages/Lesson/LessonPage'
import OnboardingPage from './pages/Onboarding/OnboardingPage'
import PracticePage from './pages/Practice/PracticePage'
import GrammarPage from './pages/Practice/GrammarPage'
import MistakesPage from './pages/Practice/MistakesPage'
import StoriesPage from './pages/Practice/StoriesPage'
import StoryPage from './pages/Practice/StoryPage'
import PortugalVsBrazilPage from './pages/Practice/PortugalVsBrazilPage'
import WordGardenPage from './pages/Practice/WordGardenPage'
import SettingsPage from './pages/Settings/SettingsPage'
import CertificatePage from './pages/Certificate/CertificatePage'
import TutorPage from './pages/Tutor/TutorPage'

export default function App() {
  return (
    <ProgressProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/onboarding" element={<RequireAccount onboarded={false}><OnboardingPage /></RequireAccount>} />
          <Route path="/app" element={<RequireAccount><AppLayout /></RequireAccount>}>
            <Route index element={<DashboardPage />} />
            <Route path="explore" element={<ExplorePage />} />
            <Route path="explore/vida" element={<VidaPage />} />
            <Route path="explore/:destinationId" element={<DestinationPage />} />
            <Route path="practice" element={<PracticePage />} />
            <Route path="practice/words" element={<WordGardenPage />} />
            <Route path="practice/grammar" element={<GrammarPage />} />
            <Route path="practice/stories" element={<StoriesPage />} />
            <Route path="practice/stories/:storyId" element={<StoryPage />} />
            <Route path="practice/mistakes" element={<MistakesPage />} />
            <Route path="practice/portugal-vs-brazil" element={<PortugalVsBrazilPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="certificate/:level" element={<CertificatePage />} />
            <Route path="tutor" element={<TutorPage />} />
          </Route>
          <Route path="/lesson/:lessonId" element={<RequireAccount><LessonPage /></RequireAccount>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ProgressProvider>
  )
}
