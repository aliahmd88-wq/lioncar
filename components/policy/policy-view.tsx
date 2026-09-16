'use client'

import { FileText } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'
import { PageHeader } from '@/components/page-header'
import { LocalizedHtml } from '@/components/localized-html'
import type { PolicyPage } from '@/lib/wp/types'

export function PolicyView({
  page,
  fallbackTitle,
}: {
  page: PolicyPage | null
  fallbackTitle: string
}) {
  const { t } = useLanguage()
  const title = page?.title || fallbackTitle

  return (
    <>
      <PageHeader eyebrow={t.nav.brand} title={title} />
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        {page?.content ? (
          <LocalizedHtml
            value={page.content}
            className="leading-relaxed text-foreground/90 [&_a]:text-primary [&_a]:underline [&_h2]:mt-8 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mt-6 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:font-bold [&_li]:mb-2 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:ps-6 [&_p]:mb-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:ps-6"
          />
        ) : (
          <div className="rounded-3xl border border-dashed border-border py-16 text-center">
            <FileText className="mx-auto size-10 text-muted-foreground" aria-hidden />
            <p className="mt-4 text-muted-foreground">{t.common.contentUnavailable}</p>
          </div>
        )}
      </section>
    </>
  )
}
