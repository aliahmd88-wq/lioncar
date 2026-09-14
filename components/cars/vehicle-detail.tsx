'use client'

import { useState } from 'react'
import Link from '@/components/localized-link'
import Image from 'next/image'
import { ArrowRight, Calendar, Car, Check, Fuel, Gauge, MapPin, MessageCircle, Settings2, Users } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'
import { LocalizedHtml } from '@/components/localized-html'
import { pick, type Vehicle } from '@/lib/wp/types'
import { cn } from '@/lib/utils'

export function VehicleDetail({ vehicle }: { vehicle: Vehicle }) {
  const { t, locale } = useLanguage()
  const gallery = [vehicle.image, ...vehicle.gallery].filter((x): x is string => !!x)
  const [active, setActive] = useState(gallery[0] ?? null)

  const isImport = vehicle.kind === 'import'
  const detail = isImport ? t.importDetail : t.saleDetail

  const subtitle = pick(vehicle.subtitle, locale)
  const description = pick(vehicle.description, locale)
  const wa =
    'https://wa.me/972539573718?text=' +
    encodeURIComponent(`${detail.whatsappIntro} ${vehicle.model}`)

  const importStages = [t.import.step1Title, t.import.step2Title, t.import.step3Title, t.import.step4Title]

  const specRows: { icon: typeof Car; label: string; value: string | null; ltr?: boolean }[] = [
    { icon: Calendar, label: t.import.year, value: vehicle.year ? String(vehicle.year) : null },
    {
      icon: Gauge,
      label: t.import.mileage,
      value: vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : null,
      ltr: true,
    },
    { icon: Settings2, label: t.import.engine, value: vehicle.specs.engine },
    { icon: Settings2, label: t.import.transmission, value: vehicle.specs.transmission },
    { icon: Fuel, label: t.import.fuel, value: vehicle.specs.fuel },
    { icon: Users, label: t.import.seats, value: vehicle.specs.seats ? String(vehicle.specs.seats) : null },
    {
      icon: MapPin,
      label: t.import.filterOrigin,
      value:
        isImport && vehicle.origin
          ? (t.import.origins as Record<string, string>)[vehicle.origin] ?? vehicle.origin
          : null,
    },
    {
      icon: Car,
      label: t.cars.filterCondition,
      value:
        !isImport && vehicle.condition
          ? (t.cars.conditions as Record<string, string>)[vehicle.condition] ?? vehicle.condition
          : null,
    },
    {
      icon: Users,
      label: t.cars.previousOwners,
      value: !isImport && vehicle.previousOwners != null ? String(vehicle.previousOwners) : null,
    },
  ].filter((r) => r.value)

  const eta = pick(vehicle.eta, locale)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Link href="/cars" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-accent">
        <ArrowRight className="size-4 rotate-180 flip-x" aria-hidden />
        {t.saleDetail.backToCars}
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <div className="flex flex-col gap-4">
          <div className="relative aspect-16/10 overflow-hidden rounded-3xl border border-border bg-secondary">
            {active ? (
              <Image src={active || '/placeholder.svg'} alt={vehicle.imageAlt || vehicle.model} fill sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" priority />
            ) : (
              <span className="grid h-full place-items-center text-muted-foreground">
                <Car className="size-14" aria-hidden />
              </span>
            )}
          </div>
          {gallery.length > 1 ? (
            <div className="flex flex-wrap gap-3">
              {gallery.map((img) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setActive(img)}
                  className={cn(
                    'relative h-20 w-28 overflow-hidden rounded-xl border-2 transition-colors',
                    active === img ? 'border-accent' : 'border-border hover:border-accent/50',
                  )}
                >
                  <Image src={img || '/placeholder.svg'} alt="" fill sizes="112px" className="object-cover" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
              {isImport ? t.cars.sectionImport : t.cars.sectionSale}
            </span>
            {vehicle.isTaxi ? (
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold">{t.cars.badgeTaxi}</span>
            ) : null}
            {vehicle.isParallel ? (
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold">{t.cars.badgeParallel}</span>
            ) : null}
          </div>

          <div>
            <h1 className="text-balance font-serif text-3xl font-bold leading-tight sm:text-4xl">{vehicle.model}</h1>
            {subtitle ? <p className="mt-2 text-lg text-muted-foreground">{subtitle}</p> : null}
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <span className="block text-xs text-muted-foreground">
              {isImport ? t.import.landedPrice : t.cars.askingPrice}
            </span>
            {vehicle.price ? (
              <span className="font-serif text-3xl font-black" dir="ltr">
                {vehicle.price}
              </span>
            ) : (
              <span className="text-lg font-semibold text-muted-foreground">{t.common.onRequest}</span>
            )}
            {isImport && eta ? (
              <p className="mt-1 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{eta}</span>
              </p>
            ) : null}

            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <MessageCircle className="size-4" aria-hidden />
              {detail.requestThisCar}
            </a>
          </div>

          {vehicle.highlights.length > 0 ? (
            <div>
              <h2 className="mb-3 font-serif text-lg font-bold">{detail.highlights}</h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {vehicle.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                    {pick(h, locale)}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>

      {/* Specs */}
      {specRows.length > 0 ? (
        <div className="mt-14">
          <h2 className="font-serif text-2xl font-bold">{t.common.specifications}</h2>
          <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {specRows.map((row, i) => (
              <div key={i} className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3">
                <span className="grid size-9 place-items-center rounded-xl bg-secondary text-accent">
                  <row.icon className="size-4" aria-hidden />
                </span>
                <div className="min-w-0">
                  <dt className="text-xs text-muted-foreground">{row.label}</dt>
                  <dd className="font-semibold" dir={row.ltr ? 'ltr' : undefined}>
                    {row.value}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      ) : null}

      {/* Import journey */}
      {isImport ? (
        <div className="mt-14 rounded-3xl border border-border bg-secondary/40 p-6 lg:p-8">
          <h2 className="font-serif text-2xl font-bold">{t.importDetail.timeline}</h2>
          <ol className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {importStages.map((label, i) => {
              const reached = vehicle.stage != null ? i < vehicle.stage : false
              return (
                <li key={label} className="flex flex-col gap-2">
                  <span
                    className={cn(
                      'grid size-9 place-items-center rounded-full text-sm font-bold',
                      reached ? 'bg-accent text-accent-foreground' : 'border border-border text-muted-foreground',
                    )}
                  >
                    {reached ? <Check className="size-4" aria-hidden /> : i + 1}
                  </span>
                  <span className="text-sm font-semibold">{label}</span>
                </li>
              )
            })}
          </ol>
        </div>
      ) : null}

      {description ? (
        <div className="mt-14 max-w-3xl">
          <h2 className="font-serif text-2xl font-bold">{detail.overview}</h2>
          <LocalizedHtml value={description} className="mt-4 leading-relaxed text-muted-foreground [&_p]:mb-3" />
        </div>
      ) : null}
    </div>
  )
}
