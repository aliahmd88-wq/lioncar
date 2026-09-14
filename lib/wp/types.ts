import type { Locale } from '@/lib/i18n/config'

export type Localized = { he: string; ar: string; en: string }

export function pick(value: Localized, locale: Locale): string {
  return value[locale] || value.he || value.en || value.ar || ''
}

export type Spec = { label: Localized; value: Localized }

export type Product = {
  slug: string
  sku: string
  brand: string
  categories: string[]
  price: string | null
  inStock: boolean
  name: Localized
  description: Localized
  image: string | null
  imageAlt: string
  gallery: string[]
  specs: Spec[]
  compat: string[]
  /** Hidden search haystack: OE numbers and search terms. Never rendered. */
  searchBlob: string
}

export type VehicleKind = 'import' | 'sale'

export type Vehicle = {
  kind: VehicleKind
  slug: string
  model: string
  subtitle: Localized
  bodyType: string
  bodyTypes: string[]
  origin: string
  status: string
  stage: number | null
  year: number | null
  mileage: number | null
  price: string | null
  featured: boolean
  uses: string[]
  isTaxi: boolean
  isParallel: boolean
  description: Localized
  highlights: Localized[]
  specs: {
    engine: string | null
    transmission: string | null
    fuel: string | null
    drivetrain: string | null
    color: Localized
    seats: number | null
  }
  eta: Localized
  image: string | null
  imageAlt: string
  gallery: string[]
  condition: string | null
  previousOwners: number | null
}

export type StoreSettings = {
  phone: string
  whatsapp: string
  email: string
  hours: string
  address: string
  facebook: string | null
  instagram: string | null
  tiktok: string | null
}

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  date: string
  image: string | null
  category: string | null
  readMinutes: number
  content?: string
}

export type PolicyPage = {
  title: string
  content: string
  modified: string
}
