import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import { getImportCar } from '@/lib/wp/vehicles'
import { VehicleDetail } from '@/components/cars/vehicle-detail'
import { defaultLocale, isLocale, LOCALE_COOKIE } from '@/lib/i18n/config'
import { pick } from '@/lib/wp/types'

export const revalidate = 600

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const store = await cookies()
  const value = store.get(LOCALE_COOKIE)?.value
  const locale = isLocale(value) ? value : defaultLocale
  const car = await getImportCar(slug)
  if (!car) return {}
  return {
    title: car.model,
    description: pick(car.subtitle, locale) || undefined,
    openGraph: car.image ? { images: [car.image] } : undefined,
  }
}

export default async function ImportCarPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const car = await getImportCar(slug)
  if (!car) notFound()
  return <VehicleDetail vehicle={car} />
}
