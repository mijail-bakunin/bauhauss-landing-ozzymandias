import type { Locale } from '../types'

export const locales: Locale[] = ['es', 'pt', 'en']

export const routeMap = {
  es: {
    home: '/',
    team: '/equipo',
    projects: '/proyectos',
    privacy: '/privacidad',
    terms: '/terminos',
  },
  pt: {
    home: '/pt',
    team: '/pt/equipe',
    projects: '/pt/projetos',
    privacy: '/pt/privacidade',
    terms: '/pt/termos',
  },
  en: {
    home: '/en',
    team: '/en/team',
    projects: '/en/projects',
    privacy: '/en/privacy',
    terms: '/en/terms',
  },
} as const

export function projectPath(locale: Locale, slug: string) {
  return `${routeMap[locale].projects}/${slug}`
}

export function localeFromPath(pathname: string): Locale {
  if (pathname === '/pt' || pathname.startsWith('/pt/')) return 'pt'
  if (pathname === '/en' || pathname.startsWith('/en/')) return 'en'
  return 'es'
}

export function localizedPath(
  locale: Locale,
  page: keyof (typeof routeMap)['es'],
) {
  return routeMap[locale][page]
}

