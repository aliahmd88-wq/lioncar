'use client'

import Image from 'next/image'
import { ArrowUpRight, Package } from 'lucide-react'
import Link from '@/components/localized-link'
import { cn } from '@/lib/utils'

export type StripItem = {
  key: string
  href: string
  image: string | null
  title: string
  subtitle?: string | null
  price?: string | null
  tag?: string | null
}

/**
 * A live inventory row inside the home header: real products or vehicles from
 * WordPress, gliding across the video. The list is rendered twice so the loop
 * is seamless; the second copy is decorative and hidden from assistive tech.
 */
export function HeroStrip({
  label,
  count,
  href,
  viewAllLabel,
  items,
  reverse = false,
  wide = false,
}: {
  label: string
  count: number
  href: string
  viewAllLabel: string
  items: StripItem[]
  reverse?: boolean
  wide?: boolean
}) {
  if (items.length === 0) return null
  const loop = [...items, ...items]

  return (
    <div className="border-t border-white/10 py-3">
      <div className="site-container flex items-center justify-between gap-4">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/85">
          <span className="size-2 rounded-full bg-primary" aria-hidden />
          {label}
          <span dir="ltr" className="font-semibold text-white/50">
            ({count})
          </span>
        </p>
        <Link href={href} className="inline-flex items-center gap-1 text-xs font-semibold text-white transition-colors hover:text-primary">
          {viewAllLabel}
          <ArrowUpRight className="size-3.5 flip-x" aria-hidden />
        </Link>
      </div>

      <div className="hero-strip relative mt-3 overflow-hidden" dir="ltr">
        <div className={cn('hero-strip-track flex w-max gap-3 px-5 sm:px-8 lg:px-10', reverse && 'hero-strip-reverse')}>
          {loop.map((item, i) => {
            const duplicate = i >= items.length
            return (
              <Link
                key={`${item.key}-${i}`}
                href={item.href}
                aria-hidden={duplicate || undefined}
                tabIndex={duplicate ? -1 : undefined}
                className={cn(
                  'flex shrink-0 items-center gap-3 rounded-xl border border-white/10 bg-white/95 p-2 text-foreground shadow-lg transition-colors hover:border-primary',
                  wide ? 'w-72' : 'w-60',
                  duplicate && 'hero-strip-duplicate',
                )}
              >
                <span className={cn('relative shrink-0 overflow-hidden rounded-lg bg-secondary', wide ? 'h-16 w-24' : 'size-16')}>
                  {item.image ? (
                    <Image src={item.image} alt="" fill sizes="96px" className="object-cover" />
                  ) : (
                    <span className="grid h-full place-items-center text-muted-foreground">
                      <Package className="size-5" aria-hidden />
                    </span>
                  )}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-0.5 text-start" dir="auto">
                  {item.tag ? <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{item.tag}</span> : null}
                  <span className="line-clamp-2 text-xs font-bold leading-snug">{item.title}</span>
                  {item.subtitle ? <span className="truncate text-[11px] text-muted-foreground">{item.subtitle}</span> : null}
                  {item.price ? (
                    <span className="text-xs font-extrabold" dir="ltr">
                      {item.price}
                    </span>
                  ) : null}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
