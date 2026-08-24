import { Link } from 'react-router-dom'
import { brand } from '../../config/brand'
import { copy, navItems } from '../../data/content'
import { routeMap } from '../../config/routes'
import type { Locale } from '../../types'
import { BrandMark } from '../branding/BrandMark'

interface FooterProps {
  locale: Locale
  onOpenPreferences: () => void
}

export function Footer({ locale, onOpenPreferences }: FooterProps) {
  const t = copy[locale]
  const year = new Date().getFullYear()
  const copyright = year === brand.copyrightStartYear ? year : `${brand.copyrightStartYear}—${year}`
  const socialEntries = Object.entries(brand.socials).filter(([, url]) => Boolean(url))
  const placeholders = {
    es: { nav: 'Navegación del pie', email: 'Email / pendiente', location: 'Argentina / ubicación pendiente' },
    pt: { nav: 'Navegação do rodapé', email: 'Email / pendente', location: 'Argentina / localização pendente' },
    en: { nav: 'Footer navigation', email: 'Email / pending', location: 'Argentina / location pending' },
  }[locale]

  return (
    <footer className="site-footer">
      <div className="footer-primary">
        <div className="footer-brand">
          <BrandMark decorative />
          <strong>{brand.name}</strong>
          <span>{t.footerStatement}</span>
        </div>
        <nav aria-label={placeholders.nav}>
          {navItems.map((item) => (
            <Link key={item.id} to={`${routeMap[locale].home}#${item.id}`}>{item.label[locale]}</Link>
          ))}
          <Link to={routeMap[locale].team}>{t.teamLink}</Link>
        </nav>
        <div className="footer-contact">
          {brand.email ? <a href={`mailto:${brand.email}`}>{brand.email}</a> : <span>{placeholders.email}</span>}
          {brand.location ? <span>{brand.location}</span> : <span>{placeholders.location}</span>}
          {socialEntries.map(([network, url]) => <a href={url} key={network}>{network}</a>)}
        </div>
      </div>
      <div className="footer-secondary">
        <span>© {copyright} {brand.name}</span>
        <div>
          <Link to={routeMap[locale].privacy}>{t.privacy}</Link>
          <Link to={routeMap[locale].terms}>{t.terms}</Link>
          <button type="button" onClick={onOpenPreferences}>{t.preferences}</button>
        </div>
      </div>
    </footer>
  )
}
