'use client'

import { MessageCircle, ArrowUpRight, Clock } from 'lucide-react'
import Link from '@/components/localized-link'
import { useLanguage } from '@/lib/i18n/context'
import { Eyebrow } from '@/components/section-heading'

export function HomeCta({ whatsapp, hours }: { whatsapp: string; hours: string }) {
  const { t, locale } = useLanguage()
  const number = whatsapp.replace(/[^\d]/g, '')
  return (
    <section className="site-container pb-16 lg:pb-20">
      <div className="rounded-2xl bg-inverse text-inverse-foreground">
        <div className="flex flex-col gap-8 px-7 py-12 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <div className="flex max-w-2xl flex-col gap-5"><Eyebrow className="text-inverse-foreground">{t.home.cta.eyebrow}</Eyebrow><h2 className="text-balance text-3xl font-extrabold leading-tight sm:text-4xl">{t.home.cta.title}</h2><p className="text-pretty text-base leading-relaxed text-inverse-foreground/75">{t.home.cta.lead}</p></div>
          <div className="flex shrink-0 flex-col gap-4 lg:max-w-64">
            <a href={`https://wa.me/${number}`} target="_blank" rel="noopener noreferrer" className="action-primary"><MessageCircle className="size-5" aria-hidden />{t.home.cta.primary}<ArrowUpRight className="size-4 flip-x" aria-hidden /></a>
            <Link href="/products" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-inverse-foreground/25 px-6 py-3 text-sm font-semibold text-inverse-foreground transition-colors hover:bg-inverse-foreground/10">{t.home.cta.secondary}</Link>
            {hours && <p className="inline-flex items-start gap-2 text-sm leading-relaxed text-inverse-foreground/70"><Clock className="mt-0.5 size-4 shrink-0" aria-hidden /><span>{locale === 'en' ? hours : t.seo.openingHoursText}</span></p>}
          </div>
        </div>
      </div>
    </section>
  )
}
