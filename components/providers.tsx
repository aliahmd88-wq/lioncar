'use client'

import type { ReactNode } from 'react'
import { LanguageProvider } from '@/lib/i18n/context'
import { CartProvider } from '@/lib/cart-context'
import type { Locale } from '@/lib/i18n/config'

export function Providers({
  initialLocale,
  children,
}: {
  initialLocale: Locale
  children: ReactNode
}) {
  return (
    <LanguageProvider initialLocale={initialLocale}>
      <CartProvider>{children}</CartProvider>
    </LanguageProvider>
  )
}
