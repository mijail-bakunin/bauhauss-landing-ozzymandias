import { Navigate, Route, Routes, useLocation, type Location } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { TeamPage } from './pages/TeamPage'
import { ProjectPage } from './pages/ProjectPage'
import { LegalPage } from './pages/LegalPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProjectModal } from './components/portfolio/ProjectModal'
import { localeFromPath } from './config/routes'

interface RouteState {
  backgroundLocation?: Location
}

function AppRoutes() {
  const location = useLocation()
  const state = location.state as RouteState | null
  const background = state?.backgroundLocation
  const locale = localeFromPath(location.pathname)

  return (
    <>
      <Routes location={background || location}>
        <Route path="/" element={<HomePage locale="es" />} />
        <Route path="/pt" element={<HomePage locale="pt" />} />
        <Route path="/en" element={<HomePage locale="en" />} />

        <Route path="/equipo" element={<TeamPage locale="es" />} />
        <Route path="/pt/equipe" element={<TeamPage locale="pt" />} />
        <Route path="/en/team" element={<TeamPage locale="en" />} />

        <Route path="/proyectos/:slug" element={<ProjectPage locale="es" />} />
        <Route path="/pt/projetos/:slug" element={<ProjectPage locale="pt" />} />
        <Route path="/en/projects/:slug" element={<ProjectPage locale="en" />} />

        <Route path="/privacidad" element={<LegalPage locale="es" kind="privacy" />} />
        <Route path="/terminos" element={<LegalPage locale="es" kind="terms" />} />
        <Route path="/pt/privacidade" element={<LegalPage locale="pt" kind="privacy" />} />
        <Route path="/pt/termos" element={<LegalPage locale="pt" kind="terms" />} />
        <Route path="/en/privacy" element={<LegalPage locale="en" kind="privacy" />} />
        <Route path="/en/terms" element={<LegalPage locale="en" kind="terms" />} />

        <Route path="/team" element={<Navigate to="/equipo" replace />} />
        <Route path="/projects/:slug" element={<ProjectPage locale="es" />} />
        <Route path="*" element={<NotFoundPage locale={locale} />} />
      </Routes>

      {background && (
        <Routes>
          <Route path="/proyectos/:slug" element={<ProjectModal locale="es" />} />
          <Route path="/pt/projetos/:slug" element={<ProjectModal locale="pt" />} />
          <Route path="/en/projects/:slug" element={<ProjectModal locale="en" />} />
        </Routes>
      )}
    </>
  )
}

export default function App() {
  return <AppRoutes />
}

