import { useEffect, useState, type MouseEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { brand } from '../../config/brand'
import { navItems } from '../../data/content'
import { routeMap } from '../../config/routes'
import type { Locale, Theme } from '../../types'
import { BrandMark } from '../branding/BrandMark'
import { GeometricWordmark } from '../branding/GeometricWordmark'
import { LanguageSelector } from './LanguageSelector'
import { ThemeToggle } from './ThemeToggle'
import { SoundToggle } from './SoundToggle'
import { track } from '../../lib/analytics'

interface NavbarProps {
  locale: Locale
  theme: Theme
  onThemeToggle: (event: MouseEvent<HTMLButtonElement>) => void
  soundEnabled: boolean
  onSoundToggle: () => void
}

export function Navbar({ locale, theme, onThemeToggle, soundEnabled, onSoundToggle }: NavbarProps) {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const isInnerPage = location.pathname !== routeMap[locale].home
  const aria = {
    es: { nav: 'Navegación principal', home: 'inicio', open: 'Abrir menú', close: 'Cerrar menú' },
    pt: { nav: 'Navegação principal', home: 'início', open: 'Abrir menu', close: 'Fechar menu' },
    en: { nav: 'Main navigation', home: 'home', open: 'Open menu', close: 'Close menu' },
  }[locale]

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <header className={`site-header ${scrolled ? 'site-header--scrolled' : ''} ${isInnerPage ? 'site-header--inner' : ''}`}>
      <nav className="navbar" aria-label={aria.nav}>
        <Link className="nav-brand" data-magnetic to={routeMap[locale].home} aria-label={`${brand.name}, ${aria.home}`}>
          <BrandMark decorative />
          <span className="nav-wordmark" id="brand-dock">
            <GeometricWordmark name={brand.name} density={1} />
          </span>
        </Link>

        <button
          className="menu-trigger"
          data-magnetic
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-menu"
          aria-label={menuOpen ? aria.close : aria.open}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span />
          <span />
        </button>

        <div className={`nav-panel ${menuOpen ? 'nav-panel--open' : ''}`} id="primary-menu">
          <div className="nav-links">
            {navItems.map((item) => (
              <Link
                data-magnetic
                key={item.id}
                to={`${routeMap[locale].home}#${item.id}`}
                onClick={() => {
                  setMenuOpen(false)
                  track('cta_click', { target: item.id, placement: 'navbar' })
                }}
              >
                <span>{item.label[locale]}</span>
                <i aria-hidden="true" />
              </Link>
            ))}
          </div>
          <div className="nav-tools">
            <LanguageSelector locale={locale} />
            <SoundToggle enabled={soundEnabled} locale={locale} onToggle={onSoundToggle} />
            <ThemeToggle theme={theme} locale={locale} onToggle={onThemeToggle} />
          </div>
        </div>
      </nav>
    </header>
  )
}
