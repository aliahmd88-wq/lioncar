'use client'

import Link from '@/components/localized-link'
import Image from 'next/image'
import { ArrowRight, Clock, Newspaper } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'
import { LocalizedHtml } from '@/components/localized-html'
import type { BlogPost } from '@/lib/wp/types'

export function BlogPostView({ post, related }: { post: BlogPost; related: BlogPost[] }) {
  const { t, locale } = useLanguage()

  const fmtDate = (iso: string) => {
    try {
      return new Intl.DateTimeFormat(locale === 'ar' ? 'ar' : locale === 'he' ? 'he-IL' : 'en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(iso))
    } catch {
      return ''
    }
  }

  const catLabel = post.category ? (t.blog.categories as Record<string, string>)[post.category] ?? post.category : null

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-14">
      <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        <ArrowRight className="size-4 rotate-180 flip-x" aria-hidden />
        {t.blog.backToBlog}
      </Link>

      <header className="mt-8 flex flex-col gap-4">
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-primary">
          {catLabel ? <span>{catLabel}</span> : null}
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <Clock className="size-3.5" aria-hidden />
            {post.readMinutes} {t.blog.minRead}
          </span>
        </div>
        <h1 className="text-balance font-serif text-3xl font-black leading-tight sm:text-4xl">{post.title}</h1>
        <p className="text-sm text-muted-foreground">
          {t.blog.publishedOn} {fmtDate(post.date)}
        </p>
      </header>

      {post.image ? (
        <div className="relative mt-8 aspect-16/9 overflow-hidden rounded-3xl border border-border bg-secondary">
          <Image src={post.image || '/placeholder.svg'} alt={post.title} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" priority />
        </div>
      ) : null}

      {post.content ? (
        <LocalizedHtml
          value={post.content}
          className="mt-10 leading-relaxed text-foreground/90 [&_a]:text-primary [&_a]:underline [&_h2]:mt-8 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mt-6 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:font-bold [&_img]:my-6 [&_img]:rounded-2xl [&_li]:mb-2 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:ps-6 [&_p]:mb-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:ps-6"
        />
      ) : null}

      {related.length > 0 ? (
        <div className="mt-16 border-t border-border pt-10">
          <h2 className="font-serif text-2xl font-bold">{t.blog.relatedPosts}</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {related.map((r) => (
              <Link key={r.slug} href={`/blog/${r.slug}`} className="group flex flex-col gap-3">
                <div className="relative aspect-16/10 overflow-hidden rounded-2xl border border-border bg-secondary">
                  {r.image ? (
                    <Image src={r.image || '/placeholder.svg'} alt={r.title} fill sizes="33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <span className="grid h-full place-items-center text-muted-foreground">
                      <Newspaper className="size-8" aria-hidden />
                    </span>
                  )}
                </div>
                <h3 className="line-clamp-2 font-serif text-base font-bold leading-snug group-hover:text-primary">{r.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  )
}
