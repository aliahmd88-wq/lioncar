import type { Metadata } from 'next'
import { getStoreSettings } from '@/lib/wp/store'
import { CartView } from '@/components/cart/cart-view'
import { getDictionary } from '@/lib/i18n'
import { readLocale } from '@/lib/i18n/server'

export const revalidate = 600

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await readLocale())
  return { title: t.seo.cartTitle, description: t.seo.cartDescription }
}

export default async function CartPage() {
  const store = await getStoreSettings()
  return <CartView whatsapp={store.whatsapp} />
}
