import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { copy } from '../../data/content'
import { projects } from '../../data/projects'
import { projectPath } from '../../config/routes'
import type { Locale } from '../../types'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { track } from '../../lib/analytics'
import { KineticText } from '../motion/KineticText'
import { ScrambleText } from '../motion/ScrambleText'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const PAGE_SIZE = 3

export function Portfolio({ locale }: { locale: Locale }) {
  const [page, setPage] = useState(0)
  const rootRef = useRef<HTMLElement>(null)
  const location = useLocation()
  const reducedMotion = useReducedMotion()
  const t = copy[locale]
  const pageCount = Math.ceil(projects.length / PAGE_SIZE)
  const visibleProjects = projects.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)

  useEffect(() => {
    if (reducedMotion) return
    gsap.fromTo(
      '.project-card',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.65, stagger: 0.08, ease: 'power3.out' },
    )
  }, [page, reducedMotion])

  useGSAP(
    () => {
      if (reducedMotion) return
      gsap.to('.portfolio-orbit', {
        rotation: 170,
        scrollTrigger: { trigger: rootRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
      })
    },
    { scope: rootRef, dependencies: [reducedMotion] },
  )

  return (
    <section
      className="portfolio-section section-shell"
      id="portfolio"
      ref={rootRef}
      data-track-section="portfolio"
      aria-labelledby="portfolio-title"
    >
      <div className="portfolio-orbit" aria-hidden="true"><i /></div>
      <div className="section-heading section-heading--portfolio">
        <span className="eyebrow">{t.portfolioEyebrow}</span>
        <h2 id="portfolio-title"><KineticText text={t.portfolioLead} /></h2>
      </div>

      <div className="projects-grid" aria-live="polite">
        {visibleProjects.map((project, index) => (
          <article
            className={`project-card project-card--${index + 1} project-card--${project.accent}`}
            key={project.slug}
          >
            <Link
              to={projectPath(locale, project.slug)}
              state={{ backgroundLocation: location }}
              aria-label={`${t.viewProject}: ${project.name}`}
              onClick={() => track('project_open', { project: project.slug, source: 'portfolio' })}
            >
              <div className="project-media">
                <img src={project.image} alt={project.imageAlt[locale]} loading="lazy" />
                <span className="project-media__grid" aria-hidden="true" />
                <span className="project-open-symbol" aria-hidden="true">↗</span>
              </div>
              <div className="project-meta">
                <div>
                  <span>{project.category[locale]}</span>
                  <span>{project.year}</span>
                </div>
                <h3><ScrambleText text={project.name} duration={720} /></h3>
                <p>{project.description[locale]}</p>
                <div className="project-flags">
                  {project.ownProduct && <span>{t.ownProduct}</span>}
                  {project.placeholder && <span>{t.conceptProject}</span>}
                  <span>{project.status[locale]}</span>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>

      <nav className="portfolio-pagination" aria-label="Paginación del portfolio">
        <button
          data-magnetic
          type="button"
          disabled={page === 0}
          onClick={() => setPage((value) => Math.max(0, value - 1))}
        >
          <span aria-hidden="true">←</span> {t.previousProjects}
        </button>
        <span>{t.page} {page + 1} / {pageCount}</span>
        <button
          data-magnetic
          type="button"
          disabled={page >= pageCount - 1}
          onClick={() => setPage((value) => Math.min(pageCount - 1, value + 1))}
        >
          {t.nextProjects} <span aria-hidden="true">→</span>
        </button>
      </nav>
    </section>
  )
}
