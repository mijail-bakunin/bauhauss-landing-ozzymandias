import { useRef, type RefObject } from 'react'
import { useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useReducedMotion } from './useReducedMotion'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function useEditorialMotion(scopeRef: RefObject<HTMLElement | null>) {
  const location = useLocation()
  const reducedMotion = useReducedMotion()
  const refreshFrame = useRef(0)

  useGSAP(() => {
    if (reducedMotion) return

    const kineticHeadings = gsap.utils.toArray<HTMLElement>('[data-kinetic-heading]')
    kineticHeadings.forEach((heading, index) => {
      const target = heading.closest<HTMLElement>('h1, h2, h3') ?? heading
      gsap.fromTo(target,
        { xPercent: index % 2 ? 1.4 : -1.4 },
        {
          xPercent: index % 2 ? -1.8 : 1.8,
          ease: 'none',
          scrollTrigger: { trigger: target, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
        },
      )
    })

    gsap.utils.toArray<HTMLImageElement>('.project-media img, .project-page__media img').forEach((image) => {
      gsap.fromTo(image,
        { yPercent: -4 },
        {
          yPercent: 4,
          ease: 'none',
          scrollTrigger: { trigger: image.parentElement, start: 'top bottom', end: 'bottom top', scrub: 0.7 },
        },
      )
    })

    const reveals = gsap.utils.toArray<HTMLElement>([
      '.about-copy > *',
      '.contact-form .form-row',
      '.contact-form > label',
      '.contact-form .form-submit-row',
      '.footer-primary > *',
      '.inner-page__header > *',
      '.team-card',
      '.legal-page > section',
      '.project-page__body > *',
    ].join(','))

    reveals.forEach((element, index) => {
      gsap.from(element, {
        y: 28 + (index % 3) * 6,
        opacity: 0,
        clipPath: 'inset(0 0 22% 0)',
        duration: 0.72,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
      })
    })

    refreshFrame.current = window.requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => window.cancelAnimationFrame(refreshFrame.current)
  }, { scope: scopeRef, dependencies: [location.pathname, reducedMotion], revertOnUpdate: true })
}
