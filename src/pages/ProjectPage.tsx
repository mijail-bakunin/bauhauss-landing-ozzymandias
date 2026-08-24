import { Link, useParams } from 'react-router-dom'
import { getProject, projects } from '../data/projects'
import { projectPath, routeMap } from '../config/routes'
import type { Locale } from '../types'
import { SiteFrame } from '../components/layout/SiteFrame'
import { Seo } from '../components/Seo'
import { ScrambleText } from '../components/motion/ScrambleText'

export function ProjectPage({ locale }: { locale: Locale }) {
  const { slug = '' } = useParams()
  const project = getProject(slug)
  if (!project) return <NotFoundProject locale={locale} />
  const index = projects.findIndex((item) => item.slug === project.slug)
  const next = projects[(index + 1) % projects.length]

  return (
    <SiteFrame locale={locale}>
      <Seo locale={locale} title={project.name} description={project.description[locale]} projectSlug={project.slug} />
      <article className={`project-page project-page--${project.accent}`}>
        <header className="project-page__hero">
          <div>
            <span>{project.category[locale]}</span>
            <span>{project.year}</span>
          </div>
          <h1><ScrambleText text={project.name} duration={920} /></h1>
          <p>{project.description[locale]}</p>
          <div className="project-flags">
            {project.ownProduct && <span>Ozzymandias original</span>}
            {project.placeholder && <span>Concept project</span>}
            <span>{project.status[locale]}</span>
          </div>
        </header>
        <div className="project-page__media"><img src={project.image} alt={project.imageAlt[locale]} /></div>
        <section className="project-page__body">
          <span>01 / CONTEXT</span>
          <h2>{project.longDescription[locale]}</h2>
          <ul>{project.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul>
        </section>
        <footer className="project-next">
          <span>Next / Siguiente</span>
          <Link data-magnetic to={projectPath(locale, next.slug)}>{next.name}<span aria-hidden="true">↗</span></Link>
        </footer>
      </article>
    </SiteFrame>
  )
}

function NotFoundProject({ locale }: { locale: Locale }) {
  return (
    <SiteFrame locale={locale}>
      <section className="inner-page not-found"><h1>404</h1><p>Project not found.</p><Link to={routeMap[locale].home}>← Home</Link></section>
    </SiteFrame>
  )
}
