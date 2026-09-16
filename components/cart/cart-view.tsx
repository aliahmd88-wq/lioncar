'use client'

import Link from '@/components/localized-link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useFormStatus } from 'react-dom'
import { AlertCircle, ArrowRight, Loader2, Minus, Plus, ShoppingCart, Trash2, MessageCircle, Package } from 'lucide-react'
import { prepareCheckoutAction } from '@/lib/checkout/actions'
import { useLanguage } from '@/lib/i18n/context'
import { useCart } from '@/lib/cart-context'
import { PageHeader } from '@/components/page-header'
import { pick } from '@/lib/wp/types'

function priceValue(price: string | null): number {
  if (!price) return 0
  const n = Number(price.replace(/[^\d.]/g, ''))
  return Number.isFinite(n) ? n : 0
}

/**
 * Split into its own component because `useFormStatus` only reports the status
 * of the form it is rendered inside. Without a pending state the button would
 * stay clickable and silent while the server action rebuilds the WooCommerce
 * basket, which reads as "nothing happened".
 */
function CheckoutSubmit({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-progress disabled:opacity-70"
    >
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden />
          {pendingLabel}
        </>
      ) : (
        <>
          {label}
          <ArrowRight className="size-4 flip-x" aria-hidden />
        </>
      )}
    </button>
  )
}

export function CartView({ whatsapp }: { whatsapp: string }) {
  const { t, locale } = useLanguage()
  const { items, setQty, remove, clear } = useCart()
  const wa = whatsapp.replace(/[^\d]/g, '')
  // The server action redirects back here with this flag when WooCommerce
  // could not be handed the basket, so the failure is visible, not silent.
  const checkoutStatus = useSearchParams().get('checkout')
  const checkoutFailed = checkoutStatus === 'unavailable'
  const checkoutExpired = checkoutStatus === 'expired'
  // Only lines that carry a WooCommerce id can be handed to checkout.
  const checkoutItems = items
    .filter((i) => Number.isInteger(i.wooId) && i.wooId > 0)
    .map((i) => `${i.wooId}:${i.quantity}`)
    .join(',')

  const subtotal = items.reduce((sum, i) => sum + priceValue(i.price) * i.quantity, 0)
  const hasPricing = items.some((i) => priceValue(i.price) > 0)
  const currency = items.find((i) => i.price)?.price?.replace(/[\d.,\s]/g, '') || '₪'

  const buildWhatsapp = () => {
    const lines = items.map((i) => `• ${pick(i.name, locale)} × ${i.quantity}${i.price ? ` — ${i.price}` : ''}`)
    return [t.cart.whatsappIntro, '', ...lines].join('\n')
  }

  if (items.length === 0) {
    return (
      <>
        <PageHeader eyebrow={t.nav.cart} title={t.cart.title} lead={t.cart.lead} />
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <ShoppingCart className="mx-auto size-14 text-muted-foreground" aria-hidden />
          <h2 className="mt-6 font-serif text-2xl font-bold">{t.cart.empty}</h2>
          <p className="mt-2 text-muted-foreground">{t.cart.emptyLead}</p>
          <Link
            href="/products"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t.cart.browseParts}
          </Link>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader eyebrow={t.nav.cart} title={t.cart.title} lead={t.cart.lead} />

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.6fr_1fr] lg:gap-12 lg:px-8">
        <div className="flex flex-col gap-4">
          <ul className="flex flex-col gap-4">
            {items.map((item) => (
              <li key={item.slug} className="flex gap-4 rounded-3xl border border-border bg-card p-4">
                <Link href={`/products/${item.slug}`} className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-secondary">
                  {item.image ? (
                    <Image src={item.image || '/placeholder.svg'} alt={pick(item.name, locale)} fill sizes="96px" className="object-cover" />
                  ) : (
                    <span className="grid h-full place-items-center text-muted-foreground">
                      <Package className="size-7" aria-hidden />
                    </span>
                  )}
                </Link>
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      {item.brand ? <span className="text-xs font-semibold uppercase tracking-wider text-primary">{item.brand}</span> : null}
                      <Link href={`/products/${item.slug}`} className="block font-serif font-bold leading-snug hover:text-primary">
                        {pick(item.name, locale)}
                      </Link>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(item.slug)}
                      className="grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive"
                      aria-label={t.common.remove}
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-3">
                    <div className="inline-flex items-center rounded-full border border-border">
                      <button type="button" onClick={() => setQty(item.slug, item.quantity - 1)} className="grid size-8 place-items-center" aria-label="-">
                        <Minus className="size-3.5" aria-hidden />
                      </button>
                      <span className="w-9 text-center text-sm font-semibold">{item.quantity}</span>
                      <button type="button" onClick={() => setQty(item.slug, item.quantity + 1)} className="grid size-8 place-items-center" aria-label="+">
                        <Plus className="size-3.5" aria-hidden />
                      </button>
                    </div>
                    <span className="font-semibold" dir="ltr">
                      {item.price ?? t.common.onRequest}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between">
            <Link href="/products" className="text-sm font-medium text-primary hover:underline">
              {t.cart.continueShopping}
            </Link>
            <button type="button" onClick={clear} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-destructive">
              <Trash2 className="size-4" aria-hidden />
              {t.cart.clearCart}
            </button>
          </div>
        </div>

        <aside className="h-fit rounded-3xl border border-border bg-card p-6 lg:sticky lg:top-24">
          <h2 className="font-serif text-xl font-bold">{t.cart.summary}</h2>
          <dl className="mt-5 flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">{t.cart.subtotal}</dt>
              <dd className="font-semibold" dir="ltr">
                {hasPricing ? `${subtotal.toLocaleString()} ${currency}` : t.common.onRequest}
              </dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-muted-foreground">{t.cart.shippingNote}</p>

          {checkoutFailed ? (
            <p role="alert" className="mt-5 flex items-start gap-2.5 rounded-2xl bg-destructive/10 p-4 text-sm leading-relaxed text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
              {t.cart.checkoutUnavailable}
            </p>
          ) : null}
          {checkoutExpired ? (
            <p role="status" className="mt-5 flex items-start gap-2.5 rounded-2xl bg-secondary p-4 text-sm leading-relaxed text-muted-foreground">
              <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
              {t.cart.checkoutExpired}
            </p>
          ) : null}

          {/* The server action rebuilds the WooCommerce basket on a-f.site and
              redirects to /checkout, proxied on this same origin. */}
          {checkoutItems ? (
            <form action={prepareCheckoutAction}>
              <input type="hidden" name="items" value={checkoutItems} />
              <input type="hidden" name="locale" value={locale} />
              <CheckoutSubmit label={t.cart.checkout} pendingLabel={t.cart.checkoutPending} />
            </form>
          ) : null}
          <p className="mt-3 text-center text-xs text-muted-foreground">{t.cart.checkoutNote}</p>

          <a
            href={`https://wa.me/${wa}?text=${encodeURIComponent(buildWhatsapp())}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#25D366] px-6 py-3 text-sm font-semibold text-[#128C7E] transition-colors hover:bg-[#25D366]/10"
          >
            <MessageCircle className="size-4" aria-hidden />
            {t.cart.orderViaWhatsapp}
          </a>
        </aside>
      </section>
    </>
  )
}
