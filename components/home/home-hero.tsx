'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ArrowUpRight, ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Ship, Wrench, Pause, Play } from 'lucide-react'
import Link from '@/components/localized-link'
import { useLanguage } from '@/lib/i18n/context'
import { Eyebrow } from '@/components/section-heading'
import { Button } from '@/components/ui/button'

export type HeroSlide = { image: string; model: string; kind: 'import' | 'sale'; slug: string }

export function HomeHero({ slides }: { slides: HeroSlide[] }) {
  const { t } = useLanguage()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const active = slides[index % Math.max(1, slides.length)]

  useEffect(() => {
    if (paused || slides.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const interval = window.setInterval(() => setIndex((current) => (current + 1) % slides.length), 6500)
    return () => window.clearInterval(interval)
  }, [paused, slides.length])

  const advance = (direction: number) => {
    setPaused(true)
    setIndex((current) => (current + direction + slides.length) % slides.length)
  }

  return (
    <section aria-labelledby="hero-title" className="border-b border-border">
      <div className="site-container py-10 lg:py-14">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="hero-enter flex min-w-0 flex-col gap-6">
            <Eyebrow>{t.home.services.eyebrow} · {t.nav.brand}</Eyebrow>
            <h1 id="hero-title" className="text-balance font-sans text-4xl font-extrabold leading-[1.17] tracking-tight sm:text-5xl lg:text-[2.8rem] xl:text-5xl">
              <span className="block">{t.home.heroLine1}</span>
              <span className="block">{t.home.heroLine2}</span>
              <span className="mt-2 block underline decoration-primary decoration-4 underline-offset-8">{t.home.heroLine3} {t.home.heroLine4}</span>
            </h1>
            <p className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">{t.home.heroDescription}</p>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/products" className="action-primary">{t.home.cta.secondary}<ArrowRight className="size-4 flip-x" aria-hidden /></Link>
              <Link href="/cars" className="action-outline">{t.nav.cars}<ArrowUpRight className="size-4 flip-x" aria-hidden /></Link>
            </div>
            <ul className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-muted-foreground">
              <li className="inline-flex items-center gap-2"><ShieldCheck className="size-4 shrink-0 text-foreground" aria-hidden />{t.products.trustWarranty}</li>
              <li className="inline-flex items-center gap-2"><Ship className="size-4 shrink-0 text-foreground" aria-hidden />{t.home.globeCountries}</li>
            </ul>
          </div>
          <div className="relative min-w-0 overflow-hidden rounded-2xl bg-secondary text-secondary-foreground">
            <div className="relative aspect-[5/4] sm:aspect-[6/5] lg:aspect-[0.95]">
              <Image src="/images/truck-fleet-hero.png" alt={t.home.fleet.truckTitle} fill priority sizes="(max-width: 1023px) 100vw, 50vw" className="object-cover" />
              <div className="absolute start-5 top-5 inline-flex items-center gap-2 rounded-md bg-background/95 px-3 py-2 text-sm font-semibold text-foreground"><Wrench className="size-4" aria-hidden />{t.nav.products}</div>
            </div>
            {active && (
              <div className="absolute inset-x-3 bottom-3 rounded-xl border border-border bg-background text-foreground sm:inset-x-4 sm:bottom-4">
                <div className="flex items-center justify-between gap-3 p-3">
                  <Link href={`/cars/${active.kind}/${active.slug}`} className="flex min-w-0 flex-1 items-center gap-3" onFocus={() => setPaused(true)}>
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-secondary"><Image src={active.image} alt="" fill sizes="64px" className="object-contain" /></div>
                    <div className="flex min-w-0 flex-col gap-1"><span className="text-sm text-muted-foreground">{active.kind === 'import' ? t.cars.sectionImport : t.cars.sectionSale}</span><span className="truncate text-base font-bold">{active.model}</span></div>
                  </Link>
                  {slides.length > 1 && <div className="flex shrink-0 items-center gap-1" dir="ltr">
                    <Button variant="outline" size="icon-lg" onClick={() => advance(-1)} aria-label={t.home.heroPrev}><ChevronLeft aria-hidden /></Button>
                    <Button variant="outline" size="icon-lg" onClick={() => advance(1)} aria-label={t.home.heroNext}><ChevronRight aria-hidden /></Button>
                    <Button variant="ghost" size="icon-lg" onClick={() => setPaused((value) => !value)} aria-label={paused ? t.home.heroPlay : t.home.heroPause}>{paused ? <Play aria-hidden /> : <Pause aria-hidden />}</Button>
                  </div>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
