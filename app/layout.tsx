import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Cairo, Noto_Sans_Hebrew, Frank_Ruhl_Libre } from 'next/font/google'
import { cookies } from 'next/headers'
import { Providers } from '@/components/providers'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { getStoreSettings } from '@/lib/wp/store'
import { defaultLocale, dirFor, isLocale, LOCALE_COOKIE, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n'
import './globals.css'

const cairo = Cairo({ subsets: ['arabic', 'latin'], variable: '--font-cairo', display: 'swap' })
const notoHebrew = Noto_Sans_Hebrew({ subsets: ['hebrew', 'latin'], variable: '--font-noto-hebrew', display: 'swap' })
const frank = Frank_Ruhl_Libre({ subsets: ['hebrew', 'latin'], variable: '--font-frank', display: 'swap', weight: ['500', '700', '900'] })

export async function generateMetadata(): Promise<Metadata> {
  const locale = await readLocale()
  const t = getDictionary(locale)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://leoncar.co.il'
  return {
    metadataBase: new URL(siteUrl),
    title: { default: t.seo.siteTitle, template: `%s | ${t.seo.orgName}` },
    description: t.seo.siteDescription,
    generator: 'v0.app',
    openGraph: {
      title: t.seo.siteTitle,
      description: t.seo.siteDescription,
      type: 'website',
      locale,
      siteName: t.seo.orgName,
    },
    alternates: { canonical: '/' },
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8f7f3' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1c22' },
  ],
}

async function readLocale(): Promise<Locale> {
  const store = await cookies()
  const value = store.get(LOCALE_COOKIE)?.value
  return isLocale(value) ? value : defaultLocale
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await readLocale()
  const store = await getStoreSettings()

  return (
    <html
      lang={locale}
      dir={dirFor(locale)}
      className={`${cairo.variable} ${notoHebrew.variable} ${frank.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <Providers initialLocale={locale}>
          <SiteHeader store={store} />
          <main className="min-h-screen">{children}</main>
          <SiteFooter store={store} />
          <WhatsAppButton whatsapp={store.whatsapp} />
        </Providers>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
