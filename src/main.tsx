import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { onCLS, onINP, onLCP } from 'web-vitals'
import './index.css'
import App from './App.tsx'
import { track } from './lib/analytics'

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

if (!window.location.hash) {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

const reportVital = ({ name, value, rating }: { name: string; value: number; rating: string }) => {
  track('web_vital', { name, value: Math.round(value * 100) / 100, rating })
}

onCLS(reportVital)
onINP(reportVital)
onLCP(reportVital)
