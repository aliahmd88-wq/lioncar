'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, X } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'
import { ProductCard } from '@/components/product-card'
import { Reveal } from '@/components/reveal'
import { pick, type Product } from '@/lib/wp/types'
import { matchesQuery } from '@/lib/search/match'
import { cn } from '@/lib/utils'

type SortKey = 'featured' | 'priceAsc' | 'priceDesc' | 'nameAsc'

/** 6 rows × 4 columns on desktop; keeps 163+ parts from rendering as one wall. */
const PAGE_SIZE = 24

/** The truck makes the shop is known for, in the order they are shown; any other brand follows alphabetically. */
const KNOWN_BRANDS = ['DAF', 'MAN', 'Volvo', 'Scania', 'Mercedes', 'Iveco']

function priceValue(price: string | null): number {
  if (!price) return Number.POSITIVE_INFINITY
  const n = Number(price.replace(/[^\d.]/g, ''))
  return Number.isFinite(n) ? n : Number.POSITIVE_INFINITY
}

function brandKey(value: string) {
  return value.trim().toLowerCase()
}

export function ProductCatalog({ products }: { products: Product[] }) {
  const { t, locale } = useLanguage()
  // The home header's search box and brand chips land here with ?q= / ?brand=.
  const params = useSearchParams()
  const [query, setQuery] = useState(params.get('q') ?? '')
  const [category, setCategory] = useState<string>('all')
  const [brand, setBrand] = useState<string>(brandKey(params.get('brand') ?? '') || 'all')
  const [sort, setSort] = useState<SortKey>('featured')
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)

  // Only surface categories that actually exist in the data.
  const categoryKeys = useMemo(() => {
    const known = Object.keys(t.products.categories)
    const present = new Set<string>()
    for (const p of products) for (const c of p.categories) if (known.includes(c)) present.add(c)
    return known.filter((k) => present.has(k))
  }, [products, t.products.categories])

  // Brand chips come from the catalogue itself, so a new make added in
  // WordPress appears here without a code change.
  const brands = useMemo(() => {
    const labels = new Map<string, string>()
    for (const p of products) if (p.brand) labels.set(brandKey(p.brand), p.brand.trim())
    const known = KNOWN_BRANDS.map(brandKey).filter((k) => labels.has(k))
    const others = Array.from(labels.keys())
      .filter((k) => !known.includes(k))
      .sort((a, b) => a.localeCompare(b))
    return [...known, ...others].map((k) => ({ key: k, label: labels.get(k) as string }))
  }, [products])

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (category !== 'all' && !p.categories.includes(category)) return false
      if (brand !== 'all' && brandKey(p.brand) !== brand) return false
      // Prefix + synonym matching in all three languages; the OE number is
      // compared by hash only, so it never appears in the page.
      return matchesQuery(p.searchText, query, p.searchHashes)
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
  }, [products, query, category, brand, sort, locale])

  // Any change to the filters starts again from the first page.
  useEffect(() => {
    setPage(1)
  }, [query, category, brand, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const goToPage = (next: number) => {
    setPage(Math.min(totalPages, Math.max(1, next)))
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const hasActiveFilters = query || category !== 'all' || brand !== 'all'

  return (
    <div id="catalog" className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-24 sm:px-6 lg:px-8">
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

        <div className={cn('mt-3 flex-col gap-3', showFilters ? 'flex' : 'hidden lg:flex')}>
          {brands.length > 1 ? (
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t.productsFilters.brandsLabel}>
              <span className="me-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t.productsFilters.brandsLabel}</span>
              <FilterChip active={brand === 'all'} onClick={() => setBrand('all')}>
                {t.productsFilters.allBrands}
              </FilterChip>
              {brands.map((b) => (
                <FilterChip key={b.key} active={brand === b.key} onClick={() => setBrand(b.key)}>
                  {b.label}
                </FilterChip>
              ))}
            </div>
          ) : null}
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t.products.categoriesLabel}>
            <span className="me-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t.products.categoriesLabel}</span>
            <FilterChip active={category === 'all'} onClick={() => setCategory('all')}>
              {t.common.all}
            </FilterChip>
            {categoryKeys.map((key) => (
              <FilterChip key={key} active={category === key} onClick={() => setCategory(key)}>
                {(t.products.categories as Record<string, string>)[key]}
              </FilterChip>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{filtered.length}</span> {t.common.resultsCount}
          {totalPages > 1 ? (
            <span className="ms-2 text-xs">· {t.productsFilters.perPageNote.replace('{count}', String(PAGE_SIZE))}</span>
          ) : null}
        </p>
        {hasActiveFilters ? (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setCategory('all')
              setBrand('all')
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
          {visible.map((product, i) => (
            <Reveal key={product.slug} delay={Math.min(i, 8) * 60}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      )}

      {totalPages > 1 ? (
        <Paginator current={safePage} total={totalPages} onChange={goToPage} prevLabel={t.common.prevPage} nextLabel={t.common.nextPage} />
      ) : null}
    </div>
  )
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
        active ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-muted-foreground hover:border-accent hover:text-accent',
      )}
    >
      {children}
    </button>
  )
}

/** Page numbers with the ends always visible and an ellipsis for the gaps. */
function pageItems(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = new Set<number>([1, total, current - 1, current, current + 1])
  const sorted = Array.from(pages)
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b)
  const out: (number | '…')[] = []
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) out.push('…')
    out.push(sorted[i])
  }
  return out
}

function Paginator({ current, total, onChange, prevLabel, nextLabel }: { current: number; total: number; onChange: (page: number) => void; prevLabel: string; nextLabel: string }) {
  return (
    <nav className="mt-12 flex flex-wrap items-center justify-center gap-2" aria-label="pagination">
      <button
        type="button"
        onClick={() => onChange(current - 1)}
        disabled={current <= 1}
        className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight className="size-4 flip-x" aria-hidden />
        {prevLabel}
      </button>
      {pageItems(current, total).map((item, i) =>
        item === '…' ? (
          <span key={`gap-${i}`} className="px-1 text-muted-foreground" aria-hidden>
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            aria-current={item === current ? 'page' : undefined}
            className={cn(
              'grid size-10 place-items-center rounded-full border text-sm font-semibold transition-colors',
              item === current ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-accent hover:text-accent',
            )}
          >
            <span dir="ltr">{item}</span>
          </button>
        ),
      )}
      <button
        type="button"
        onClick={() => onChange(current + 1)}
        disabled={current >= total}
        className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
      >
        {nextLabel}
        <ChevronLeft className="size-4 flip-x" aria-hidden />
      </button>
    </nav>
  )
}
