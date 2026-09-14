'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ShoppingCart, Phone } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'
import { useCart } from '@/lib/cart-context'
import { LanguageSwitcher } from '@/components/language-switcher'
import type { StoreSettings } from '@/lib/wp/types'
import { cn } from '@/lib/utils'

export function SiteHeader({ store }: { store: StoreSettings }) {
  const { t } = useLanguage()
  const { count } = useCart()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const links = [
    { href: '/', label: t.nav.home },
    { href: '/products', label: t.nav.products },
    { href: '/cars', label: t.nav.cars },
    { href: '/blog', label: t.nav.blog },
    { href: '/contact', label: t.nav.contact },
  ]

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b transition-colors duration-300',
        scrolled ? 'border-border bg-background/85 backdrop-blur-md' : 'border-transparent bg-background',
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-20 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5" aria-label={t.nav.brand}>
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <LionMark className="size-5" />
          </span>
          <span className="text-xl font-bold tracking-tight">{t.nav.brand}</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'relative rounded-full px-4 py-2 text-sm font-medium transition-colors',
                isActive(l.href)
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {l.label}
              {isActive(l.href) ? (
                <span className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-accent" aria-hidden />
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${store.phone.replace(/\s/g, '')}`}
            className="hidden items-center gap-2 rounded-full border border-border px-3 py-2 text-sm font-semibold transition-colors hover:border-accent hover:text-accent xl:inline-flex"
          >
            <Phone className="size-4" aria-hidden />
            <span dir="ltr">{store.phone}</span>
          </a>
          <LanguageSwitcher className="hidden sm:block" />
          <Link
            href="/cart"
            className="relative grid size-10 place-items-center rounded-full border border-border transition-colors hover:border-accent hover:text-accent"
            aria-label={t.nav.cart}
          >
            <ShoppingCart className="size-5" aria-hidden />
            {count > 0 ? (
              <span className="absolute -end-1 -top-1 grid min-w-5 place-items-center rounded-full bg-accent px-1 text-xs font-bold text-accent-foreground">
                {count}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid size-10 place-items-center rounded-full border border-border lg:hidden"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6" aria-label="Mobile">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  'rounded-xl px-4 py-3 text-base font-medium transition-colors',
                  isActive(l.href) ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-secondary/60',
                )}
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex items-center justify-between gap-3 px-1">
              <LanguageSwitcher />
              <a
                href={`tel:${store.phone.replace(/\s/g, '')}`}
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold"
              >
                <Phone className="size-4" aria-hidden />
                <span dir="ltr">{store.phone}</span>
              </a>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  )
}

function LionMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 3c-1.3 0-2.4.8-2.8 2C7.9 5.2 6.7 6.3 6.5 7.8 5.2 8.2 4.3 9.4 4.3 10.8c0 .9.4 1.7 1 2.3-.2.5-.3 1-.3 1.6 0 2.5 2 4.5 4.5 4.5h.4c.6.8 1.5 1.3 2.6 1.3s2-.5 2.6-1.3h.4c2.5 0 4.5-2 4.5-4.5 0-.6-.1-1.1-.3-1.6.6-.6 1-1.4 1-2.3 0-1.4-.9-2.6-2.2-3-.2-1.5-1.4-2.6-2.7-2.8C14.4 3.8 13.3 3 12 3Z"
        fill="currentColor"
      />
      <circle cx="9.5" cy="12" r="1" fill="var(--color-primary)" />
      <circle cx="14.5" cy="12" r="1" fill="var(--color-primary)" />
    </svg>
  )
}
