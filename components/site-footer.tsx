'use client'

import Link from 'next/link'
import { Mail, MapPin, Phone, MessageCircle } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'
import type { StoreSettings } from '@/lib/wp/types'

export function SiteFooter({ store }: { store: StoreSettings }) {
  const { t } = useLanguage()
  const wa = store.whatsapp.replace(/[^\d]/g, '')

  const columns = [
    {
      title: t.footer.fleet,
      links: [
        { label: t.footer.fleetLinks.trucks, href: '/cars' },
        { label: t.footer.fleetLinks.vans, href: '/cars' },
        { label: t.footer.fleetLinks.luxury, href: '/cars' },
        { label: t.footer.fleetLinks.used, href: '/cars' },
      ],
    },
    {
      title: t.footer.services,
      links: [
        { label: t.footer.servicesLinks.import, href: '/cars' },
        { label: t.footer.servicesLinks.parts, href: '/products' },
        { label: t.footer.servicesLinks.consulting, href: '/contact' },
        { label: t.footer.servicesLinks.support, href: '/return-policy' },
      ],
    },
    {
      title: t.footer.company,
      links: [
        { label: t.footer.companyLinks.news, href: '/blog' },
        { label: t.footer.companyLinks.contact, href: '/contact' },
        { label: t.seo.termsTitle, href: '/terms' },
        { label: t.seo.privacyTitle, href: '/privacy-policy' },
      ],
    },
  ]

  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground font-bold">
                L
              </span>
              <span className="text-xl font-bold tracking-tight">{t.nav.brand}</span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground text-pretty">
              {t.footer.tagline}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {store.facebook ? <Social href={store.facebook} label="Facebook" /> : null}
              {store.instagram ? <Social href={store.instagram} label="Instagram" /> : null}
              {store.tiktok ? <Social href={store.tiktok} label="TikTok" /> : null}
              <a
                href={`https://wa.me/${wa}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
              >
                <MessageCircle className="size-4" aria-hidden />
                {t.common.whatsapp}
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="font-serif text-base font-bold">{col.title}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link, i) => (
                  <li key={`${link.href}-${i}`}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 grid gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:grid-cols-3">
          <a href={`tel:${store.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 hover:text-foreground">
            <Phone className="size-4 text-accent" aria-hidden />
            <span dir="ltr">{store.phone}</span>
          </a>
          <a href={`mailto:${store.email}`} className="flex items-center gap-2 hover:text-foreground">
            <Mail className="size-4 text-accent" aria-hidden />
            {store.email}
          </a>
          <span className="flex items-center gap-2">
            <MapPin className="size-4 text-accent" aria-hidden />
            {store.address}
          </span>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-border pt-6 text-center text-xs text-muted-foreground sm:flex-row sm:text-start">
          <p>
            © {new Date().getFullYear()} {t.nav.brand}. {t.footer.rights}
          </p>
          <p className="text-accent">{t.footer.slogan}</p>
        </div>
      </div>
    </footer>
  )
}

function Social({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid size-9 place-items-center rounded-full border border-border text-xs font-semibold text-muted-foreground transition-colors hover:border-accent hover:text-accent"
    >
      {label.slice(0, 2)}
    </a>
  )
}
