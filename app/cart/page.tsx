import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { getStoreSettings } from '@/lib/wp/store'
import { CartView } from '@/components/cart/cart-view'
import { getDictionary } from '@/lib/i18n'
import { defaultLocale, isLocale, LOCALE_COOKIE } from '@/lib/i18n/config'

export const revalidate = 600

export async function generateMetadata(): Promise<Metadata> {
  const store = await cookies()
  const value = store.get(LOCALE_COOKIE)?.value
  const t = getDictionary(isLocale(value) ? value : defaultLocale)
  return { title: t.seo.cartTitle, description: t.seo.cartDescription }
}

export default async function CartPage() {
  const store = await getStoreSettings()
  return <CartView whatsapp={store.whatsapp} />
}
