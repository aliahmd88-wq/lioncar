'use client'

import Link from 'next/link'
import { MessageCircle, Clock } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'
import { Eyebrow } from '@/components/section-heading'

export function HomeCta({ whatsapp, hours }: { whatsapp: string; hours: string }) {
  const { t } = useLanguage()
  const wa = whatsapp.replace(/[^\d]/g, '')

  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[2rem] border border-border bg-primary px-6 py-14 text-primary-foreground sm:px-12 lg:py-20">
        <div className="pointer-events-none absolute inset-0 hero-grid opacity-10" aria-hidden />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <Eyebrow className="text-accent">{t.home.cta.eyebrow}</Eyebrow>
          <h2 className="text-balance font-serif text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            {t.home.cta.title}
          </h2>
          <p className="max-w-2xl text-pretty leading-relaxed text-primary-foreground/75">{t.home.cta.lead}</p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`https://wa.me/${wa}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[1.02] active:scale-95"
            >
              <MessageCircle className="size-4" aria-hidden />
              {t.home.cta.primary}
            </a>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 px-6 py-3 text-sm font-semibold transition-colors hover:bg-primary-foreground/10"
            >
              {t.home.cta.secondary}
            </Link>
          </div>
          <p className="inline-flex items-center gap-2 text-sm text-primary-foreground/60">
            <Clock className="size-4" aria-hidden />
            {hours}
          </p>
        </div>
      </div>
    </section>
  )
}
