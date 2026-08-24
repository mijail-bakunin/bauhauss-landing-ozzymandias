import type { Locale } from '../types'
import { SiteFrame } from '../components/layout/SiteFrame'
import { Seo } from '../components/Seo'
import { ScrambleText } from '../components/motion/ScrambleText'

interface LegalPageProps {
  locale: Locale
  kind: 'privacy' | 'terms'
}

const labels = {
  es: { privacy: 'Privacidad', terms: 'Términos', pending: 'Documento pendiente de revisión legal antes de la publicación.', intro: 'Esta estructura está preparada para alojar el contenido legal definitivo sin alterar el diseño.' },
  pt: { privacy: 'Privacidade', terms: 'Termos', pending: 'Documento pendente de revisão jurídica antes da publicação.', intro: 'Esta estrutura está pronta para receber o conteúdo jurídico definitivo sem alterar o design.' },
  en: { privacy: 'Privacy', terms: 'Terms', pending: 'Document pending legal review before publication.', intro: 'This structure is ready for final legal content without changing the design.' },
} as const

export function LegalPage({ locale, kind }: LegalPageProps) {
  const t = labels[locale]
  const title = t[kind]
  return (
    <SiteFrame locale={locale}>
      <Seo locale={locale} page={kind} title={title} />
      <article className="inner-page legal-page">
        <header className="inner-page__header">
          <span className="eyebrow">LEGAL / PLACEHOLDER</span>
          <h1><ScrambleText text={title} duration={820} /></h1>
          <p>{t.pending}</p>
        </header>
        {[1, 2, 3, 4].map((section) => (
          <section key={section}>
            <span>0{section}</span>
            <h2>Lorem ipsum dolor</h2>
            <p>{t.intro} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer luctus, arcu sed consequat posuere, velit libero volutpat nulla.</p>
          </section>
        ))}
      </article>
    </SiteFrame>
  )
}
