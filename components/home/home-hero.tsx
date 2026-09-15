'use client'

import { ArrowUpRight, ArrowRight, ShieldCheck, Ship } from 'lucide-react'
import Link from '@/components/localized-link'
import { useLanguage } from '@/lib/i18n/context'
import { Eyebrow } from '@/components/section-heading'
import { HeroVideoBackground } from '@/components/home/hero-video-background'

export type HeroSlide = { image: string; model: string; kind: 'import' | 'sale'; slug: string }

export function HomeHero({ slides: _slides }: { slides: HeroSlide[] }) {
  const { t } = useLanguage()

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden border-b border-border">
      <HeroVideoBackground />
      <div className="site-container relative py-10 lg:py-14">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="hero-enter flex min-w-0 flex-col gap-6">
            <Eyebrow className="text-white/80">{t.home.services.eyebrow} · {t.nav.brand}</Eyebrow>
            <h1 id="hero-title" className="text-balance font-sans text-4xl font-extrabold leading-[1.17] tracking-tight text-white sm:text-5xl lg:text-[2.8rem] xl:text-5xl">
              <span className="block">{t.home.heroLine1}</span>
              <span className="block">{t.home.heroLine2}</span>
              <span className="mt-2 block underline decoration-primary decoration-4 underline-offset-8">{t.home.heroLine3} {t.home.heroLine4}</span>
            </h1>
            <p className="max-w-xl text-pretty text-base leading-relaxed text-white/80">{t.home.heroDescription}</p>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/products" className="action-primary">{t.home.cta.secondary}<ArrowRight className="size-4 flip-x" aria-hidden /></Link>
              <Link href="/cars" className="action-outline border-white/40 text-white hover:bg-white/10">{t.nav.cars}<ArrowUpRight className="size-4 flip-x" aria-hidden /></Link>
            </div>
            <ul className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-white/80">
              <li className="inline-flex items-center gap-2"><ShieldCheck className="size-4 shrink-0 text-white" aria-hidden />{t.products.trustWarranty}</li>
              <li className="inline-flex items-center gap-2"><Ship className="size-4 shrink-0 text-white" aria-hidden />{t.home.globeCountries}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
