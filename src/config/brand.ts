import type { LocalizedText } from '../types'

export const brand = {
  name: 'Ozzymandias',
  tagline: {
    es: 'Tecnología, sistemas y experiencias.',
    pt: 'Tecnologia, sistemas e experiências.',
    en: 'Technology, systems & experiences.',
  } satisfies LocalizedText,
  statement: {
    es: 'Construimos sistemas, productos y experiencias.',
    pt: 'Construímos sistemas, produtos e experiências.',
    en: 'We build systems, products and experiences.',
  } satisfies LocalizedText,
  email: '',
  location: '',
  socials: {
    instagram: '',
    linkedin: '',
    behance: '',
  },
  copyrightStartYear: 2026,
} as const

export const supportedBrandCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 -&.'

