import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { capabilities, copy } from '../../data/content'
import type { Locale } from '../../types'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { SectionGlyph } from '../geometry/SectionGlyph'
import { KineticText } from '../motion/KineticText'
import { ScrambleText } from '../motion/ScrambleText'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function Capabilities({ locale }: { locale: Locale }) {
  const rootRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  const t = copy[locale]

  useGSAP(
    () => {
      if (reducedMotion) return
      const cards = gsap.utils.toArray<HTMLElement>('.capability-card')
      cards.forEach((card, index) => {
        gsap.from(card.querySelectorAll('.capability-copy > *, .section-glyph'), {
          scrollTrigger: { trigger: card, start: 'top 78%', toggleActions: 'play reverse play reverse' },
          y: 50 + index * 12,
          rotation: index % 2 ? 1.5 : -1.5,
          opacity: 0,
          duration: 0.9,
          stagger: 0.09,
          ease: 'power3.out',
        })
      })

      gsap.to('.capabilities-rail__line', {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 70%',
          end: 'bottom 65%',
          scrub: true,
        },
      })
    },
    { scope: rootRef, dependencies: [reducedMotion] },
  )

  return (
    <section
      className="capabilities-section section-shell"
      id="capabilities"
      ref={rootRef}
      data-track-section="capabilities"
      aria-labelledby="capabilities-title"
    >
      <div className="section-heading">
        <span className="eyebrow">{t.capabilitiesEyebrow}</span>
        <h2 id="capabilities-title"><KineticText text={t.capabilitiesLead} /></h2>
      </div>

      <div className="capabilities-layout">
        <div className="capabilities-rail" aria-hidden="true">
          <span className="capabilities-rail__line" />
          <span>01</span>
          <span>03</span>
        </div>
        <div className="capabilities-list">
          {capabilities.map((capability) => (
            <article className="capability-card" key={capability.id} id={capability.id}>
              <div className="capability-copy">
                <span>{capability.index}</span>
                <h3><ScrambleText text={capability.title[locale]} duration={680} /></h3>
                <p>{capability.copy[locale]}</p>
              </div>
              <SectionGlyph variant={capability.id as 'systems' | 'products' | 'experiences'} />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
