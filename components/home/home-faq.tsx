'use client'

import { useLanguage } from '@/lib/i18n/context'
import { serializeJsonLd } from '@/lib/json-ld'
import { SectionHeading } from '@/components/section-heading'

const FAQ_KEYS = [1, 2, 3, 4, 5, 6, 7] as const

/**
 * Home-page FAQ in the visitor's language, with FAQPage structured data so
 * search engines and AI assistants can quote the answers directly. Native
 * <details> keeps it accessible and needs no JavaScript to open.
 */
export function HomeFaq() {
  const { t } = useLanguage()
  const items = FAQ_KEYS.map((n) => ({
    question: t.faq.items[`q${n}` as keyof typeof t.faq.items],
    answer: t.faq.items[`a${n}` as keyof typeof t.faq.items],
  }))

  return (
    <section id="faq" className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: items.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: { '@type': 'Answer', text: item.answer },
            })),
          }),
        }}
      />
      <SectionHeading eyebrow={t.faq.eyebrow} title={t.faq.title} lead={t.faq.lead} />
      <div className="mt-10 divide-y divide-border rounded-3xl border border-border bg-card">
        {items.map((item, index) => (
          <details key={index} className="group px-6 py-5" open={index === 0}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-start font-serif text-base font-bold text-foreground [&::-webkit-details-marker]:hidden">
              {item.question}
              <span aria-hidden="true" className="text-xl leading-none text-primary transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">{item.answer}</p>
          </details>
        ))}
      </div>
      </div>
    </section>
  )
}
