import type { Metadata, Viewport } from 'next'
import { Cairo, Noto_Sans_Hebrew } from 'next/font/google'
import { Providers } from '@/components/providers'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { getStoreSettings } from '@/lib/wp/store'
import { dirFor, locales, localeHref } from '@/lib/i18n/config'
import { readLocale, readPath } from '@/lib/i18n/server'
import { getDictionary } from '@/lib/i18n'
import { serializeJsonLd } from '@/lib/json-ld'
import { siteUrl } from '@/lib/seo'
import './globals.css'

const cairo = Cairo({ subsets: ['arabic', 'latin'], variable: '--font-cairo', display: 'swap' })
const notoHebrew = Noto_Sans_Hebrew({ subsets: ['hebrew', 'latin'], variable: '--font-noto-hebrew', display: 'swap' })

export async function generateMetadata(): Promise<Metadata> {
  const [locale, path] = await Promise.all([readLocale(), readPath()])
  const t = getDictionary(locale)
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://lioncar.co.il'),
    title: { default: t.seo.siteTitle, template: `%s | ${t.seo.orgName}` },
    description: t.seo.siteDescription,
    icons: { icon: '/brand/lion-mark.png', apple: '/brand/lion-mark.png' },
    openGraph: {
      title: t.seo.siteTitle,
      description: t.seo.siteDescription,
      type: 'website',
      locale: { he: 'he_IL', ar: 'ar_IL', en: 'en_IL' }[locale],
      siteName: t.seo.orgName,
      url: localeHref(path, locale),
      images: [{ url: '/images/truck-fleet-hero.png', width: 1024, height: 1024, alt: t.nav.brand }],
    },
    alternates: {
      canonical: localeHref(path, locale),
      languages: {
        ...Object.fromEntries(locales.map((value) => [value, localeHref(path, value)])),
        'x-default': localeHref(path, 'he'),
      },
    },
  }
}

export const viewport: Viewport = { themeColor: '#ffffff', colorScheme: 'light', width: 'device-width', initialScale: 1 }

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [locale, store] = await Promise.all([readLocale(), getStoreSettings()])
  const t = getDictionary(locale)
  // Organisation structured data: contact details come from WordPress store
  // settings, so a phone or address change reaches Google without a redeploy.
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'AutoPartsStore',
    name: t.seo.orgName,
    alternateName: t.seo.orgAlternateName,
    inLanguage: locale,
    description: t.seo.siteDescription,
    url: `${siteUrl()}/${locale}`,
    image: `${siteUrl()}/images/truck-fleet-hero.png`,
    logo: `${siteUrl()}/brand/lion-mark.png`,
    telephone: store.phone || undefined,
    email: store.email || undefined,
    openingHours: store.hours || undefined,
    address: store.addressLines.length
      ? {
          '@type': 'PostalAddress',
          streetAddress: store.addressLines[0],
          addressLocality: store.addressLines[1] ?? 'Reineh',
          addressCountry: 'IL',
        }
      : undefined,
    sameAs: [store.instagram, store.facebook, store.tiktok].filter(Boolean),
    areaServed: { '@type': 'Country', name: t.seo.areaServed },
    knowsLanguage: ['he', 'ar', 'en'],
    priceRange: '₪₪',
    contactPoint: store.whatsapp
      ? [
          {
            '@type': 'ContactPoint',
            contactType: 'sales',
            telephone: `+${store.whatsapp.replace(/[^\d]/g, '')}`,
            url: `https://wa.me/${store.whatsapp.replace(/[^\d]/g, '')}`,
            availableLanguage: ['he', 'ar', 'en'],
          },
        ]
      : undefined,
  }
  return (
    <html lang={locale} dir={dirFor(locale)} className={`${cairo.variable} ${notoHebrew.variable} bg-background`}>
      <body className="font-sans antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(organization) }} />
        <Providers initialLocale={locale}>
          <SiteHeader store={store} />
          <main id="main-content" className="min-h-screen" tabIndex={-1}>{children}</main>
          <SiteFooter store={store} />
          <WhatsAppButton whatsapp={store.whatsapp} />
        </Providers>
      </body>
    </html>
  )
}
