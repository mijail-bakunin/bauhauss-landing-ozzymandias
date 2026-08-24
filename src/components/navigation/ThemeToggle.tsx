import type { MouseEvent } from 'react'
import type { Locale, Theme } from '../../types'

interface ThemeToggleProps {
  theme: Theme
  locale: Locale
  onToggle: (event: MouseEvent<HTMLButtonElement>) => void
}

const labels = {
  es: { dark: 'Activar tema oscuro', light: 'Activar tema claro' },
  pt: { dark: 'Ativar tema escuro', light: 'Ativar tema claro' },
  en: { dark: 'Activate dark theme', light: 'Activate light theme' },
} as const

export function ThemeToggle({ theme, locale, onToggle }: ThemeToggleProps) {
  return (
    <button
      className="geometry-toggle theme-toggle"
      data-magnetic
      type="button"
      aria-label={labels[locale][theme === 'light' ? 'dark' : 'light']}
      aria-pressed={theme === 'dark'}
      onClick={onToggle}
    >
      <span className="theme-disc" aria-hidden="true">
        <span className="theme-disc__half" />
        <span className="theme-disc__axis" />
      </span>
    </button>
  )
}
