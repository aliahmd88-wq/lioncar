import type { Metadata } from 'next'
import { getImportCars, getSaleCars } from '@/lib/wp/vehicles'
import { VehiclesView } from '@/components/cars/vehicles-view'
import { getDictionary } from '@/lib/i18n'
import { readLocale } from '@/lib/i18n/server'

export const revalidate = 600

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await readLocale())
  return { title: t.nav.cars, description: t.cars.lead }
}

export default async function CarsPage() {
  const [importCars, saleCars] = await Promise.all([getImportCars(), getSaleCars()])
  return <VehiclesView importCars={importCars} saleCars={saleCars} />
}
