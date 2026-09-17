import { Link } from 'react-router-dom'
import { brand } from '../../config/brand'
import { copy } from '../../data/content'
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
    es: { social: 'Redes', top: 'Volver arriba', talk: 'Hablemos', signature: 'Sistemas · Productos · Experiencias' },
    pt: { social: 'Redes', top: 'Voltar ao topo', talk: 'Vamos conversar', signature: 'Sistemas · Produtos · Experiências' },
    en: { social: 'Social channels', top: 'Back to top', talk: 'Let’s talk', signature: 'Systems · Products · Experiences' },
  }[locale]

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <Link className="footer-identity" data-magnetic to={routeMap[locale].home}>
          <BrandMark decorative />
          <div>
            <strong>{brand.name}</strong>
            <span>{labels.signature}</span>
          </div>
        </Link>

        <Link className="footer-talk" data-magnetic to={`${routeMap[locale].home}#contact`}>
          <span>{labels.talk}</span>
          <i aria-hidden="true">↗</i>
        </Link>

        <nav className="footer-social-list" aria-label={labels.social}>
          {socialEntries.map(({ network, url, icon }) => (
            <a
              data-motion-reactive="self"
              data-motion-strength="2"
              href={url}
              target="_blank"
              rel="noreferrer"
              key={network}
            >
              <img src={icon} alt="" aria-hidden="true" />
              <span>{network}</span>
            </a>
          ))}
        </nav>
      </div>

      <div className="footer-meta">
        <span>© {copyright} {brand.name}</span>
        <span className="footer-coordinate">ARG / 34°36′S</span>
        <div>
          <Link to={routeMap[locale].privacy}>{t.privacy}</Link>
          <Link to={routeMap[locale].terms}>{t.terms}</Link>
          <button type="button" onClick={onOpenPreferences}>{t.preferences}</button>
          <Link className="footer-top-link" to={`${routeMap[locale].home}#home`}>
            {labels.top}<span aria-hidden="true">↑</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}
