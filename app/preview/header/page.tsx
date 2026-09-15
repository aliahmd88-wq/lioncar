import type { Metadata } from 'next'
import { getProducts } from '@/lib/wp/products'
import { getImportCars, getSaleCars } from '@/lib/wp/vehicles'
import { HomeHeroStore } from '@/components/home/home-hero-store'

/**
 * Design preview of the proposed home header. Not linked from anywhere and
 * kept out of search engines; the real home page is untouched until the
 * owner approves. `?videos=1` shows the single-video variant.
 */
export const revalidate = 600
export const metadata: Metadata = { title: 'Header preview', robots: { index: false, follow: false } }

export default async function HeaderPreviewPage({ searchParams }: { searchParams: Promise<{ videos?: string }> }) {
  const { videos } = await searchParams
  const [products, importCars, saleCars] = await Promise.all([getProducts(), getImportCars(), getSaleCars()])
  const inStock = products.filter((product) => product.inStock && product.image)
  const withPhotos = [...saleCars, ...importCars].filter((vehicle) => vehicle.image)
  const count = videos === '1' ? 1 : 2

  return (
    <>
      <p className="bg-primary px-4 py-2 text-center text-xs font-bold text-primary-foreground" dir="ltr">
        Preview only · {count === 1 ? '1 video' : '2 videos'} · switch with ?videos=1 or ?videos=2
      </p>
      <HomeHeroStore
        products={inStock.slice(0, 12)}
        vehicles={withPhotos.slice(0, 12)}
        partsCount={products.length}
        vehiclesCount={importCars.length + saleCars.length}
        videos={count}
      />
    </>
  )
}
