'use client'

import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'
import { ProductCard } from '@/components/product-card'
import { Reveal } from '@/components/reveal'
import { pick, type Product } from '@/lib/wp/types'
import { cn } from '@/lib/utils'

type SortKey = 'featured' | 'priceAsc' | 'priceDesc' | 'nameAsc'

function priceValue(price: string | null): number {
  if (!price) return Number.POSITIVE_INFINITY
  const n = Number(price.replace(/[^\d.]/g, ''))
  return Number.isFinite(n) ? n : Number.POSITIVE_INFINITY
}

export function ProductCatalog({ products }: { products: Product[] }) {
  const { t, locale } = useLanguage()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string>('all')
  const [sort, setSort] = useState<SortKey>('featured')
  const [showFilters, setShowFilters] = useState(false)

  // Only surface categories that actually exist in the data.
  const categoryKeys = useMemo(() => {
    const known = Object.keys(t.products.categories)
    const present = new Set<string>()
    for (const p of products) for (const c of p.categories) if (known.includes(c)) present.add(c)
    return known.filter((k) => present.has(k))
  }, [products, t.products.categories])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = products.filter((p) => {
      const inCat = category === 'all' || p.categories.includes(category)
      if (!inCat) return false
      if (!q) return true
      const haystack = [pick(p.name, locale), p.name.he, p.name.en, p.brand, p.sku, p.searchBlob]
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })

    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'priceAsc':
          return priceValue(a.price) - priceValue(b.price)
        case 'priceDesc':
          return priceValue(b.price) - priceValue(a.price)
        case 'nameAsc':
          return pick(a.name, locale).localeCompare(pick(b.name, locale))
        default:
          return Number(b.inStock) - Number(a.inStock)
      }
    })
    return list
  }, [products, query, category, sort, locale])

  const hasActiveFilters = query || category !== 'all'

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
      <div className="sticky top-16 z-30 -mx-4 mb-8 border-b border-border bg-background/90 px-4 py-4 backdrop-blur-md sm:top-20 sm:mx-0 sm:rounded-2xl sm:border sm:px-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.products.searchPlaceholder}
              className="w-full rounded-full border border-border bg-card py-2.5 ps-10 pe-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-accent"
              aria-label={t.common.search}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="sr-only" htmlFor="sort">
              {t.common.sortBy}
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-full border border-border bg-card px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
            >
              <option value="featured">{t.common.featured}</option>
              <option value="priceAsc">{t.common.priceAsc}</option>
              <option value="priceDesc">{t.common.priceDesc}</option>
              <option value="nameAsc">{t.common.nameAsc}</option>
            </select>
            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium lg:hidden"
              aria-expanded={showFilters}
            >
              <SlidersHorizontal className="size-4" aria-hidden />
              {t.products.categoriesLabel}
            </button>
          </div>
        </div>

        <div className={cn('mt-3 flex-wrap gap-2', showFilters ? 'flex' : 'hidden lg:flex')}>
          <CategoryChip active={category === 'all'} onClick={() => setCategory('all')}>
            {t.common.all}
          </CategoryChip>
          {categoryKeys.map((key) => (
            <CategoryChip key={key} active={category === key} onClick={() => setCategory(key)}>
              {(t.products.categories as Record<string, string>)[key]}
            </CategoryChip>
          ))}
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{filtered.length}</span> {t.common.resultsCount}
        </p>
        {hasActiveFilters ? (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setCategory('all')
            }}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
          >
            <X className="size-4" aria-hidden />
            {t.common.clearFilters}
          </button>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border py-20 text-center">
          <p className="text-lg font-semibold">{t.common.noResults}</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product, i) => (
            <Reveal key={product.slug} delay={Math.min(i, 8) * 60}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  )
}

function CategoryChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-card text-muted-foreground hover:border-accent hover:text-accent',
      )}
    >
      {children}
    </button>
  )
}
