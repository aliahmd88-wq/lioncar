'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X, ShoppingBag, ArrowUpRight, Phone, MapPin } from 'lucide-react'
import Link from '@/components/localized-link'
import { useLanguage } from '@/lib/i18n/context'
import { stripLocale } from '@/lib/i18n/config'
import { useCart } from '@/lib/cart-context'
import { LanguageSwitcher } from '@/components/language-switcher'
import { BrandLogo } from '@/components/brand-logo'
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet'
import type { StoreSettings } from '@/lib/wp/types'
import { cn } from '@/lib/utils'

export function SiteHeader({ store }: { store: StoreSettings }) {
  const { t, dir, locale } = useLanguage()
  const { count } = useCart()
  const pathname = stripLocale(usePathname())
  const [open, setOpen] = useState(false)
  const links = [
    { href: '/', label: t.nav.home },
    { href: '/products', label: t.nav.products },
    { href: '/cars', label: t.nav.cars },
    { href: '/blog', label: t.nav.blog },
    { href: '/contact', label: t.nav.contact },
  ]
  const active = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href)
  const skip = locale === 'ar' ? 'انتقل إلى المحتوى' : locale === 'he' ? 'דילוג לתוכן' : 'Skip to content'

  return (
    <>
      <a href="#main-content" className="sr-only fixed start-4 top-4 z-50 rounded-lg bg-primary text-primary-foreground focus:not-sr-only focus:px-5 focus:py-3">{skip}</a>
      <div className="bg-inverse text-inverse-foreground">
        <div className="site-container flex min-h-9 items-center justify-between gap-4 text-sm">
          <span className="inline-flex items-center gap-2"><MapPin className="size-3.5 text-primary" aria-hidden /><span>{locale === 'ar' ? 'الرينة، شارع 745' : locale === 'he' ? 'ריינה, כביש 745' : 'Reineh, Route 745'}</span></span>
          <span className="hidden text-inverse-foreground/70 md:block">{t.footer.slogan}</span>
          <a href={`tel:${store.phone.replace(/[^\d+]/g, '')}`} className="inline-flex items-center gap-2 hover:text-primary"><Phone className="size-3.5 text-primary" aria-hidden /><span dir="ltr">{store.phone}</span></a>
        </div>
      </div>
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 text-foreground backdrop-blur-md">
        <div className="site-container flex h-20 items-center justify-between gap-5">
          <Link href="/" aria-label="Lion Car"><BrandLogo /></Link>
          <nav className="hidden items-center gap-5 lg:flex xl:gap-7" aria-label={t.nav.openMenu}>
            {links.map((link) => <Link key={link.href} href={link.href} aria-current={active(link.href) ? 'page' : undefined} className={cn('border-b-2 py-7 text-sm font-semibold transition-colors', active(link.href) ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:border-primary hover:text-foreground')}>{link.label}</Link>)}
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSwitcher className="hidden sm:flex" />
            <Link href="/cart" className="relative grid size-10 place-items-center rounded-lg transition-colors hover:bg-secondary" aria-label={t.nav.cart}>
              <ShoppingBag className="size-5" aria-hidden />
              {count > 0 && <span className="absolute -end-1 -top-1 grid min-w-5 place-items-center rounded-full bg-primary px-1 text-sm font-bold text-primary-foreground">{count}</span>}
            </Link>
            <Link href="/contact" className="action-primary hidden xl:inline-flex">{t.common.sendRequest}<ArrowUpRight className="size-4 flip-x" aria-hidden /></Link>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger aria-label={t.nav.openMenu} className="grid size-10 place-items-center rounded-lg border border-border lg:hidden"><Menu className="size-5" aria-hidden /></SheetTrigger>
              <SheetContent side={dir === 'rtl' ? 'right' : 'left'} showCloseButton={false}>
                <SheetHeader>
                  <div className="flex items-center justify-between gap-4">
                    <SheetTitle><BrandLogo compact /></SheetTitle>
                    <SheetClose aria-label={t.nav.closeMenu} className="grid size-10 place-items-center rounded-lg border border-border"><X className="size-5" aria-hidden /></SheetClose>
                  </div>
                </SheetHeader>
                <nav aria-label={t.nav.openMenu} className="flex flex-col gap-1 px-4">
                  {links.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} aria-current={active(link.href) ? 'page' : undefined} className={cn('rounded-lg px-4 py-3 text-base font-semibold', active(link.href) ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-secondary')}>{link.label}</Link>)}
                </nav>
                <div className="flex flex-col gap-4 px-5"><LanguageSwitcher /><a href={`tel:${store.phone.replace(/[^\d+]/g, '')}`} className="action-primary"><Phone className="size-4" aria-hidden /><span dir="ltr">{store.phone}</span></a></div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  )
}
