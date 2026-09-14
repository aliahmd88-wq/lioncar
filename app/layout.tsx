import { Analytics } from '@vercel/analytics/next'
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
import './globals.css'

const cairo = Cairo({ subsets: ['arabic', 'latin'], variable: '--font-cairo', display: 'swap' })
const notoHebrew = Noto_Sans_Hebrew({ subsets: ['hebrew', 'latin'], variable: '--font-noto-hebrew', display: 'swap' })

export async function generateMetadata(): Promise<Metadata> {
  const [locale, path] = await Promise.all([readLocale(), readPath()])
  const t = getDictionary(locale)
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://leoncar.co.il'),
    title: { default: t.seo.siteTitle, template: `%s | ${t.seo.orgName}` },
    description: t.seo.siteDescription,
    generator: 'v0.app',
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
      languages: Object.fromEntries(locales.map((value) => [value, localeHref(path, value)])),
    },
  }
}

export const viewport: Viewport = { themeColor: '#ffffff', colorScheme: 'light', width: 'device-width', initialScale: 1 }

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [locale, store] = await Promise.all([readLocale(), getStoreSettings()])
  return (
    <html lang={locale} dir={dirFor(locale)} className={`${cairo.variable} ${notoHebrew.variable} bg-background`}>
      <body className="font-sans antialiased">
        <Providers initialLocale={locale}>
          <SiteHeader store={store} />
          <main id="main-content" className="min-h-screen" tabIndex={-1}>{children}</main>
          <SiteFooter store={store} />
          <WhatsAppButton whatsapp={store.whatsapp} />
        </Providers>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
