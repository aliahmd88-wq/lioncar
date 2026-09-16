import Link from '@/components/localized-link'
import { ArrowRight } from 'lucide-react'
import { getDictionary } from '@/lib/i18n'
import { readLocale } from '@/lib/i18n/server'
import { Eyebrow } from '@/components/section-heading'

export default async function NotFound() {
  const t = getDictionary(await readLocale())
  return (
    <section className="site-container flex min-h-[60vh] flex-col items-start justify-center gap-6 py-24">
      <Eyebrow>{t.notFound.eyebrow}</Eyebrow>
      <h1 className="text-balance text-4xl font-extrabold tracking-tight md:text-5xl">{t.notFound.title}</h1>
      <p className="max-w-xl text-pretty leading-relaxed text-muted-foreground">{t.notFound.lead}</p>
      <div className="flex flex-wrap gap-3">
        <Link href="/" className="action-primary">
          {t.notFound.home}
          <ArrowRight className="size-4 flip-x" aria-hidden />
        </Link>
        <Link href="/products" className="action-outline">
          {t.notFound.parts}
        </Link>
      </div>
    </section>
  )
}
