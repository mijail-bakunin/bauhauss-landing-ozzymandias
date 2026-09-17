import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { brand } from '../../config/brand'
import { routeMap } from '../../config/routes'
import { copy } from '../../data/content'
import type { Locale } from '../../types'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { BrandMark } from '../branding/BrandMark'
import { ScrambleText } from '../motion/ScrambleText'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function About({ locale }: { locale: Locale }) {
  const rootRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  const t = copy[locale]

  useGSAP(
    () => {
      if (reducedMotion) return
      gsap.from('.about-word span', {
        yPercent: 120,
        rotation: 3,
        opacity: 0,
        stagger: 0.06,
        duration: 0.95,
        ease: 'power4.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 72%', toggleActions: 'play reverse play reverse' },
      })
      gsap.to('.about-mark', {
        rotation: 135,
        scrollTrigger: { trigger: rootRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
      })
    },
    { scope: rootRef, dependencies: [reducedMotion] },
  )

  return (
    <section
      className="about-section section-shell"
      id="about"
      ref={rootRef}
      data-track-section="about"
      aria-labelledby="about-title"
    >
      <div className="about-grid" aria-hidden="true" />
      <div className="about-intro">
        <span className="eyebrow">{t.aboutEyebrow}</span>
        <div
          className="about-mark"
          data-motion-reactive="self"
          data-motion-sound
          data-motion-strength="5"
        ><BrandMark decorative /></div>
      </div>
      <h2 id="about-title" className="about-word" data-kinetic-heading>
        {brand.statement[locale].split(' ').map((word, index) => (
          <span key={`${word}-${index}`}>{word}&nbsp;</span>
        ))}
      </h2>
      <div className="about-copy">
        <h3><ScrambleText text={t.aboutTitle} duration={880} /></h3>
        <p>{t.aboutBody}</p>
        <Link className="line-link" data-magnetic to={routeMap[locale].team}>
          {t.teamLink}<span aria-hidden="true">↗</span>
        </Link>
      </div>
    </section>
  )
}
