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

export const revalidate = 600

/**
 * Home page: the ALI FLEET skeleton in Lion Car colours, with the store in
 * the header. Everything below the fold reads live from WordPress, so a new
 * product or vehicle shows up here on the next revalidation.
 */
export default async function HomePage() {
  const [products, importCars, saleCars, store] = await Promise.all([getProducts(), getImportCars(), getSaleCars(), getStoreSettings()])
  const vehicles = [...saleCars, ...importCars]
  const withPhotos = vehicles.filter((vehicle) => vehicle.image)
  const inStock = products.filter((product) => product.inStock && product.image)
  const brandsCount = new Set(products.map((product) => product.brand).filter(Boolean)).size

  return (
    <>
      <HeroEditorial vehicles={withPhotos} />
      <InventoryStrips products={inStock.slice(0, 12)} vehicles={withPhotos.slice(0, 12)} partsCount={products.length} vehiclesCount={vehicles.length} />
      <HomeStats partsCount={products.length} vehicleCount={vehicles.length} brandsCount={brandsCount} />
      <HomeFleet vehicles={vehicles} />
      <GlobalReach />
      <HomeScenes count={2} />
      <HomeParts products={products.filter((product) => product.image).slice(0, 4)} />
      <HomeFaq />
      <HomeCta whatsapp={store.whatsapp} hours={store.hours} />
    </>
  )
}
