import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { AmbientCanvas } from '../geometry/AmbientCanvas'
import { Navbar } from '../navigation/Navbar'
import { SectionRail } from './SectionRail'
import { Footer } from './Footer'
import { PrivacyCenter } from '../ui/PrivacyCenter'
import { useTheme } from '../../hooks/useTheme'
import { useSound } from '../../hooks/useSound'
import { initAnalytics, track, trackPageView } from '../../lib/analytics'
import type { Locale } from '../../types'
import { ArtCursor } from '../motion/ArtCursor'
import { RouteTransition } from '../motion/RouteTransition'
import { ScrollProgress } from '../motion/ScrollProgress'
import { useEditorialMotion } from '../../hooks/useEditorialMotion'
import { useMotionField } from '../../hooks/useMotionField'

interface SiteFrameProps {
  locale: Locale
  children: ReactNode | ((sound: ReturnType<typeof useSound>) => ReactNode)
  showRail?: boolean
}

export function SiteFrame({ locale, children, showRail = false }: SiteFrameProps) {
  const frameRef = useRef<HTMLDivElement>(null)
  const { theme, toggleTheme } = useTheme()
  const sound = useSound()
  const location = useLocation()
  const [privacyOpen, setPrivacyOpen] = useState(false)
  const skipLabel = { es: 'Saltar al contenido', pt: 'Pular para o conteúdo', en: 'Skip to content' }[locale]
  useEditorialMotion(frameRef)
  useMotionField(frameRef, sound.cue)

  useEffect(() => {
    initAnalytics()
    trackPageView(location.pathname, locale)
    const qualified = window.setTimeout(() => track('qualified_visit', { reason: 'time_30s', locale }), 30000)
    return () => window.clearTimeout(qualified)
  }, [locale, location.pathname])

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      return
    }
    const id = window.decodeURIComponent(location.hash.slice(1))
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 40)
  }, [location.hash, location.pathname])

  return (
    <div className="site-frame" ref={frameRef}>
      <a className="skip-link" href="#main-content">{skipLabel}</a>
      <ArtCursor />
      <RouteTransition />
      <ScrollProgress />
      <AmbientCanvas />
      <Navbar
        locale={locale}
        theme={theme}
        onThemeToggle={(event) => {
          toggleTheme(event)
          track('theme_change', { theme: theme === 'light' ? 'dark' : 'light' })
        }}
        soundEnabled={sound.soundEnabled}
        onSoundToggle={sound.toggleSound}
      />
      {showRail && <SectionRail locale={locale} />}
      <main id="main-content">{typeof children === 'function' ? children(sound) : children}</main>
      <Footer locale={locale} onOpenPreferences={() => setPrivacyOpen(true)} />
      <PrivacyCenter locale={locale} open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </div>
  )
}
