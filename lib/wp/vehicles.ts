import { wpQuery } from './client'
import { asArray, cleanPrice, first, localized, toNumber } from './format'
import type { Vehicle, VehicleKind } from './types'

const GALLERY_FIELDS = Array.from({ length: 8 }, (_, i) => {
  const n = i + 1
  return `galleryImage${n} { image { node { sourceUrl } } altTextHe altTextAr altTextEn }`
}).join('\n')

const HIGHLIGHT_FIELDS = Array.from({ length: 8 }, (_, i) => `highlight${i + 1} { itemHe itemAr itemEn }`).join('\n')

const commonAcf = `
  carModel carSubtitleHe carSubtitleAr carSubtitleEn
  bodyType status year mileage price featured vehicleUses
  descriptionHe descriptionAr descriptionEn
  specs { engine transmission fuel drivetrain colorHe colorAr colorEn seats }
  ${HIGHLIGHT_FIELDS}
  ${GALLERY_FIELDS}
`

// Only the import (to-order) group carries the sourcing origin, the four-step stage and the ETA.
const importOnlyAcf = `origin stage etaHe etaAr etaEn`

function normalize(raw: any, kind: VehicleKind, acfKey: string): Vehicle {
  const acf = (raw?.[acfKey] ?? {}) as Record<string, any>
  const uses = asArray(acf.vehicleUses)
  const bodyType = first(acf.bodyType)

  // Derive taxi / parallel eligibility per the brief.
  let isTaxi = uses.includes('taxi')
  let isParallel = uses.includes('parallel_import')
  if (uses.length === 0) {
    if (bodyType === 'minivan') isTaxi = true
    if (bodyType === 'suv' || bodyType === 'luxury_mpv') {
      isTaxi = true
      isParallel = true
    }
  }

  const highlights = []
  for (let i = 1; i <= 8; i++) {
    const h = acf[`highlight${i}`]
    if (h && (h.itemHe || h.itemAr || h.itemEn)) {
      highlights.push(localized(h.itemHe, h.itemAr, h.itemEn))
    }
  }

  const gallery: string[] = []
  for (let i = 1; i <= 8; i++) {
    const g = acf[`galleryImage${i}`]
    const url = g?.image?.node?.sourceUrl
    if (url) gallery.push(url)
  }

  const specs = (acf.specs ?? {}) as Record<string, any>
  const featured = raw?.featuredImage?.node?.sourceUrl || acf?.featuredImage?.node?.sourceUrl || null

  return {
    kind,
    slug: raw.slug,
    model: acf.carModel ? String(acf.carModel) : raw.title,
    subtitle: localized(acf.carSubtitleHe || raw.title, acf.carSubtitleAr || raw.title, acf.carSubtitleEn || raw.title),
    bodyType,
    bodyTypes: asArray(acf.bodyType),
    origin: first(acf.origin),
    status: first(acf.status) || 'available',
    stage: toNumber(acf.stage),
    year: toNumber(acf.year),
    mileage: toNumber(acf.mileage),
    price: cleanPrice(acf.price != null ? String(acf.price) : null),
    featured: !!acf.featured,
    uses,
    isTaxi,
    isParallel,
    description: localized(acf.descriptionHe, acf.descriptionAr, acf.descriptionEn),
    highlights,
    specs: {
      engine: specs.engine ? String(specs.engine) : null,
      transmission: first(specs.transmission) || null,
      fuel: first(specs.fuel) || null,
      drivetrain: first(specs.drivetrain) || null,
      color: localized(specs.colorHe, specs.colorAr, specs.colorEn),
      seats: toNumber(specs.seats),
    },
    eta: localized(acf.etaHe, acf.etaAr, acf.etaEn),
    image: featured,
    imageAlt: raw.title,
    gallery,
    condition: kind === 'sale' ? (acf.condition ? first(acf.condition) || String(acf.condition) : null) : null,
    previousOwners: kind === 'sale' ? toNumber(acf.previousOwners) : null,
  }
}

export async function getImportCars(): Promise<Vehicle[]> {
  const query = `
    query ImportCars {
      importCars(first: 100, where: { status: PUBLISH }) {
        nodes {
          databaseId slug title
          featuredImage { node { sourceUrl altText } }
          importCarFields { ${commonAcf} ${importOnlyAcf} featuredImage { node { sourceUrl } } }
        }
      }
    }
  `
  const data: any = await wpQuery(query)
  const nodes = data?.importCars?.nodes ?? []
  return nodes.map((n: any) => normalize(n, 'import', 'importCarFields'))
}

export async function getImportCar(slug: string): Promise<Vehicle | null> {
  const query = `
    query ImportCar($slug: ID!) {
      importCar(id: $slug, idType: SLUG) {
        databaseId slug title
        featuredImage { node { sourceUrl altText } }
        importCarFields { ${commonAcf} ${importOnlyAcf} featuredImage { node { sourceUrl } } }
      }
    }
  `
  const data: any = await wpQuery(query, { slug })
  if (!data?.importCar) return null
  return normalize(data.importCar, 'import', 'importCarFields')
}

export async function getSaleCars(): Promise<Vehicle[]> {
  const query = `
    query SaleCars {
      saleCars(first: 100, where: { status: PUBLISH }) {
        nodes {
          databaseId slug title
          featuredImage { node { sourceUrl altText } }
          saleCarFields { ${commonAcf} condition previousOwners featuredImage { node { sourceUrl } } }
        }
      }
    }
  `
  const data: any = await wpQuery(query)
  const nodes = data?.saleCars?.nodes ?? []
  return nodes.map((n: any) => normalize(n, 'sale', 'saleCarFields'))
}

export async function getSaleCar(slug: string): Promise<Vehicle | null> {
  const query = `
    query SaleCar($slug: ID!) {
      saleCar(id: $slug, idType: SLUG) {
        databaseId slug title
        featuredImage { node { sourceUrl altText } }
        saleCarFields { ${commonAcf} condition previousOwners featuredImage { node { sourceUrl } } }
      }
    }
  `
  const data: any = await wpQuery(query, { slug })
  if (!data?.saleCar) return null
  return normalize(data.saleCar, 'sale', 'saleCarFields')
}

export { matchesNewCategory, matchesUsedCategory } from './vehicles.shared'
