import { useEffect } from 'react'
import { brand } from '../config/brand'
import { projectPath, routeMap } from '../config/routes'
import type { Locale } from '../types'

interface SeoProps {
  locale: Locale
  title?: string
  description?: string
  projectSlug?: string
  page?: 'home' | 'team' | 'privacy' | 'terms'
}

function upsertLink(rel: string, href: string, hreflang?: string) {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`
  let link = document.head.querySelector<HTMLLinkElement>(selector)
  if (!link) {
    link = document.createElement('link')
    link.rel = rel
    if (hreflang) link.hreflang = hreflang
    document.head.appendChild(link)
  }
  link.href = href
}

function upsertMeta(selector: string, attribute: 'name' | 'property', key: string, content: string) {
  let meta = document.head.querySelector<HTMLMetaElement>(selector)
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute(attribute, key)
    document.head.appendChild(meta)
  }
  meta.content = content
}

export function Seo({ locale, title, description, projectSlug, page = 'home' }: SeoProps) {
  useEffect(() => {
    const finalTitle = title ? `${title} — ${brand.name}` : `${brand.name} — ${brand.tagline[locale]}`
    const finalDescription = description || brand.statement[locale]
    document.title = finalTitle
    document.documentElement.lang = locale
    document.querySelector('meta[name="description"]')?.setAttribute('content', finalDescription)

    const path = projectSlug ? projectPath(locale, projectSlug) : routeMap[locale][page]
    const url = new URL(path, window.location.origin).toString()
    upsertLink('canonical', url)
    ;(['es', 'pt', 'en'] as Locale[]).forEach((language) => {
      const localized = projectSlug ? projectPath(language, projectSlug) : routeMap[language][page]
      upsertLink('alternate', new URL(localized, window.location.origin).toString(), language)
    })

    const ogImage = new URL('/og.png', window.location.origin).toString()
    const ogLocale = { es: 'es_AR', pt: 'pt_BR', en: 'en_US' }[locale]
    upsertMeta('meta[property="og:title"]', 'property', 'og:title', finalTitle)
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', finalDescription)
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', url)
    upsertMeta('meta[property="og:locale"]', 'property', 'og:locale', ogLocale)
    upsertMeta('meta[property="og:type"]', 'property', 'og:type', projectSlug ? 'article' : 'website')
    upsertMeta('meta[property="og:image"]', 'property', 'og:image', ogImage)
    upsertMeta('meta[property="og:image:width"]', 'property', 'og:image:width', '1200')
    upsertMeta('meta[property="og:image:height"]', 'property', 'og:image:height', '630')
    upsertMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image')
    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', finalTitle)
    upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', finalDescription)
    upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage)
  }, [description, locale, page, projectSlug, title])

  return null
}
