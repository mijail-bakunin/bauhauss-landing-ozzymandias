import { copy } from '../../data/content'
import type { Locale } from '../../types'
import { SectionGlyph } from '../geometry/SectionGlyph'
import { ContactForm } from '../forms/ContactForm'
import { KineticText } from '../motion/KineticText'

export function Contact({ locale }: { locale: Locale }) {
  const t = copy[locale]
  return (
    <section
      className="contact-section section-shell"
      id="contact"
      data-track-section="contact"
      aria-labelledby="contact-title"
    >
      <div className="contact-heading">
        <span className="eyebrow">{t.contactEyebrow}</span>
        <h2 id="contact-title"><KineticText text={t.contactTitle} /></h2>
        <SectionGlyph variant="contact" />
      </div>
      <ContactForm locale={locale} />
    </section>
  )
}
