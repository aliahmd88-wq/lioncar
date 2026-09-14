'use client'

import { Mail, MapPin, Phone, ArrowUpRight, MessageCircle } from 'lucide-react'
import Link from '@/components/localized-link'
import { BrandLogo } from '@/components/brand-logo'
import { useLanguage } from '@/lib/i18n/context'
import type { StoreSettings } from '@/lib/wp/types'

export function SiteFooter({ store }: { store: StoreSettings }) {
  const { t } = useLanguage()
  const columns = [
    { title: t.footer.fleet, links: [{ label: t.footer.fleetLinks.trucks, href: '/cars' }, { label: t.footer.fleetLinks.vans, href: '/cars' }, { label: t.footer.fleetLinks.luxury, href: '/cars' }, { label: t.footer.fleetLinks.used, href: '/cars' }] },
    { title: t.footer.services, links: [{ label: t.footer.servicesLinks.import, href: '/cars' }, { label: t.footer.servicesLinks.parts, href: '/products' }, { label: t.footer.servicesLinks.consulting, href: '/contact' }, { label: t.footer.servicesLinks.support, href: '/return-policy' }] },
    { title: t.footer.company, links: [{ label: t.footer.companyLinks.news, href: '/blog' }, { label: t.footer.companyLinks.contact, href: '/contact' }, { label: t.seo.termsTitle, href: '/terms' }, { label: t.seo.privacyTitle, href: '/privacy-policy' }] },
  ]
  const socials = [{ name: 'Facebook', href: store.facebook }, { name: 'Instagram', href: store.instagram }, { name: 'TikTok', href: store.tiktok }].filter((social) => social.href)
  return (
    <footer className="border-t border-border bg-secondary text-secondary-foreground">
      <div className="site-container py-12 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-3 lg:grid-cols-5">
          <div className="flex flex-col gap-5 sm:col-span-3 lg:col-span-2">
            <Link href="/" aria-label={t.nav.brand} className="w-fit"><BrandLogo /></Link>
            <p className="max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">{t.footer.tagline}</p>
            <a href={`https://wa.me/${store.whatsapp.replace(/[^\d]/g, '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex w-fit items-center gap-2 text-sm font-semibold underline decoration-primary underline-offset-4"><MessageCircle className="size-4" aria-hidden />{t.common.whatsapp}<ArrowUpRight className="size-4 flip-x" aria-hidden /></a>
          </div>
          {columns.map((column) => <nav key={column.title} aria-label={column.title}><h3 className="text-base font-bold">{column.title}</h3><ul className="mt-5 flex flex-col gap-3">{column.links.map((link) => <li key={link.label}><Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground hover:underline">{link.label}</Link></li>)}</ul></nav>)}
        </div>
        <div className="mt-12 border-t border-border py-6">
          <div className="flex flex-wrap items-center justify-between gap-5 text-sm">
            {store.phone && <a href={`tel:${store.phone.replace(/[^\d+]/g, '')}`} className="inline-flex items-center gap-2 hover:underline"><Phone className="size-4" aria-hidden /><span dir="ltr">{store.phone}</span></a>}
            {store.email && <a href={`mailto:${store.email}`} className="inline-flex items-center gap-2 hover:underline"><Mail className="size-4" aria-hidden /><span dir="ltr">{store.email}</span></a>}
            {store.address && <span className="inline-flex items-center gap-2 text-muted-foreground"><MapPin className="size-4 shrink-0" aria-hidden /><span>{store.address}</span></span>}
          </div>
        </div>
        <div className="border-t border-border pt-6"><div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground"><p>© {new Date().getFullYear()} {t.nav.brand}. {t.footer.rights}</p><div className="flex flex-wrap gap-5">{socials.map((social) => <a key={social.name} href={social.href!} target="_blank" rel="noopener noreferrer" className="hover:text-foreground hover:underline">{social.name}</a>)}</div><p>{t.footer.slogan}</p></div></div>
      </div>
    </footer>
  )
}
