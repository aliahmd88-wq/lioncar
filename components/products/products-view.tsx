'use client'

import { PackageX } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'
import { PageHeader } from '@/components/page-header'
import { ProductCatalog } from '@/components/products/product-catalog'
import type { Product } from '@/lib/wp/types'

export function ProductsView({ products }: { products: Product[] }) {
  const { t } = useLanguage()

  return (
    <>
      <PageHeader eyebrow={t.products.eyebrow} title={t.products.title} titleEm={t.products.titleEm} lead={t.products.lead}>
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-muted-foreground">
          <li>· {t.products.trustWarranty}</li>
          <li>· {t.products.trustShipping}</li>
          <li>· {t.products.trustFitment}</li>
        </ul>
      </PageHeader>

      {products.length === 0 ? (
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <PackageX className="mx-auto size-12 text-muted-foreground" aria-hidden />
          <h2 className="mt-4 font-serif text-2xl font-bold">{t.products.catalogEmpty}</h2>
          <p className="mt-2 text-muted-foreground">{t.products.catalogEmptyLead}</p>
        </div>
      ) : (
        <div className="pt-8">
          <ProductCatalog products={products} />
        </div>
      )}
    </>
  )
}
