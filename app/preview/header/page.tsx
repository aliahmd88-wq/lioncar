import type { Metadata } from 'next'
import { getProducts } from '@/lib/wp/products'
import { getImportCars, getSaleCars } from '@/lib/wp/vehicles'
import { getStoreSettings } from '@/lib/wp/store'
import { HeroEditorial } from '@/components/home/hero-editorial'
import { InventoryStrips } from '@/components/home/inventory-strips'
import { HomeStats } from '@/components/home/home-stats'
import { HomeFleet } from '@/components/home/home-fleet'
import { GlobalReach } from '@/components/home/global-reach'
import { HomeScenes } from '@/components/home/home-scenes'
import { HomeParts } from '@/components/home/home-parts'
import { HomeFaq } from '@/components/home/home-faq'
import { HomeCta } from '@/components/home/home-cta'

/**
 * Design preview of the proposed home page (Option A: the ALI FLEET skeleton
 * in Lion Car colours, with the store in the header). Unlinked and kept out
 * of search engines; the real home page is untouched until the owner
 * approves. `?videos=1` keeps a single video chapter.
 */
export const revalidate = 600
export const metadata: Metadata = { title: 'Home preview', robots: { index: false, follow: false } }

export default async function HomePreviewPage({ searchParams }: { searchParams: Promise<{ videos?: string }> }) {
  const { videos } = await searchParams
  const [products, importCars, saleCars, store] = await Promise.all([getProducts(), getImportCars(), getSaleCars(), getStoreSettings()])
  const vehicles = [...saleCars, ...importCars]
  const withPhotos = vehicles.filter((vehicle) => vehicle.image)
  const inStock = products.filter((product) => product.inStock && product.image)
  const count = videos === '1' ? 1 : 2

  return (
    <>
      <p className="bg-primary px-4 py-2 text-center text-xs font-bold text-primary-foreground" dir="ltr">
        Preview only · Option A · {count === 1 ? '1 video' : '2 videos'} (?videos=1 / ?videos=2)
      </p>
      <HeroEditorial vehicles={withPhotos} />
      <InventoryStrips products={inStock.slice(0, 12)} vehicles={withPhotos.slice(0, 12)} partsCount={products.length} vehiclesCount={vehicles.length} />
      <HomeStats partsCount={products.length} vehicleCount={vehicles.length} brandsCount={new Set(products.map((product) => product.brand).filter(Boolean)).size} />
      <HomeFleet vehicles={vehicles} />
      <GlobalReach />
      <HomeScenes count={count} />
      <HomeParts products={products.filter((product) => product.image).slice(0, 4)} />
      <HomeFaq />
      <HomeCta whatsapp={store.whatsapp} hours={store.hours} />
    </>
  )
}
