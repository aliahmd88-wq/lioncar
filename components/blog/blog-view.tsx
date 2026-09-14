'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Newspaper, Clock } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'
import { PageHeader } from '@/components/page-header'
import { Reveal } from '@/components/reveal'
import type { BlogPost } from '@/lib/wp/types'

export function BlogView({ posts }: { posts: BlogPost[] }) {
  const { t, locale } = useLanguage()

  const fmtDate = (iso: string) => {
    try {
      return new Intl.DateTimeFormat(locale === 'ar' ? 'ar' : locale === 'he' ? 'he-IL' : 'en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(new Date(iso))
    } catch {
      return ''
    }
  }

  const catLabel = (cat: string | null) =>
    cat ? (t.blog.categories as Record<string, string>)[cat] ?? cat : null

  const [featured, ...rest] = posts

  return (
    <>
      <PageHeader eyebrow={t.blog.eyebrow} title={t.blog.title} titleEm={t.blog.titleEm} lead={t.blog.lead} />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {posts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border py-20 text-center">
            <Newspaper className="mx-auto size-12 text-muted-foreground" aria-hidden />
            <p className="mt-4 text-lg font-semibold">{t.blog.allPosts}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-12">
            {featured ? (
              <Reveal>
                <Link
                  href={`/blog/${featured.slug}`}
                  className="group grid overflow-hidden rounded-3xl border border-border bg-card lg:grid-cols-2"
                >
                  <div className="relative aspect-16/10 overflow-hidden bg-secondary lg:aspect-auto">
                    {featured.image ? (
                      <Image
                        src={featured.image || '/placeholder.svg'}
                        alt={featured.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        priority
                      />
                    ) : (
                      <span className="grid h-full place-items-center text-muted-foreground">
                        <Newspaper className="size-12" aria-hidden />
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col justify-center gap-4 p-8 lg:p-12">
                    <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-accent">
                      <span>{t.blog.featured}</span>
                      {catLabel(featured.category) ? <span className="text-muted-foreground">· {catLabel(featured.category)}</span> : null}
                    </div>
                    <h2 className="text-balance font-serif text-2xl font-bold leading-tight sm:text-3xl">{featured.title}</h2>
                    {featured.excerpt ? <p className="line-clamp-3 text-pretty text-muted-foreground">{featured.excerpt}</p> : null}
                    <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{fmtDate(featured.date)}</span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="size-4" aria-hidden />
                        {featured.readMinutes} {t.blog.minRead}
                      </span>
                    </div>
                    <span className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                      {t.blog.readMore}
                      <ArrowUpRight className="size-4" aria-hidden />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ) : null}

            {rest.length > 0 ? (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((post, i) => (
                  <Reveal key={post.slug} delay={Math.min(i, 6) * 70}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl hover:shadow-black/5"
                    >
                      <div className="relative aspect-16/10 overflow-hidden bg-secondary">
                        {post.image ? (
                          <Image
                            src={post.image || '/placeholder.svg'}
                            alt={post.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <span className="grid h-full place-items-center text-muted-foreground">
                            <Newspaper className="size-10" aria-hidden />
                          </span>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col gap-3 p-6">
                        {catLabel(post.category) ? (
                          <span className="text-xs font-semibold uppercase tracking-wider text-accent">{catLabel(post.category)}</span>
                        ) : null}
                        <h3 className="line-clamp-2 font-serif text-lg font-bold leading-snug">{post.title}</h3>
                        {post.excerpt ? <p className="line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p> : null}
                        <div className="mt-auto flex items-center gap-4 pt-2 text-xs text-muted-foreground">
                          <span>{fmtDate(post.date)}</span>
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="size-3.5" aria-hidden />
                            {post.readMinutes} {t.blog.minRead}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            ) : null}
          </div>
        )}
      </section>
    </>
  )
}
