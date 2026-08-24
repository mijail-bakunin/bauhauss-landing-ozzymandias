import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { brand } from '../../config/brand'
import { copy } from '../../data/content'
import type { Locale } from '../../types'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { GeometricWordmark } from '../branding/GeometricWordmark'
import { BrandMark } from '../branding/BrandMark'

gsap.registerPlugin(ScrollTrigger, useGSAP)

interface HeroProps {
  locale: Locale
  onAssembled: () => void
}

export function Hero({ locale, onAssembled }: HeroProps) {
  const rootRef = useRef<HTMLElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const skippingRef = useRef(false)
  const reducedMotion = useReducedMotion()
  const t = copy[locale]

  useGSAP(
    () => {
      if (!rootRef.current || !logoRef.current) return
      if (!window.location.hash) {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      }
      const assemblySlices = gsap.utils.toArray<SVGGElement>('[data-assembly-slice]', logoRef.current)
      const wordmarkGuides = gsap.utils.toArray<SVGGraphicsElement>('[data-wordmark-guide]', logoRef.current)
      const construction = gsap.utils.toArray<SVGElement>('[data-hero-construction]', rootRef.current)
      const colorRails = gsap.utils.toArray<HTMLElement>('.hero-color-rail', rootRef.current)

      if (reducedMotion) {
        gsap.set([...assemblySlices, ...wordmarkGuides, ...construction], { clearProps: 'all', opacity: 1 })
        gsap.set(colorRails, { scaleX: 1 })
        rootRef.current.classList.add('hero--assembled')
        return
      }

      gsap.set(assemblySlices, {
        opacity: 0.07,
        x: (index) => ((index % 2 ? 1 : -1) * (12 + (index % 4) * 4)),
        y: (index) => ((index % 3) - 1) * 7,
        scaleY: 0.82,
        transformOrigin: 'center',
        willChange: 'transform, opacity',
      })
      gsap.set(wordmarkGuides, {
        opacity: 0,
        strokeDasharray: 1,
        strokeDashoffset: 1,
      })
      gsap.set(construction, { opacity: 0, scale: 0.96 })
      gsap.set(colorRails, { scaleX: 0, transformOrigin: 'left center' })
      const media = gsap.matchMedia()
      let scrollSetupFrame = 0
      document.documentElement.classList.add('intro-active')

      function setupScrollMotion() {
        media.add('(min-width: 769px) and (prefers-reduced-motion: no-preference)', () => {
          const logo = logoRef.current
          if (!logo) return
          const scrollTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: rootRef.current,
              start: 'top top',
              end: '+=72%',
              pin: true,
              scrub: 0.28,
              anticipatePin: 1,
              fastScrollEnd: true,
              invalidateOnRefresh: true,
            },
          })

          scrollTimeline
            .to('.hero-orbit--one', { rotation: 96, xPercent: -12, scale: 0.78, duration: 0.56 }, 0)
            .to('.hero-orbit--two', { rotation: -82, yPercent: 18, scale: 1.1, duration: 0.56 }, 0)
            .to('.hero-module', { xPercent: (index) => (index % 2 ? 56 : -48), opacity: 0.2, stagger: 0.015, duration: 0.5 }, 0)
            .to(logo, {
              x: () => {
                const dock = document.querySelector<HTMLElement>('#brand-dock')
                if (!dock || !logo) return 0
                return dock.getBoundingClientRect().left - logo.getBoundingClientRect().left
              },
              y: () => {
                const dock = document.querySelector<HTMLElement>('#brand-dock')
                if (!dock || !logo) return 0
                return dock.getBoundingClientRect().top - logo.getBoundingClientRect().top
              },
              scale: 0.15,
              transformOrigin: 'left center',
              ease: 'none',
              duration: 0.64,
            }, 0.03)
            .to(logo, { opacity: 0, duration: 0.08 }, 0.62)
            .to('.hero-secondary', { opacity: 0, y: -18, duration: 0.24 }, 0.08)
        })
      }

      const intro = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
          rootRef.current?.classList.add('hero--assembled')
          gsap.set(assemblySlices, { clearProps: 'willChange' })
          document.documentElement.classList.remove('intro-active')
          onAssembled()
          if (!skippingRef.current) {
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
            scrollSetupFrame = window.requestAnimationFrame(() => {
              setupScrollMotion()
              ScrollTrigger.refresh()
              window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
              ScrollTrigger.update()
            })
          }
        },
      })
      timelineRef.current = intro
      intro
        .to(construction, { opacity: 1, scale: 1, duration: 0.32, stagger: 0.012 }, 0)
        .to(wordmarkGuides, {
          opacity: 0.72,
          strokeDashoffset: 0,
          duration: 0.48,
          stagger: 0.012,
          ease: 'power2.inOut',
        }, 0.03)
        .to(assemblySlices, {
          opacity: 1,
          x: 0,
          y: 0,
          scaleY: 1,
          duration: 0.52,
          stagger: { each: 0.012, from: 'start' },
          ease: 'expo.out',
        }, 0.1)
        .from('.hero-meta, .hero-tagline, .hero-scroll-index', {
          opacity: 0,
          y: 10,
          duration: 0.32,
          stagger: 0.035,
        }, 0.58)
        .to(colorRails, { scaleX: 1, duration: 0.38, stagger: 0.045 }, 0.62)

      return () => {
        window.cancelAnimationFrame(scrollSetupFrame)
        document.documentElement.classList.remove('intro-active')
        media.revert()
      }
    },
    { scope: rootRef, dependencies: [reducedMotion] },
  )

  const skip = () => {
    skippingRef.current = true
    timelineRef.current?.progress(1)
    document.querySelector('#capabilities')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })
  }

  return (
    <section
      className="hero-section"
      id="home"
      ref={rootRef}
      data-track-section="hero"
      aria-labelledby="hero-title"
    >
      <button className="skip-intro" type="button" onClick={skip}>
        {t.skipIntro}
      </button>

      <div className="hero-frame">
        <div className="hero-grid" aria-hidden="true" data-hero-construction />
        <div className="hero-orbit hero-orbit--one" aria-hidden="true" data-hero-construction />
        <div className="hero-orbit hero-orbit--two" aria-hidden="true" data-hero-construction />
        <div className="hero-module hero-module--one" aria-hidden="true" data-hero-construction />
        <div className="hero-module hero-module--two" aria-hidden="true" data-hero-construction />
        <div className="hero-module hero-module--three" aria-hidden="true" data-hero-construction />
        <span className="hero-color-rail hero-color-rail--orange" aria-hidden="true" />
        <span className="hero-color-rail hero-color-rail--ochre" aria-hidden="true" />

        <div className="hero-meta hero-secondary">
          <span>ARG / 34°36′S</span>
          <span>EST. 2026</span>
        </div>

        <div className="hero-wordmark" ref={logoRef}>
          <h1 id="hero-title" className="sr-only">{brand.name}</h1>
          <GeometricWordmark name={brand.name} density={3} />
        </div>

        <div className="hero-tagline hero-secondary">
          <span className="eyebrow">{t.introEyebrow}</span>
          <p>{brand.tagline[locale]}</p>
        </div>

        <div className="hero-signature hero-secondary" aria-hidden="true">
          <BrandMark decorative />
        </div>

        <div className="hero-scroll-index hero-secondary" aria-hidden="true">
          <span>00</span>
          <i />
          <span>01</span>
        </div>
      </div>
    </section>
  )
}
