'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Check, Plus, Package } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'
import { useCart } from '@/lib/cart-context'
import { pick, type Product } from '@/lib/wp/types'
import { cn } from '@/lib/utils'

export function ProductCard({ product }: { product: Product }) {
  const { t, locale } = useLanguage()
  const { add } = useCart()
  const [added, setAdded] = useState(false)

  const name = pick(product.name, locale)
  const href = `/products/${product.slug}`

  const onAdd = () => {
    add(
      {
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.image,
        brand: product.brand,
      },
      1,
    )
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl hover:shadow-black/5">
      <Link href={href} className="relative block aspect-4/3 overflow-hidden bg-secondary">
        {product.image ? (
          <Image
            src={product.image || '/placeholder.svg'}
            alt={product.imageAlt || name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="grid h-full place-items-center text-muted-foreground">
            <Package className="size-10" aria-hidden />
          </span>
        )}
        <span
          className={cn(
            'absolute start-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold',
            product.inStock
              ? 'bg-background/90 text-foreground'
              : 'bg-muted text-muted-foreground',
          )}
        >
          {product.inStock ? t.common.inStock : t.common.outOfStock}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        {product.brand ? (
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">{product.brand}</span>
        ) : null}
        <Link href={href} className="line-clamp-2 font-serif text-lg font-bold leading-snug hover:text-accent">
          {name}
        </Link>

        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <div>
            {product.price ? (
              <span className="text-lg font-bold" dir="ltr">
                {product.price}
              </span>
            ) : (
              <span className="text-sm font-semibold text-muted-foreground">{t.common.onRequest}</span>
            )}
          </div>
          <button
            type="button"
            onClick={onAdd}
            disabled={!product.inStock}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50',
              added
                ? 'bg-accent text-accent-foreground'
                : 'bg-primary text-primary-foreground hover:bg-primary/90',
            )}
            aria-label={t.common.addToCart}
          >
            {added ? <Check className="size-4" aria-hidden /> : <Plus className="size-4" aria-hidden />}
            <span className="hidden sm:inline">{added ? t.common.added : t.common.addToCart}</span>
          </button>
        </div>
      </div>
    </article>
  )
}
