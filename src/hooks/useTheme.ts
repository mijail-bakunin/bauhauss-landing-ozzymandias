import { flushSync } from 'react-dom'
import { useCallback, useEffect, useState, type MouseEvent } from 'react'
import type { Theme } from '../types'

const THEME_KEY = 'ozzy-theme'

function initialTheme(): Theme {
  const stored = localStorage.getItem(THEME_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return 'light'
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', theme === 'dark' ? '#080907' : '#f1efe7')
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(initialTheme)

  useEffect(() => applyTheme(theme), [theme])

  const toggleTheme = useCallback(
    (event?: MouseEvent<HTMLElement>) => {
      const next: Theme = theme === 'light' ? 'dark' : 'light'
      const x = event?.clientX ?? window.innerWidth - 42
      const y = event?.clientY ?? 42
      document.documentElement.style.setProperty('--theme-x', `${x}px`)
      document.documentElement.style.setProperty('--theme-y', `${y}px`)

      const commit = () => {
        flushSync(() => setTheme(next))
        localStorage.setItem(THEME_KEY, next)
        applyTheme(next)
      }

      if (document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.startViewTransition(commit)
      } else {
        commit()
      }
    },
    [theme],
  )

  return { theme, toggleTheme }
}
