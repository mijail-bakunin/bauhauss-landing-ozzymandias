import { Link } from 'react-router-dom'
import { routeMap } from '../config/routes'
import type { Locale } from '../types'
import { SiteFrame } from '../components/layout/SiteFrame'
import { ScrambleText } from '../components/motion/ScrambleText'

export function NotFoundPage({ locale }: { locale: Locale }) {
  return (
    <SiteFrame locale={locale}>
      <section className="inner-page not-found">
        <span>ERROR / GEOMETRY LOST</span>
        <h1><ScrambleText text="404" duration={700} /></h1>
        <p>La estructura solicitada todavía no existe.</p>
        <Link to={routeMap[locale].home}>← Ozzymandias</Link>
      </section>
    </SiteFrame>
  )
}
