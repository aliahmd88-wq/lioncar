import { getImportCars, getSaleCars } from '@/lib/wp/vehicles'
import { getProducts } from '@/lib/wp/products'
import { getStoreSettings } from '@/lib/wp/store'
import { HomeHero } from '@/components/home/home-hero'
import { HomeStats } from '@/components/home/home-stats'
import { HomeFleet } from '@/components/home/home-fleet'
import { HomeServices } from '@/components/home/home-services'
import { HomeParts } from '@/components/home/home-parts'
import { HomeCta } from '@/components/home/home-cta'

export const revalidate = 600

export default async function HomePage() {
  const [importCars, saleCars, products, store] = await Promise.all([
    getImportCars(),
    getSaleCars(),
    getProducts(),
    getStoreSettings(),
  ])

  const vehicles = [...importCars, ...saleCars]
  const heroSlides = vehicles
    .filter((v) => v.image)
    .slice(0, 5)
    .map((v) => ({ image: v.image as string, model: v.model, kind: v.kind, slug: v.slug }))

  const featuredProducts = products.filter((p) => p.image).slice(0, 4)

  return (
    <>
      <HomeHero slides={heroSlides} />
      <HomeStats partsCount={products.length} />
      <HomeFleet />
      <HomeServices />
      <HomeParts products={featuredProducts} />
      <HomeCta whatsapp={store.whatsapp} hours={store.hours} />
    </>
  )
}
