'use client'

import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import type { ReactNode } from 'react'
import type { Localized } from '@/lib/wp/types'
import { CART_QUANTITY_COOKIE, CART_STORAGE_KEY } from '@/lib/checkout/gate'

export type CartItem = {
  slug: string
  /** WooCommerce product id, needed to hand the basket to checkout. */
  wooId: number
  name: Localized
  price: string | null
  image: string | null
  brand: string
  quantity: number
}

type CartState = { items: CartItem[] }

type CartAction =
  | { type: 'add'; item: Omit<CartItem, 'quantity'>; quantity?: number }
  | { type: 'remove'; slug: string }
  | { type: 'setQty'; slug: string; quantity: number }
  | { type: 'clear' }
  | { type: 'hydrate'; state: CartState }

const STORAGE_KEY = CART_STORAGE_KEY
const MAX_QTY = 99

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'hydrate':
      return action.state
    case 'add': {
      const qty = Math.min(MAX_QTY, Math.max(1, action.quantity ?? 1))
      const existing = state.items.find((i) => i.slug === action.item.slug)
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.slug === action.item.slug
              ? { ...i, quantity: Math.min(MAX_QTY, i.quantity + qty) }
              : i,
          ),
        }
      }
      return { items: [...state.items, { ...action.item, quantity: qty }] }
    }
    case 'remove':
      return { items: state.items.filter((i) => i.slug !== action.slug) }
    case 'setQty':
      return {
        items: state.items
          .map((i) =>
            i.slug === action.slug
              ? { ...i, quantity: Math.min(MAX_QTY, Math.max(1, action.quantity)) }
              : i,
          )
          .filter((i) => i.quantity > 0),
      }
    case 'clear':
      return { items: [] }
    default:
      return state
  }
}

type CartContextValue = {
  items: CartItem[]
  count: number
  add: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  remove: (slug: string) => void
  setQty: (slug: string, quantity: number) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] })
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) dispatch({ type: 'hydrate', state: JSON.parse(raw) })
    } catch {
      /* ignore malformed storage */
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* ignore quota errors */
    }
    // Mirror the basket size where the server can see it. The proxied
    // WooCommerce checkout only renders when this agrees with the quantity the
    // last handoff pushed, so a cleared cart can never show a stale basket.
    const quantity = state.items.reduce((sum, i) => sum + i.quantity, 0)
    const secure = window.location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `${CART_QUANTITY_COOKIE}=${quantity}; Path=/; Max-Age=${2 * 24 * 60 * 60}; SameSite=Lax${secure}`
  }, [state, ready])

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      count: state.items.reduce((sum, i) => sum + i.quantity, 0),
      add: (item, quantity) => dispatch({ type: 'add', item, quantity }),
      remove: (slug) => dispatch({ type: 'remove', slug }),
      setQty: (slug, quantity) => dispatch({ type: 'setQty', slug, quantity }),
      clear: () => dispatch({ type: 'clear' }),
    }),
    [state],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
