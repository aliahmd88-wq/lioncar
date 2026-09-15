'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, ArrowUpRight, Car, Package, Search, ShieldCheck, Ship } from 'lucide-react'
import Link from '@/components/localized-link'
import { useLanguage } from '@/lib/i18n/context'
import { localeHref } from '@/lib/i18n/config'
import { Eyebrow } from '@/components/section-heading'
import { HeroVideoBackground } from '@/components/home/hero-video-background'
import { HeroStrip, type StripItem } from '@/components/home/hero-strip'
import { pick, type Product, type Vehicle } from '@/lib/wp/types'

/** The truck makes the shop is known for; each chip opens the catalogue filtered. */
const BRANDS = ['DAF', 'MAN', 'Volvo', 'Scania', 'Mercedes', 'Iveco']

/**
 * Home header that is also the front door of the store: the video scenes
 * behind, the brand promise and a real search box on top, and two live
 * inventory strips (parts, vehicles) along the bottom edge.
 */
export function HomeHeroStore({
  products,
  vehicles,
  partsCount,
  vehiclesCount,
  videos = 2,
}: {
  products: Product[]
  vehicles: Vehicle[]
  partsCount: number
  vehiclesCount: number
  videos?: 1 | 2
}) {
  const { t, locale } = useLanguage()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const s = t.home.heroStore

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const q = query.trim()
    router.push(localeHref(q ? `/products?q=${encodeURIComponent(q)}` : '/products', locale))
  }

  const partItems: StripItem[] = products.map((product) => ({
    key: product.slug,
    href: `/products/${product.slug}`,
    image: product.image,
    title: pick(product.name, locale),
    subtitle: product.brand || product.sku,
    price: product.price,
  }))

  const carItems: StripItem[] = vehicles.map((vehicle) => ({
    key: `${vehicle.kind}-${vehicle.slug}`,
    href: `/cars/${vehicle.kind}/${vehicle.slug}`,
    image: vehicle.image,
    title: vehicle.model,
    subtitle: [vehicle.year, pick(vehicle.subtitle, locale)].filter(Boolean).join(' · '),
    price: vehicle.price,
    tag: vehicle.kind === 'sale' ? s.usedTag : s.newTag,
  }))

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden border-b border-border text-white">
      <HeroVideoBackground count={videos} />

      <div className="site-container relative py-10 lg:py-14">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14">
          {/* Brand promise */}
          <div className="hero-enter flex min-w-0 flex-col gap-6">
            <Eyebrow className="text-white/80">
              {t.home.services.eyebrow} · {t.nav.brand}
            </Eyebrow>
            <h1 id="hero-title" className="text-balance font-sans text-4xl font-extrabold leading-[1.17] tracking-tight sm:text-5xl lg:text-[2.8rem] xl:text-5xl">
              <span className="block">{t.home.heroLine1}</span>
              <span className="block">{t.home.heroLine2}</span>
              <span className="mt-2 block underline decoration-primary decoration-4 underline-offset-8">
                {t.home.heroLine3} {t.home.heroLine4}
              </span>
            </h1>
            <p className="max-w-xl text-pretty text-base leading-relaxed text-white/80">{t.home.heroDescription}</p>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/products" className="action-primary">
                {t.home.cta.secondary}
                <ArrowRight className="size-4 flip-x" aria-hidden />
              </Link>
              <Link href="/cars" className="action-outline border-white/40 bg-transparent text-white hover:bg-white/10">
                {t.nav.cars}
                <ArrowUpRight className="size-4 flip-x" aria-hidden />
              </Link>
            </div>
            <ul className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-white/80">
              <li className="inline-flex items-center gap-2">
                <ShieldCheck className="size-4 shrink-0 text-white" aria-hidden />
                {t.products.trustWarranty}
              </li>
              <li className="inline-flex items-center gap-2">
                <Ship className="size-4 shrink-0 text-white" aria-hidden />
                {t.home.globeCountries}
              </li>
            </ul>
          </div>

          {/* Store panel: search, brand shortcuts, live counts */}
          <aside className="hero-enter rounded-2xl border border-white/15 bg-black/50 p-5 shadow-2xl backdrop-blur-md sm:p-6" aria-label={s.storeTitle}>
            <p className="text-xs font-bold uppercase tracking-wider text-white/70">{s.storeTitle}</p>
            <form onSubmit={submit} role="search" className="mt-3 flex items-center gap-2 rounded-full border border-white/20 bg-white p-1.5 ps-4 text-foreground">
              <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={s.searchPlaceholder}
                aria-label={s.searchPlaceholder}
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <button type="submit" className="shrink-0 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition-colors hover:bg-primary/90">
                {s.searchButton}
              </button>
            </form>
            <div className="mt-4 flex flex-wrap gap-2">
              {BRANDS.map((brand) => (
                <Link
                  key={brand}
                  href={`/products?brand=${encodeURIComponent(brand)}`}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white transition-colors hover:border-primary hover:bg-primary"
                >
                  {brand}
                </Link>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Link href="/products" className="group rounded-xl bg-white/10 p-4 transition-colors hover:bg-primary">
                <Package className="size-5 text-primary transition-colors group-hover:text-white" aria-hidden />
                <p className="mt-3 text-2xl font-extrabold leading-none" dir="ltr">
                  {partsCount}
                </p>
                <p className="mt-1 text-xs text-white/80">{s.partsInStock}</p>
              </Link>
              <Link href="/cars" className="group rounded-xl bg-white/10 p-4 transition-colors hover:bg-primary">
                <Car className="size-5 text-primary transition-colors group-hover:text-white" aria-hidden />
                <p className="mt-3 text-2xl font-extrabold leading-none" dir="ltr">
                  {vehiclesCount}
                </p>
                <p className="mt-1 text-xs text-white/80">{s.carsInStock}</p>
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* Live inventory strips */}
      <div className="relative bg-black/55 pb-1 backdrop-blur-sm">
        <HeroStrip label={s.partsInStock} count={partsCount} href="/products" viewAllLabel={s.viewAll} items={partItems} />
        <HeroStrip label={s.carsInStock} count={vehiclesCount} href="/cars" viewAllLabel={s.viewAll} items={carItems} reverse wide />
      </div>
    </section>
  )
}
