import type { Locale } from '../types'
import { brand } from '../config/brand'
import { SiteFrame } from '../components/layout/SiteFrame'
import { Hero } from '../components/sections/Hero'
import { Capabilities } from '../components/sections/Capabilities'
import { Portfolio } from '../components/sections/Portfolio'
import { About } from '../components/sections/About'
import { Contact } from '../components/sections/Contact'
import { Seo } from '../components/Seo'
import { useSectionTracking } from '../hooks/useSectionTracking'

export function HomePage({ locale }: { locale: Locale }) {
  useSectionTracking()
  return (
    <SiteFrame locale={locale} showRail>
      {(sound) => (
        <>
          <Seo locale={locale} description={brand.statement[locale]} />
          <Hero locale={locale} onAssembled={() => sound.cue('assemble')} />
          <Capabilities locale={locale} />
          <Portfolio locale={locale} />
          <About locale={locale} />
          <Contact locale={locale} />
        </>
      )}
    </SiteFrame>
  )
}

