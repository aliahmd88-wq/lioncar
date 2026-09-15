'use client'

import { useLanguage } from '@/lib/i18n/context'
import { HeroStrip, type StripItem } from '@/components/home/hero-strip'
import { pick, type Product, type Vehicle } from '@/lib/wp/types'

/** Two live rows right under the hero: parts in stock, vehicles in stock. */
export function InventoryStrips({ products, vehicles, partsCount, vehiclesCount }: { products: Product[]; vehicles: Vehicle[]; partsCount: number; vehiclesCount: number }) {
  const { t, locale } = useLanguage()
  const s = t.home.heroStore

  const partItems: StripItem[] = products.map((product) => ({
    key: product.slug,
    href: `/products/${product.slug}`,
    image: product.image,
    title: pick(product.name, locale),
    subtitle: product.brand || product.sku,
    price: product.price,
  }))
  const carItems: StripItem[] = vehicles.map((vehicle) => ({
    key: `${vehicle.kind}-${vehicle.slug}`,
    href: `/cars/${vehicle.kind}/${vehicle.slug}`,
    image: vehicle.image,
    title: vehicle.model,
    subtitle: [vehicle.year, pick(vehicle.subtitle, locale)].filter(Boolean).join(' · '),
    price: vehicle.price,
    tag: vehicle.kind === 'sale' ? s.usedTag : s.newTag,
  }))

  return (
    <div className="border-b border-border bg-background pb-2">
      <HeroStrip tone="light" label={s.partsInStock} count={partsCount} href="/products" viewAllLabel={s.viewAll} items={partItems} />
      <HeroStrip tone="light" label={s.carsInStock} count={vehiclesCount} href="/cars" viewAllLabel={s.viewAll} items={carItems} reverse wide />
    </div>
  )
}
