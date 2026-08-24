import { useEffect } from 'react'
import { track } from '../lib/analytics'

export function useSectionTracking() {
  useEffect(() => {
    const seen = new Set<string>()
    const timers = new Map<Element, number>()
    const sections = document.querySelectorAll<HTMLElement>('[data-track-section]')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = (entry.target as HTMLElement).dataset.trackSection
          if (!id || seen.has(id)) return

          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            if (timers.has(entry.target)) return
            const timer = window.setTimeout(() => {
              seen.add(id)
              timers.delete(entry.target)
              track('section_view', { section: id })
            }, 1500)
            timers.set(entry.target, timer)
          } else {
            const timer = timers.get(entry.target)
            if (timer) window.clearTimeout(timer)
            timers.delete(entry.target)
          }
        })
      },
      { threshold: [0, 0.5, 0.75] },
    )

    sections.forEach((section) => observer.observe(section))
    return () => {
      observer.disconnect()
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [])
}

