'use client'

import Link from '@/components/localized-link'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'
import { SectionHeading } from '@/components/section-heading'
import { ProductCard } from '@/components/product-card'
import { Reveal } from '@/components/reveal'
import type { Product } from '@/lib/wp/types'

export function HomeParts({ products }: { products: Product[] }) {
  const { t } = useLanguage()
  if (products.length === 0) return null

  return (
    <section className="site-container py-16 lg:py-20">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading eyebrow={t.products.eyebrow} title={t.products.title} titleEm={t.products.titleEm} />
        <Link
          href="/products"
          className="action-outline"
        >
          {t.nav.products}
          <ArrowRight className="size-4 flip-x" aria-hidden />
        </Link>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product, i) => (
          <Reveal key={product.slug} delay={i * 80}>
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
