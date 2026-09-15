import { wpQuery } from './client'
import { asArray, cleanPrice, estimateReadMinutes, first, localized, stripHtml } from './format'
import type { Product, Spec } from './types'

const SPEC_FIELDS = Array.from({ length: 8 }, (_, i) => {
  const n = i + 1
  return `spec${n} { labelHe labelAr labelEn valueHe valueAr valueEn }`
}).join('\n')

const COMPAT_FIELDS = Array.from({ length: 10 }, (_, i) => `compatModel${i + 1} { modelName }`).join('\n')

const PRODUCT_FRAGMENT = `
  databaseId
  slug
  name
  description
  shortDescription
  ... on SimpleProduct { price stockStatus }
  image { sourceUrl altText }
  galleryImages { nodes { sourceUrl altText } }
  productCategories { nodes { name slug } }
  sparePartFields {
    nameHe nameAr nameEn
    descriptionHe descriptionAr descriptionEn
    partCategory brand sku searchTerms oeNumber
    ${SPEC_FIELDS}
    ${COMPAT_FIELDS}
  }
`

type RawProduct = {
  databaseId: number
  slug: string
  name: string
  description?: string | null
  shortDescription?: string | null
  price?: string | null
  stockStatus?: string | null
  image?: { sourceUrl?: string; altText?: string } | null
  galleryImages?: { nodes?: { sourceUrl?: string; altText?: string }[] } | null
  productCategories?: { nodes?: { name: string; slug: string }[] } | null
  sparePartFields?: Record<string, unknown> | null
}

function normalize(raw: RawProduct): Product {
  const acf = (raw.sparePartFields ?? {}) as Record<string, any>

  const specs: Spec[] = []
  for (let i = 1; i <= 8; i++) {
    const s = acf[`spec${i}`]
    if (!s) continue
    const label = localized(s.labelHe, s.labelAr, s.labelEn)
    const value = localized(s.valueHe, s.valueAr, s.valueEn)
    if (label.he || label.en || label.ar || value.he || value.en || value.ar) {
      specs.push({ label, value })
    }
  }

  const compat: string[] = []
  for (let i = 1; i <= 10; i++) {
    const c = acf[`compatModel${i}`]
    if (c?.modelName) compat.push(String(c.modelName))
  }

  const heName = raw.name || acf.nameHe || ''
  const heDesc = raw.description || acf.descriptionHe || ''

  return {
    slug: raw.slug,
    wooId: raw.databaseId,
    sku: acf.sku ? String(acf.sku) : String(acf.oeNumber ?? ''),
    brand: acf.brand ? String(acf.brand) : '',
    categories: asArray(acf.partCategory).concat(
      (raw.productCategories?.nodes ?? []).map((n) => n.slug),
    ),
    price: cleanPrice(raw.price),
    inStock: (raw.stockStatus ?? 'IN_STOCK') === 'IN_STOCK',
    name: localized(heName, acf.nameAr || heName, acf.nameEn || heName),
    description: localized(heDesc, acf.descriptionAr || '', acf.descriptionEn || ''),
    image: raw.image?.sourceUrl ?? null,
    imageAlt: raw.image?.altText || heName,
    gallery: (raw.galleryImages?.nodes ?? [])
      .map((n) => n.sourceUrl)
      .filter((u): u is string => !!u),
    specs,
    compat,
    searchBlob: [acf.searchTerms, acf.oeNumber, acf.brand, raw.name, acf.nameEn, acf.nameAr]
      .filter(Boolean)
      .join(' ')
      .toLowerCase(),
  }
}

export async function getProducts(): Promise<Product[]> {
  const query = `
    query Products($after: String) {
      products(first: 100, after: $after, where: { status: "publish" }) {
        pageInfo { hasNextPage endCursor }
        nodes { ${PRODUCT_FRAGMENT} }
      }
    }
  `
  const all: RawProduct[] = []
  let after: string | null = null
  for (let page = 0; page < 10; page++) {
    const data: any = await wpQuery(query, { after })
    const conn = data?.products
    if (!conn) break
    all.push(...(conn.nodes ?? []))
    if (!conn.pageInfo?.hasNextPage) break
    after = conn.pageInfo.endCursor
  }
  return all.map(normalize)
}

export async function getProduct(slug: string): Promise<Product | null> {
  const query = `
    query Product($slug: ID!) {
      product(id: $slug, idType: SLUG) { ${PRODUCT_FRAGMENT} }
    }
  `
  const data: any = await wpQuery(query, { slug })
  if (!data?.product) return null
  return normalize(data.product)
}

export { estimateReadMinutes, stripHtml, first }
