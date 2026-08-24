import type { AnalyticsEventProperties } from '../types'

interface PlausibleFunction {
  (
    event: string,
    options?: { props?: AnalyticsEventProperties; callback?: () => void },
  ): void
  q?: unknown[]
}

declare global {
  interface Window {
    plausible?: PlausibleFunction
  }
}

const ANALYTICS_CONSENT_KEY = 'ozzy-analytics-consent'
let initialized = false

export function hasAnalyticsConsent() {
  return localStorage.getItem(ANALYTICS_CONSENT_KEY) !== 'false'
}

export function setAnalyticsConsent(value: boolean) {
  localStorage.setItem(ANALYTICS_CONSENT_KEY, String(value))
  if (value) initAnalytics()
}

export function initAnalytics() {
  if (initialized || !hasAnalyticsConsent()) return

  const domain = import.meta.env.VITE_PLAUSIBLE_DOMAIN as string | undefined
  if (!domain) return

  if (!window.plausible) {
    const plausible: PlausibleFunction = (event, options) => {
      plausible.q = plausible.q || []
      plausible.q.push([event, options])
    }
    window.plausible = plausible
  }

  const script = document.createElement('script')
  script.defer = true
  script.dataset.domain = domain
  script.src =
    (import.meta.env.VITE_PLAUSIBLE_SCRIPT as string | undefined) ||
    'https://plausible.io/js/script.js'
  document.head.appendChild(script)
  initialized = true
}

export function track(
  event: string,
  properties: AnalyticsEventProperties = {},
) {
  if (!hasAnalyticsConsent()) return
  window.plausible?.(event, { props: properties })
}

export function trackPageView(path: string, locale: string) {
  track('page_view', { path, locale })
}
