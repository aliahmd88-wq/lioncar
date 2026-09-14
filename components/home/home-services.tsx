'use client'

import { ArrowUpRight, Ship, Car, Wrench, Check } from 'lucide-react'
import Link from '@/components/localized-link'
import { useLanguage } from '@/lib/i18n/context'
import { SectionHeading } from '@/components/section-heading'

export function HomeServices() {
  const { t } = useLanguage()
  const s = t.home.services
  const services = [
    { icon: Car, kicker: s.scene1Kicker, title: s.scene1Title1, emphasis: s.scene1Title2, description: s.scene1Desc, href: '/cars', notes: [s.spec1Value, s.spec3Value] },
    { icon: Ship, kicker: s.scene2Kicker, title: s.scene2Title1, emphasis: s.scene2Title2, description: s.scene2Desc, href: '/contact', notes: [t.import.step3Title, t.import.step4Title] },
    { icon: Wrench, kicker: s.scene3Kicker, title: s.scene3Title1, emphasis: s.scene3Title2, description: s.scene3Desc, href: '/products', notes: [t.products.trustWarranty, t.products.trustFitment] },
  ]

  return (
    <section className="border-y border-border bg-secondary text-secondary-foreground">
      <div className="site-container py-16 lg:py-20">
        <SectionHeading eyebrow={s.eyebrow} title={s.title} titleEm={s.titleEm} lead={s.lead} />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {services.map((service) => (
            <article key={service.kicker} className="flex h-full flex-col rounded-xl border border-border bg-card text-card-foreground">
              <div className="flex flex-1 flex-col gap-5 p-6 sm:p-7">
                <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-lg bg-primary text-primary-foreground"><service.icon className="size-5" aria-hidden /></span><span className="text-sm font-bold">{service.kicker}</span></div>
                <h3 className="text-balance text-2xl font-bold leading-snug">{service.title} {service.emphasis}</h3>
                <p className="text-pretty text-sm leading-relaxed text-muted-foreground">{service.description}</p>
                <ul className="flex flex-col gap-3 text-sm">{service.notes.map((note) => <li key={note} className="flex items-start gap-2"><Check className="mt-0.5 size-4 shrink-0" aria-hidden /><span>{note}</span></li>)}</ul>
              </div>
              <Link href={service.href} className="flex items-center justify-between gap-3 border-t border-border px-6 py-4 text-sm font-bold transition-colors hover:bg-secondary">{t.common.viewDetails}<ArrowUpRight className="size-5 flip-x" aria-hidden /></Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
