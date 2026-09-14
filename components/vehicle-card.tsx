'use client'

import Link from '@/components/localized-link'
import Image from 'next/image'
import { ArrowUpRight, Gauge, Calendar, MapPin, Car } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'
import { pick, type Vehicle } from '@/lib/wp/types'
import { cn } from '@/lib/utils'

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const { t, locale } = useLanguage()

  const href = vehicle.kind === 'import' ? `/cars/import/${vehicle.slug}` : `/cars/sale/${vehicle.slug}`
  const subtitle = pick(vehicle.subtitle, locale)

  const statusLabel =
    vehicle.kind === 'import'
      ? (t.import.status as Record<string, string>)[toCamel(vehicle.status)] ?? vehicle.status
      : (t.cars.saleStatus as Record<string, string>)[vehicle.status] ?? vehicle.status

  return (
    <article className="lux-card group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card">
      <Link href={href} className="relative block aspect-16/10 overflow-hidden bg-secondary">
        {vehicle.image ? (
          <Image
            src={vehicle.image || '/placeholder.svg'}
            alt={vehicle.imageAlt || vehicle.model}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="grid h-full place-items-center text-muted-foreground">
            <Car className="size-10" aria-hidden />
          </span>
        )}
        <div className="absolute inset-x-3 top-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold">{statusLabel}</span>
          {vehicle.isTaxi ? (
            <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">
              {t.cars.badgeTaxi}
            </span>
          ) : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-serif text-lg font-bold leading-snug">{vehicle.model}</h3>
            {subtitle ? <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">{subtitle}</p> : null}
          </div>
          <ArrowUpRight className="size-5 shrink-0 text-muted-foreground transition-colors group-hover:text-accent" aria-hidden />
        </div>

        <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
          {vehicle.year ? (
            <li className="inline-flex items-center gap-1.5">
              <Calendar className="size-4" aria-hidden />
              {vehicle.year}
            </li>
          ) : null}
          {vehicle.mileage ? (
            <li className="inline-flex items-center gap-1.5">
              <Gauge className="size-4" aria-hidden />
              <span dir="ltr">{vehicle.mileage.toLocaleString()} km</span>
            </li>
          ) : null}
          {vehicle.kind === 'import' && vehicle.origin ? (
            <li className="inline-flex items-center gap-1.5">
              <MapPin className="size-4" aria-hidden />
              {(t.import.origins as Record<string, string>)[vehicle.origin] ?? vehicle.origin}
            </li>
          ) : null}
        </ul>

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <div>
            <span className="block text-xs text-muted-foreground">
              {vehicle.kind === 'import' ? t.import.landedPrice : t.cars.askingPrice}
            </span>
            {vehicle.price ? (
              <span className="text-lg font-bold" dir="ltr">
                {vehicle.price}
              </span>
            ) : (
              <span className="text-sm font-semibold text-muted-foreground">{t.common.onRequest}</span>
            )}
          </div>
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-2 text-sm font-semibold transition-colors hover:border-accent hover:text-accent"
          >
            {t.common.viewDetails}
          </Link>
        </div>
      </div>
    </article>
  )
}

function toCamel(s: string) {
  return s.replace(/[-_](\w)/g, (_, c) => c.toUpperCase())
}
