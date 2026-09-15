import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getProducts } from '@/lib/wp/products'
import { ProductsView } from '@/components/products/products-view'
import { getDictionary } from '@/lib/i18n'
import { readLocale } from '@/lib/i18n/server'

export const revalidate = 600

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await readLocale())
  return { title: t.nav.products, description: t.products.lead }
}

export default async function ProductsPage() {
  const products = await getProducts()
  return (
    <Suspense>
      <ProductsView products={products} />
    </Suspense>
  )
}
