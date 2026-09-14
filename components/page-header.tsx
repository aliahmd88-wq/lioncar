'use client'

import type { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import { Eyebrow } from '@/components/section-heading'
import Link from '@/components/localized-link'
import { useLanguage } from '@/lib/i18n/context'

export function PageHeader({ eyebrow, title, titleEm, lead, children }: { eyebrow: ReactNode; title: ReactNode; titleEm?: ReactNode; lead?: ReactNode; children?: ReactNode }) {
  const { t } = useLanguage()
  return (
    <section className="border-b border-border bg-secondary text-foreground">
      <div className="site-container py-8 sm:py-12 lg:py-14">
        <nav aria-label={t.nav.home} className="flex items-center gap-2 text-sm text-muted-foreground"><Link href="/" className="hover:text-foreground">{t.nav.home}</Link><ChevronRight className="size-3.5 flip-x" aria-hidden /><span aria-current="page">{eyebrow}</span></nav>
        <div className="mt-8 flex max-w-3xl flex-col gap-4">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="text-balance font-sans text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">{title}{titleEm ? <span> {titleEm}</span> : null}</h1>
          {lead && <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground">{lead}</p>}
          {children}
        </div>
      </div>
    </section>
  )
}
