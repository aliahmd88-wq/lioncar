'use client'

import Link from 'next/link'
import { Truck, Package, Sparkles, ArrowUpRight } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'
import { SectionHeading } from '@/components/section-heading'
import { Reveal } from '@/components/reveal'

export function HomeFleet() {
  const { t } = useLanguage()

  const cards = [
    {
      icon: Truck,
      title: t.home.fleet.truckTitle,
      tag: t.home.fleet.truckTag,
      desc: t.home.fleet.truckDesc,
    },
    {
      icon: Package,
      title: t.home.fleet.vanTitle,
      tag: t.home.fleet.vanTag,
      desc: t.home.fleet.vanDesc,
    },
    {
      icon: Sparkles,
      title: t.home.fleet.luxuryTitle,
      tag: t.home.fleet.luxuryTag,
      desc: t.home.fleet.luxuryDesc,
    },
  ]

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <SectionHeading
        eyebrow={t.home.fleet.eyebrow}
        title={t.home.fleet.titleStart}
        titleEm={t.home.fleet.titleEm}
        lead={t.home.fleet.lead}
      />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {cards.map((card, i) => (
          <Reveal key={card.title} delay={i * 90}>
            <Link
              href="/cars"
              className="group flex h-full flex-col gap-4 rounded-3xl border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl hover:shadow-black/5"
            >
              <div className="flex items-center justify-between">
                <span className="grid size-12 place-items-center rounded-2xl bg-secondary text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                  <card.icon className="size-6" aria-hidden />
                </span>
                <ArrowUpRight className="size-5 text-muted-foreground transition-colors group-hover:text-accent" aria-hidden />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-accent">{card.tag}</span>
                <h3 className="mt-1 font-serif text-xl font-bold">{card.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{card.desc}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
