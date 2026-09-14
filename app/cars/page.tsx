import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { getImportCars, getSaleCars } from '@/lib/wp/vehicles'
import { VehiclesView } from '@/components/cars/vehicles-view'
import { getDictionary } from '@/lib/i18n'
import { defaultLocale, isLocale, LOCALE_COOKIE } from '@/lib/i18n/config'

export const revalidate = 600

export async function generateMetadata(): Promise<Metadata> {
  const store = await cookies()
  const value = store.get(LOCALE_COOKIE)?.value
  const t = getDictionary(isLocale(value) ? value : defaultLocale)
  return { title: t.nav.cars, description: t.cars.lead }
}

export default async function CarsPage() {
  const [importCars, saleCars] = await Promise.all([getImportCars(), getSaleCars()])
  return <VehiclesView importCars={importCars} saleCars={saleCars} />
}
