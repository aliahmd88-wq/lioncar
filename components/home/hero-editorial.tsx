'use client'

import { useState, type FormEvent } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, ArrowUpRight, Search, Truck } from 'lucide-react'
import Link from '@/components/localized-link'
import { useLanguage } from '@/lib/i18n/context'
import { localeHref } from '@/lib/i18n/config'
import { pick, type Vehicle } from '@/lib/wp/types'
import { cn } from '@/lib/utils'

const BRANDS = ['DAF', 'MAN', 'Volvo', 'Scania', 'Mercedes', 'Iveco']

type Slide = { src: string; label: string; alt: string; href: string; tag?: string; contain?: boolean }

/**
 * The ALI FLEET hero composition in Lion Car colours: headline with the
 * customers pill, dashed divider, brand line, and the big rounded frame with
 * the floating thumbnail card. Two things make it a store front rather than
 * a poster: the card pages through real vehicles from stock, and the +++
 * ornament is replaced by a part-number search that lands on the catalogue.
 */
export function HeroEditorial({ vehicles }: { vehicles: Vehicle[] }) {
  const { t, locale } = useLanguage()
  const router = useRouter()
  const [active, setActive] = useState(0)
  const [query, setQuery] = useState('')
  const s = t.home.heroStore

  const slides: Slide[] = [
    { src: '/images/hero-showroom.png', label: t.home.heroSlides.flagship, alt: t.home.heroAvatarAlt, href: '/cars' },
    ...vehicles
      .filter((vehicle) => vehicle.image)
      .slice(0, 5)
      .map((vehicle) => ({
        src: vehicle.image as string,
        label: vehicle.model,
        alt: pick(vehicle.subtitle, locale) || vehicle.model,
        href: `/cars/${vehicle.kind}/${vehicle.slug}`,
        tag: vehicle.kind === 'sale' ? s.usedTag : s.newTag,
        contain: true,
      })),
  ]
  const total = slides.length
  const goTo = (index: number) => setActive((index + total) % total)
  const windowSlides = [0, 1, 2].map((offset) => {
    const index = (active + offset) % total
    return { ...slides[index], index }
  })
  const activeSlide = slides[active]

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const q = query.trim()
    router.push(localeHref(q ? `/products?q=${encodeURIComponent(q)}` : '/products', locale))
  }

  return (
    <section aria-labelledby="hero-title" className="pt-8 md:pt-12">
      <div className="site-container">
        <div className="grid items-stretch gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
          {/* ---------- Copy column ---------- */}
          {/* Bottom padding keeps the search bar clear of the floating thumbnail card, which protrudes into this column on large screens. */}
          <div className="hero-enter flex h-full flex-col lg:pt-2 lg:pb-56">
            <h1 id="hero-title" className="text-balance text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground md:text-5xl xl:text-[3.9rem]">
              <span className="flex flex-wrap items-center gap-3">
                {t.home.heroLine1}
                <span className="hidden h-9 w-[4.5rem] shrink-0 items-center overflow-hidden rounded-full border-[3px] border-background shadow-md md:inline-flex xl:h-11 xl:w-[5.5rem]">
                  <Image src="/images/hero-avatars.png" alt={t.home.heroAvatarAlt} width={132} height={48} className="h-full w-full object-cover" />
                </span>
              </span>
              <span className="block">{t.home.heroLine2}</span>
              <span className="block">{t.home.heroLine3}</span>
              <span className="block text-primary">{t.home.heroLine4}</span>
            </h1>

            <div className="mt-8 flex items-center" aria-hidden>
              <span className="h-px flex-1 border-t border-dashed border-muted-foreground/50" />
              <span className="mx-4 flex h-12 w-24 items-center justify-center rounded-[2rem] border border-dashed border-muted-foreground/60">
                <Truck className="size-5 text-muted-foreground" />
              </span>
              <span className="h-px flex-1 border-t border-dashed border-muted-foreground/50" />
            </div>

            <div className="mt-8">
              <p className="text-xl font-extrabold tracking-wide text-primary">{t.nav.brand}</p>
              <p className="mt-3 max-w-md text-pretty text-sm font-semibold leading-relaxed text-foreground/80">{t.home.heroDescription}</p>
            </div>

            {/* The store's front door: part search + brand shortcuts */}
            <form onSubmit={submit} role="search" className="mt-auto pt-8">
              <label htmlFor="hero-search" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {s.storeTitle}
              </label>
              <div className="mt-2 flex items-center gap-2 rounded-full border border-border bg-card p-1.5 ps-4 shadow-sm transition-colors focus-within:border-primary">
                <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                <input
                  id="hero-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={s.searchPlaceholder}
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                <button type="submit" className="shrink-0 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90">
                  {s.searchButton}
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {BRANDS.map((brand) => (
                  <Link key={brand} href={`/products?brand=${encodeURIComponent(brand)}`} className="rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                    {brand}
                  </Link>
                ))}
              </div>
            </form>
          </div>

          {/* ---------- Image column ---------- */}
          <div className="hero-enter relative flex flex-col lg:-mt-10 lg:h-[calc(100%+2.5rem)]" style={{ animationDelay: '120ms' }}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-secondary md:aspect-[16/11.5] lg:aspect-auto lg:min-h-[36rem] lg:flex-1">
              <Image
                key={activeSlide.src}
                src={activeSlide.src}
                alt={activeSlide.alt}
                fill
                priority
                quality={82}
                sizes="(max-width: 1024px) 100vw, 60vw"
                className={cn('fade-in', activeSlide.contain ? 'object-cover object-center' : 'scale-105 object-cover')}
              />
              {activeSlide.tag ? (
                <Link href={activeSlide.href} className="absolute end-5 top-5 inline-flex items-center gap-2 rounded-full bg-background/90 px-4 py-2 text-sm font-bold text-foreground shadow-md backdrop-blur transition-colors hover:text-primary">
                  <span className="size-2 rounded-full bg-primary" aria-hidden />
                  {activeSlide.tag} · {t.common.viewDetails}
                  <ArrowUpRight className="size-4 flip-x" aria-hidden />
                </Link>
              ) : null}
            </div>

            {/* Floating thumbnail card: current vehicle first, then the next two */}
            <div className="relative -mt-14 w-fit max-w-full md:absolute md:bottom-10 md:mt-0 md:ltr:-left-16 md:rtl:-right-16 lg:ltr:-left-24 lg:rtl:-right-24">
              <div className="rounded-3xl bg-card p-3 shadow-2xl ring-1 ring-border">
                <div className="flex gap-3">
                  {windowSlides.map((thumb, position) => (
                    <button
                      key={`${thumb.src}-${position}`}
                      type="button"
                      onClick={() => goTo(thumb.index)}
                      aria-label={`${t.home.heroView} ${thumb.label}`}
                      aria-current={position === 0}
                      className={cn(
                        'group relative h-24 w-24 overflow-hidden rounded-2xl bg-secondary outline-none transition md:h-24 md:w-28 focus-visible:ring-2 focus-visible:ring-primary',
                        position === 0 ? 'ring-2 ring-primary ring-offset-2 ring-offset-card' : 'opacity-80 hover:opacity-100',
                      )}
                    >
                      <Image src={thumb.src} alt={thumb.alt} fill quality={70} sizes="128px" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                      <span className="absolute end-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-foreground text-background">
                        <ArrowUpRight className="size-3 flip-x" aria-hidden />
                      </span>
                      <span className="absolute inset-x-1.5 bottom-1.5 truncate rounded-full bg-card px-1 py-1.5 text-center text-[11px] font-semibold text-card-foreground shadow-sm">
                        {thumb.label}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between px-1 pb-1">
                  <p dir="ltr" className="text-sm text-muted-foreground">
                    <span className="text-xl font-semibold text-foreground">{active + 1}</span>/{total}
                  </p>
                  <div className="flex items-center gap-4">
                    <button type="button" onClick={() => goTo(active - 1)} aria-label={t.home.heroPrev} className="text-muted-foreground transition-colors hover:text-foreground">
                      <ArrowLeft className="size-5 flip-x" aria-hidden />
                    </button>
                    <button type="button" onClick={() => goTo(active + 1)} aria-label={t.home.heroNext} className="text-foreground transition-transform hover:translate-x-0.5">
                      <ArrowRight className="size-5 flip-x" aria-hidden />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-6 md:h-8" aria-hidden />
      </div>
    </section>
  )
}
