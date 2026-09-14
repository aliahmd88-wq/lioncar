'use client'

import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import type { ReactNode } from 'react'
import type { Localized } from '@/lib/wp/types'

export type CartItem = {
  slug: string
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

const STORAGE_KEY = 'leoncar_cart_v1'
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

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) dispatch({ type: 'hydrate', state: JSON.parse(raw) })
    } catch {
      /* ignore malformed storage */
    }
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* ignore quota errors */
    }
  }, [state])

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
