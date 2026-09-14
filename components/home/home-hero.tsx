'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Ship, Wrench } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'

type Slide = { image: string; model: string; kind: 'import' | 'sale'; slug: string }

export function HomeHero({ slides }: { slides: Slide[] }) {
  const { t } = useLanguage()
  const [index, setIndex] = useState(0)
  const hasSlides = slides.length > 0

  useEffect(() => {
    if (slides.length < 2) return
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000)
    return () => clearInterval(id)
  }, [slides.length])

  const active = hasSlides ? slides[index] : null
  const go = (dir: number) => setIndex((i) => (i + dir + slides.length) % slides.length)

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute inset-0 hero-grid opacity-60" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:px-8 lg:py-24">
        <div className="flex flex-col gap-8">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-accent" aria-hidden />
            {t.home.stats.eyebrow}
          </span>

          <h1 className="text-balance font-serif text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            {t.home.heroLine1} {t.home.heroLine2}
            <span className="mt-2 block text-accent">
              {t.home.heroLine3} {t.home.heroLine4}
            </span>
          </h1>

          <p className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t.home.heroDescription}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/cars"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95"
            >
              {t.home.heroView}
              <ArrowRight className="size-4 flip-x" aria-hidden />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold transition-colors hover:border-accent hover:text-accent"
            >
              {t.home.cta.secondary}
            </Link>
          </div>

          <ul className="flex flex-wrap gap-x-6 gap-y-3 pt-2 text-sm font-medium text-muted-foreground">
            <li className="inline-flex items-center gap-2">
              <Wrench className="size-4 text-accent" aria-hidden />
              {t.products.trustWarranty}
            </li>
            <li className="inline-flex items-center gap-2">
              <Ship className="size-4 text-accent" aria-hidden />
              {t.home.globeCountries}
            </li>
            <li className="inline-flex items-center gap-2">
              <ShieldCheck className="size-4 text-accent" aria-hidden />
              {t.products.trustFitment}
            </li>
          </ul>
        </div>

        <div className="relative">
          <div className="relative aspect-4/3 overflow-hidden rounded-3xl border border-border bg-secondary shadow-2xl shadow-black/10">
            {active ? (
              <>
                {slides.map((s, i) => (
                  <Image
                    key={s.slug + i}
                    src={s.image || '/placeholder.svg'}
                    alt={s.model}
                    fill
                    priority={i === 0}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className={`object-cover transition-opacity duration-700 ${i === index ? 'opacity-100' : 'opacity-0'}`}
                  />
                ))}
                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent p-5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-white/70">
                    {active.kind === 'import' ? t.cars.sectionImport : t.cars.sectionSale}
                  </span>
                  <p className="font-serif text-xl font-bold text-white">{active.model}</p>
                </div>
              </>
            ) : (
              <div className="grid h-full place-items-center text-muted-foreground">
                <Wrench className="size-12" aria-hidden />
              </div>
            )}
          </div>

          {slides.length > 1 ? (
            <div className="absolute -bottom-4 start-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full border border-border bg-card px-3 py-2 shadow-lg rtl:translate-x-1/2">
              <button
                type="button"
                onClick={() => go(-1)}
                className="grid size-8 place-items-center rounded-full hover:bg-secondary"
                aria-label={t.home.heroPrev}
              >
                <ChevronLeft className="size-4 flip-x" aria-hidden />
              </button>
              <div className="flex items-center gap-1.5">
                {slides.map((s, i) => (
                  <button
                    key={s.slug + i}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`${t.home.heroView} ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${i === index ? 'w-5 bg-accent' : 'w-1.5 bg-border'}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => go(1)}
                className="grid size-8 place-items-center rounded-full hover:bg-secondary"
                aria-label={t.home.heroNext}
              >
                <ChevronRight className="size-4 flip-x" aria-hidden />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
