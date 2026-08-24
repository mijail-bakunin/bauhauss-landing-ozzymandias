export type Locale = 'es' | 'pt' | 'en'

export type Theme = 'light' | 'dark'

export type LocalizedText = Record<Locale, string>

export interface Project {
  slug: string
  name: string
  category: LocalizedText
  description: LocalizedText
  longDescription: LocalizedText
  status: LocalizedText
  year: string
  image: string
  imageAlt: LocalizedText
  technologies: string[]
  ownProduct?: boolean
  placeholder?: boolean
  accent: 'orange' | 'ochre' | 'ink'
}

export interface NavItem {
  id: string
  label: LocalizedText
}

export interface AnalyticsEventProperties {
  [key: string]: string | number | boolean | undefined
}

