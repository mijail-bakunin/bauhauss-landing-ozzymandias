import { brand } from '../config/brand'
import type { Locale } from '../types'
import { SiteFrame } from '../components/layout/SiteFrame'
import { Seo } from '../components/Seo'
import { KineticText } from '../components/motion/KineticText'
import { ScrambleText } from '../components/motion/ScrambleText'

const labels = {
  es: { eyebrow: 'Equipo / Arquitectura preparada', title: 'Personas distintas. Una práctica compartida.', note: 'Los perfiles son placeholders configurables y no representan integrantes reales.', role: 'Especialidad pendiente' },
  pt: { eyebrow: 'Equipe / Arquitetura preparada', title: 'Pessoas diferentes. Uma prática compartilhada.', note: 'Os perfis são placeholders configuráveis e não representam integrantes reais.', role: 'Especialidade pendente' },
  en: { eyebrow: 'Team / Architecture prepared', title: 'Different people. One shared practice.', note: 'Profiles are configurable placeholders and do not represent real team members.', role: 'Specialty pending' },
} as const

export function TeamPage({ locale }: { locale: Locale }) {
  const t = labels[locale]
  return (
    <SiteFrame locale={locale}>
      <Seo locale={locale} page="team" title={locale === 'es' ? 'Equipo' : locale === 'pt' ? 'Equipe' : 'Team'} />
      <section className="inner-page team-page" aria-labelledby="team-title">
        <header className="inner-page__header">
          <span className="eyebrow">{t.eyebrow}</span>
          <h1 id="team-title"><KineticText text={t.title} /></h1>
          <p>{t.note}</p>
        </header>
        <div className="team-grid">
          {Array.from({ length: 6 }, (_, index) => (
            <article className="team-card" key={index}>
              <div
                className={`team-avatar team-avatar--${index + 1}`}
                data-motion-reactive="self"
                data-motion-sound
                data-motion-strength="4"
                aria-hidden="true"
              >
                <i /><i /><i />
              </div>
              <span>0{index + 1}</span>
              <h2><ScrambleText text={`${brand.name} / Placeholder`} duration={760} /></h2>
              <p>{t.role}</p>
              <div><span>LinkedIn</span><span>↗</span></div>
            </article>
          ))}
        </div>
      </section>
    </SiteFrame>
  )
}
