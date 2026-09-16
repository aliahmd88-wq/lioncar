'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'
import { SectionHeading } from '@/components/section-heading'
import { cn } from '@/lib/utils'
import { serializeJsonLd } from '@/lib/json-ld'

export function VehicleFaq() {
  const { t } = useLanguage()
  const [open, setOpen] = useState<number | null>(0)

  const items = [
    { q: t.cars.faq.q1, a: t.cars.faq.a1 },
    { q: t.cars.faq.q2, a: t.cars.faq.a2 },
    { q: t.cars.faq.q3, a: t.cars.faq.a3 },
  ]

  return (
    <section className="border-t border-border bg-secondary/40">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: items.map((item) => ({
              '@type': 'Question',
              name: item.q,
              acceptedAnswer: { '@type': 'Answer', text: item.a },
            })),
          }),
        }}
      />
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={t.cars.faqEyebrow} title={t.cars.faqTitle} align="center" className="mx-auto items-center" />
        <ul className="mt-10 flex flex-col gap-3">
          {items.map((item, i) => {
            const isOpen = open === i
            return (
              <li key={i} className="overflow-hidden rounded-2xl border border-border bg-card">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-base font-bold">{item.q}</span>
                  <Plus className={cn('size-5 shrink-0 text-primary transition-transform', isOpen && 'rotate-45')} aria-hidden />
                </button>
                <div className={cn('grid transition-all duration-300', isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
