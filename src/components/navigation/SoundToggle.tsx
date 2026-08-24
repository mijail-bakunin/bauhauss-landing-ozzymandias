import type { Locale } from '../../types'

interface SoundToggleProps {
  enabled: boolean
  locale: Locale
  onToggle: () => void
}

const labels = {
  es: { on: 'Activar sonido', off: 'Desactivar sonido' },
  pt: { on: 'Ativar som', off: 'Desativar som' },
  en: { on: 'Enable sound', off: 'Disable sound' },
} as const

export function SoundToggle({ enabled, locale, onToggle }: SoundToggleProps) {
  return (
    <button
      className="geometry-toggle sound-toggle"
      data-magnetic
      type="button"
      aria-label={labels[locale][enabled ? 'off' : 'on']}
      aria-pressed={enabled}
      onClick={onToggle}
    >
      <span className="sound-bars" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
    </button>
  )
}
