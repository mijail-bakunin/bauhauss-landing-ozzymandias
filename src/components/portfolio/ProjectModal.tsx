import { useCallback, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProject } from '../../data/projects'
import { projectPath } from '../../config/routes'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import type { Locale } from '../../types'
import { track } from '../../lib/analytics'

interface ProjectModalProps {
  locale: Locale
}

export function ProjectModal({ locale }: ProjectModalProps) {
  const { slug = '' } = useParams()
  const navigate = useNavigate()
  const modalRef = useRef<HTMLElement>(null)
  const project = getProject(slug)
  const close = useCallback(() => navigate(-1), [navigate])
  useFocusTrap(modalRef, Boolean(project), close)

  if (!project) return null

  const expand = () => {
    track('project_expand', { project: project.slug })
    navigate(projectPath(locale, project.slug), { replace: true, state: null })
  }

  return (
    <div className="project-modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) close()
    }}>
      <article
        className={`project-modal project-modal--${project.accent}`}
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
      >
        <header className="project-modal__header">
          <span>{project.category[locale]} / {project.year}</span>
          <div>
            <button type="button" onClick={expand}>Expandir <span aria-hidden="true">↗</span></button>
            <button type="button" onClick={close} aria-label="Cerrar proyecto">×</button>
          </div>
        </header>
        <div className="project-modal__media">
          <img src={project.image} alt={project.imageAlt[locale]} />
        </div>
        <div className="project-modal__content">
          <h2 id="project-modal-title">{project.name}</h2>
          <p>{project.longDescription[locale]}</p>
          <ul aria-label="Tecnologías">
            {project.technologies.map((technology) => <li key={technology}>{technology}</li>)}
          </ul>
          <span>{project.status[locale]}</span>
        </div>
      </article>
    </div>
  )
}

