import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { localeFromPath, projectPath, routeMap } from '../../config/routes'
import type { Locale } from '../../types'
import { track } from '../../lib/analytics'

interface LanguageSelectorProps {
  locale: Locale
}

function equivalentPath(pathname: string, target: Locale) {
  const current = localeFromPath(pathname)
  const currentRoutes = routeMap[current]
  const targetRoutes = routeMap[target]
  const projectPrefix = `${currentRoutes.projects}/`

  if (pathname.startsWith(projectPrefix)) {
    return projectPath(target, pathname.slice(projectPrefix.length))
  }

  const page = (Object.keys(currentRoutes) as Array<keyof typeof currentRoutes>).find(
    (key) => currentRoutes[key] === pathname,
  )
  return page ? targetRoutes[page] : targetRoutes.home
}

export function LanguageSelector({ locale }: LanguageSelectorProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [])

  return (
    <div className="language-selector" ref={rootRef}>
      <button
        type="button"
        data-magnetic
        className="language-selector__trigger"
        aria-label={{ es: 'Cambiar idioma', pt: 'Mudar idioma', en: 'Change language' }[locale]}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="language-symbol" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span>{locale.toUpperCase()}</span>
      </button>
      {open && (
        <div className="language-selector__menu" role="menu">
          {(['es', 'pt', 'en'] as Locale[]).map((language) => (
            <Link
              role="menuitem"
              key={language}
              aria-current={language === locale ? 'page' : undefined}
              to={equivalentPath(location.pathname, language)}
              onClick={() => {
                setOpen(false)
                track('language_change', { from: locale, to: language })
              }}
            >
              {language.toUpperCase()}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
