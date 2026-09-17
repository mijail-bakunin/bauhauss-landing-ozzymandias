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
  const socialEntries = Object.entries(brand.socials).map(([network, url]) => ({
    network,
    url,
    icon: `/images/social/${network}.png`,
  }))
  const labels = {
    es: { nav: 'Navegación del pie', social: 'Redes / Canales', top: 'Volver arriba', project: 'Iniciar un proyecto' },
    pt: { nav: 'Navegação do rodapé', social: 'Redes / Canais', top: 'Voltar ao topo', project: 'Iniciar um projeto' },
    en: { nav: 'Footer navigation', social: 'Social / Channels', top: 'Back to top', project: 'Start a project' },
  }[locale]

  return (
    <footer className="site-footer">
      <div className="footer-intro">
        <div className="footer-brand-lockup">
          <BrandMark decorative />
          <div>
            <span>OZ / 00—∞</span>
            <strong>{brand.name}</strong>
          </div>
        </div>
        <p>{t.footerStatement}</p>
        <Link className="footer-project-link" data-magnetic to={`${routeMap[locale].home}#contact`}>
          <span>{labels.project}</span>
          <i aria-hidden="true">↗</i>
        </Link>
      </div>

      <div className="footer-nav-rail">
        <nav aria-label={labels.nav}>
          {navItems.map((item) => (
            <Link data-magnetic key={item.id} to={`${routeMap[locale].home}#${item.id}`}>
              <span>{item.label[locale]}</span><i aria-hidden="true" />
            </Link>
          ))}
          <Link data-magnetic to={routeMap[locale].team}><span>{t.teamLink}</span><i aria-hidden="true" /></Link>
        </nav>
        <Link className="footer-top-link" to={`${routeMap[locale].home}#home`}>
          {labels.top}<span aria-hidden="true">↑</span>
        </Link>
      </div>

      <div className="footer-socials">
        <span>{labels.social}</span>
        <div className="footer-social-list">
          {socialEntries.map(({ network, url, icon }, index) => (
            <a
              data-motion-reactive="self"
              data-motion-sound
              data-motion-strength="3"
              href={url}
              target="_blank"
              rel="noreferrer"
              key={network}
            >
              <span className="footer-social-index">0{index + 1}</span>
              <img src={icon} alt="" aria-hidden="true" />
              <strong>{network}</strong>
              <span aria-hidden="true">↗</span>
            </a>
          ))}
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
