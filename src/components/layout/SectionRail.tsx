import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { navItems } from '../../data/content'
import { routeMap } from '../../config/routes'
import type { Locale } from '../../types'

export function SectionRail({ locale }: { locale: Locale }) {
  const [active, setActive] = useState('capabilities')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target.id) setActive(visible.target.id)
      },
      { rootMargin: '-20% 0px -45% 0px', threshold: [0.15, 0.35, 0.6] },
    )
    navItems.forEach((item) => {
      const section = document.getElementById(item.id)
      if (section) observer.observe(section)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <aside className="section-rail" aria-label="Índice de secciones">
      {navItems.map((item, index) => (
        <Link
          key={item.id}
          to={`${routeMap[locale].home}#${item.id}`}
          className={active === item.id ? 'is-active' : ''}
          aria-current={active === item.id ? 'location' : undefined}
        >
          <span>{String(index + 1).padStart(2, '0')}</span>
          <strong>{item.label[locale]}</strong>
          <i aria-hidden="true" />
        </Link>
      ))}
    </aside>
  )
}

