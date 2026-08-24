import { useCallback, useRef, useState } from 'react'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { hasAnalyticsConsent, setAnalyticsConsent } from '../../lib/analytics'
import type { Locale } from '../../types'

const labels = {
  es: {
    title: 'Centro de privacidad',
    intro: 'Controlá qué mediciones anónimas puede realizar este sitio.',
    essential: 'Funcionamiento esencial',
    essentialCopy: 'Tema, idioma y preferencias locales necesarias para la experiencia.',
    analytics: 'Analítica anónima',
    analyticsCopy: 'Visitas, secciones observadas, país, región y ciudad aproximados. Nunca se envía el contenido del formulario.',
    future: 'Integraciones futuras',
    futureCopy: 'Publicidad, perfiles o integraciones externas. Actualmente inactivas.',
    save: 'Guardar preferencias',
    close: 'Cerrar',
  },
  pt: {
    title: 'Central de privacidade',
    intro: 'Controle quais medições anônimas este site pode realizar.',
    essential: 'Funcionamento essencial',
    essentialCopy: 'Tema, idioma e preferências locais necessárias para a experiência.',
    analytics: 'Análise anônima',
    analyticsCopy: 'Visitas, seções vistas, país, região e cidade aproximados. O conteúdo do formulário nunca é enviado.',
    future: 'Integrações futuras',
    futureCopy: 'Publicidade, perfis ou integrações externas. Atualmente inativas.',
    save: 'Salvar preferências',
    close: 'Fechar',
  },
  en: {
    title: 'Privacy center',
    intro: 'Control which anonymous measurements this site may collect.',
    essential: 'Essential operation',
    essentialCopy: 'Theme, language and local preferences needed for the experience.',
    analytics: 'Anonymous analytics',
    analyticsCopy: 'Visits, viewed sections and approximate country, region and city. Form contents are never sent.',
    future: 'Future integrations',
    futureCopy: 'Advertising, profiles or external integrations. Currently inactive.',
    save: 'Save preferences',
    close: 'Close',
  },
} as const

interface PrivacyCenterProps {
  locale: Locale
  open: boolean
  onClose: () => void
}

export function PrivacyCenter({ locale, open, onClose }: PrivacyCenterProps) {
  const [analytics, setAnalytics] = useState(hasAnalyticsConsent)
  const panelRef = useRef<HTMLElement>(null)
  const close = useCallback(() => onClose(), [onClose])
  useFocusTrap(panelRef, open, close)
  const t = labels[locale]

  if (!open) return null

  return (
    <div className="privacy-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section ref={panelRef} className="privacy-center" role="dialog" aria-modal="true" aria-labelledby="privacy-center-title">
        <header>
          <div>
            <span>PRV / 01</span>
            <h2 id="privacy-center-title">{t.title}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label={t.close}>×</button>
        </header>
        <p>{t.intro}</p>
        <div className="privacy-options">
          <label>
            <span><strong>{t.essential}</strong><small>{t.essentialCopy}</small></span>
            <input type="checkbox" checked disabled />
            <i aria-hidden="true" />
          </label>
          <label>
            <span><strong>{t.analytics}</strong><small>{t.analyticsCopy}</small></span>
            <input type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} />
            <i aria-hidden="true" />
          </label>
          <label>
            <span><strong>{t.future}</strong><small>{t.futureCopy}</small></span>
            <input type="checkbox" checked={false} disabled />
            <i aria-hidden="true" />
          </label>
        </div>
        <button className="assembly-button" type="button" onClick={() => {
          setAnalyticsConsent(analytics)
          onClose()
        }}>
          <span>{t.save}</span><i aria-hidden="true" />
        </button>
      </section>
    </div>
  )
}
