'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Check, MessageCircle, Package, Plus, ShieldCheck } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'
import { useCart } from '@/lib/cart-context'
import { LocalizedHtml } from '@/components/localized-html'
import { ProductCard } from '@/components/product-card'
import { SectionHeading } from '@/components/section-heading'
import { pick, type Product } from '@/lib/wp/types'
import { cn } from '@/lib/utils'

export function ProductDetail({ product, related }: { product: Product; related: Product[] }) {
  const { t, locale } = useLanguage()
  const { add } = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const gallery = [product.image, ...product.gallery].filter((x): x is string => !!x)
  const [activeImage, setActiveImage] = useState(gallery[0] ?? null)

  const name = pick(product.name, locale)
  const description = pick(product.description, locale)
  const wa = 'https://wa.me/972539573718?text=' + encodeURIComponent(`${t.productDetail.askAbout}: ${name} (${product.sku})`)

  const onAdd = () => {
    add({ slug: product.slug, name: product.name, price: product.price, image: product.image, brand: product.brand }, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Link href="/products" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-accent">
        <ArrowRight className="size-4 rotate-180 flip-x" aria-hidden />
        {t.common.backToProducts}
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-secondary">
            {activeImage ? (
              <Image src={activeImage || '/placeholder.svg'} alt={product.imageAlt || name} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" priority />
            ) : (
              <span className="grid h-full place-items-center text-muted-foreground">
                <Package className="size-14" aria-hidden />
              </span>
            )}
          </div>
          {gallery.length > 1 ? (
            <div className="flex flex-wrap gap-3">
              {gallery.map((img) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setActiveImage(img)}
                  className={cn(
                    'relative size-20 overflow-hidden rounded-xl border-2 transition-colors',
                    activeImage === img ? 'border-accent' : 'border-border hover:border-accent/50',
                  )}
                >
                  <Image src={img || '/placeholder.svg'} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-5">
          {product.brand ? (
            <span className="text-sm font-semibold uppercase tracking-wider text-accent">{product.brand}</span>
          ) : null}
          <h1 className="text-balance font-serif text-3xl font-bold leading-tight sm:text-4xl">{name}</h1>

          <div className="flex flex-wrap items-center gap-3">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold',
                product.inStock ? 'bg-accent/10 text-accent' : 'bg-muted text-muted-foreground',
              )}
            >
              <Check className="size-4" aria-hidden />
              {product.inStock ? t.common.inStock : t.common.outOfStock}
            </span>
            {product.sku ? (
              <span className="text-sm text-muted-foreground">
                {t.common.sku}: <span dir="ltr" className="font-medium text-foreground">{product.sku}</span>
              </span>
            ) : null}
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            {product.price ? (
              <span className="font-serif text-3xl font-black" dir="ltr">
                {product.price}
              </span>
            ) : (
              <span className="text-lg font-semibold text-muted-foreground">{t.common.onRequest}</span>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center rounded-full border border-border">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid size-10 place-items-center text-lg" aria-label="-">
                  −
                </button>
                <span className="w-10 text-center font-semibold" aria-live="polite">{qty}</span>
                <button type="button" onClick={() => setQty((q) => Math.min(99, q + 1))} className="grid size-10 place-items-center text-lg" aria-label="+">
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={onAdd}
                disabled={!product.inStock}
                className={cn(
                  'inline-flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50',
                  added ? 'bg-accent text-accent-foreground' : 'bg-primary text-primary-foreground hover:bg-primary/90',
                )}
              >
                {added ? <Check className="size-4" aria-hidden /> : <Plus className="size-4" aria-hidden />}
                {added ? t.common.added : t.common.addToCart}
              </button>
            </div>

            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold transition-colors hover:border-accent hover:text-accent"
            >
              <MessageCircle className="size-4" aria-hidden />
              {t.productDetail.askAbout}
            </a>
          </div>

          <p className="flex items-start gap-2 rounded-2xl bg-secondary/60 p-4 text-sm text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
            {t.productDetail.fitmentNote}
          </p>

          {description ? (
            <div className="pt-2">
              <LocalizedHtml value={description} className="text-sm leading-relaxed text-muted-foreground [&_p]:mb-3" />
            </div>
          ) : null}
        </div>
      </div>

      {product.specs.length > 0 || product.compat.length > 0 ? (
        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {product.specs.length > 0 ? (
            <div className="rounded-3xl border border-border bg-card p-6">
              <h2 className="font-serif text-xl font-bold">{t.common.specifications}</h2>
              <dl className="mt-4 divide-y divide-border">
                {product.specs.map((spec, i) => (
                  <div key={i} className="flex items-center justify-between gap-4 py-3 text-sm">
                    <dt className="text-muted-foreground">{pick(spec.label, locale)}</dt>
                    <dd className="font-semibold text-end">{pick(spec.value, locale)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}

          {product.compat.length > 0 ? (
            <div className="rounded-3xl border border-border bg-card p-6">
              <h2 className="font-serif text-xl font-bold">{t.common.compatibility}</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {product.compat.map((model) => (
                  <li key={model} className="rounded-full bg-secondary px-3 py-1.5 text-sm font-medium">
                    {model}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      {related.length > 0 ? (
        <div className="mt-20">
          <SectionHeading title={t.productDetail.related} />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
