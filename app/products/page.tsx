import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { getProducts } from '@/lib/wp/products'
import { ProductsView } from '@/components/products/products-view'
import { getDictionary } from '@/lib/i18n'
import { defaultLocale, isLocale, LOCALE_COOKIE } from '@/lib/i18n/config'

export const revalidate = 600

export async function generateMetadata(): Promise<Metadata> {
  const store = await cookies()
  const value = store.get(LOCALE_COOKIE)?.value
  const t = getDictionary(isLocale(value) ? value : defaultLocale)
  return { title: t.nav.products, description: t.products.lead }
}

export default async function ProductsPage() {
  const products = await getProducts()
  return <ProductsView products={products} />
}
