'use client'

import Image from 'next/image'
import { ArrowUpRight, Truck, Package, Car } from 'lucide-react'
import Link from '@/components/localized-link'
import { useLanguage } from '@/lib/i18n/context'
import { SectionHeading } from '@/components/section-heading'
import type { Vehicle } from '@/lib/wp/types'

export function HomeFleet({ vehicles }: { vehicles: Vehicle[] }) {
  const { t } = useLanguage()
  const cards = [
    { icon: Truck, title: t.home.fleet.truckTitle, tag: t.home.fleet.truckTag, description: t.home.fleet.truckDesc, image: vehicles.find((vehicle) => vehicle.bodyTypes.some((type) => ['truck', 'tractor', 'tractor_unit'].includes(type)) && vehicle.image)?.image },
    { icon: Package, title: t.home.fleet.vanTitle, tag: t.home.fleet.vanTag, description: t.home.fleet.vanDesc, image: vehicles.find((vehicle) => vehicle.bodyTypes.some((type) => ['van', 'pickup', 'minivan'].includes(type)) && vehicle.image)?.image },
    { icon: Car, title: t.home.fleet.luxuryTitle, tag: t.home.fleet.luxuryTag, description: t.home.fleet.luxuryDesc, image: vehicles.find((vehicle) => vehicle.bodyTypes.some((type) => ['suv', 'sedan', 'sports', 'luxury_mpv'].includes(type)) && vehicle.image)?.image },
  ]

  return (
    <section className="site-container py-16 lg:py-20">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading eyebrow={t.home.fleet.eyebrow} title={t.home.fleet.titleStart} titleEm={t.home.fleet.titleEm} lead={t.home.fleet.lead} />
        <Link href="/cars" className="action-outline">{t.nav.cars}<ArrowUpRight className="size-4 flip-x" aria-hidden /></Link>
      </div>
      <div className="mt-9 grid gap-5 md:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.title} href="/cars" className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground transition-colors hover:border-primary">
            <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-secondary text-secondary-foreground">
              {card.image ? <Image src={card.image} alt={card.title} fill sizes="(max-width: 767px) 100vw, 33vw" className="object-contain transition-transform duration-300 group-hover:scale-[1.03]" /> : <card.icon className="size-16 text-muted-foreground" aria-hidden />}
            </div>
            <div className="flex flex-1 flex-col gap-4 p-6">
              <div className="flex items-start justify-between gap-3"><h3 className="text-xl font-bold leading-snug">{card.title}</h3><ArrowUpRight className="size-5 shrink-0 flip-x" aria-hidden /></div>
              <span className="text-sm font-semibold text-muted-foreground">{card.tag}</span>
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">{card.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
