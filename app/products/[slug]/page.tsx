import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProduct, getProducts } from '@/lib/wp/products'
import { getStoreSettings } from '@/lib/wp/store'
import { ProductDetail } from '@/components/products/product-detail'
import { getDictionary } from '@/lib/i18n'
import { readLocale } from '@/lib/i18n/server'
import { pick } from '@/lib/wp/types'

export const revalidate = 600

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const locale = await readLocale()
  const product = await getProduct(slug)
  if (!product) return { title: getDictionary(locale).productDetail.notFound }
  return {
    title: pick(product.name, locale),
    description: pick(product.description, locale).slice(0, 160) || undefined,
    openGraph: product.image ? { images: [product.image] } : undefined,
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()

  const [all, store] = await Promise.all([getProducts(), getStoreSettings()])
  const related = all
    .filter((p) => p.slug !== product.slug && p.categories.some((c) => product.categories.includes(c)))
    .slice(0, 4)
  const fallback = related.length > 0 ? related : all.filter((p) => p.slug !== product.slug).slice(0, 4)

  return <ProductDetail product={product} related={fallback} whatsapp={store.whatsapp} />
}
