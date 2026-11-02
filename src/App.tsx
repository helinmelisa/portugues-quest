import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import DashboardPage from './pages/Dashboard/DashboardPage'
import ExplorePage from './pages/Explore/ExplorePage'
import LandingPage from './pages/Landing/LandingPage'
import PracticePage from './pages/Practice/PracticePage'
import TutorPage from './pages/Tutor/TutorPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="explore" element={<ExplorePage />} />
          <Route path="practice" element={<PracticePage />} />
          <Route path="tutor" element={<TutorPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
