'use client'

import { createContext, useContext, useCallback, useMemo, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { getDictionary, type Dictionary } from './index'
import { type Locale, dirFor, defaultLocale, isLocale, LOCALE_COOKIE } from './config'

type LanguageContextValue = {
  t: Dictionary
  locale: Locale
  dir: 'rtl' | 'ltr'
  setLocale: (locale: Locale) => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale
  children: ReactNode
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  // Reconcile with a client-side preference that the server could not see.
  useEffect(() => {
    const stored = window.localStorage.getItem(LOCALE_COOKIE)
    if (isLocale(stored) && stored !== locale) {
      applyLocale(stored)
      setLocaleState(stored)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setLocale = useCallback((next: Locale) => {
    applyLocale(next)
    setLocaleState(next)
  }, [])

  const value = useMemo<LanguageContextValue>(
    () => ({
      t: getDictionary(locale),
      locale,
      dir: dirFor(locale),
      setLocale,
    }),
    [locale, setLocale],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

function applyLocale(next: Locale) {
  window.localStorage.setItem(LOCALE_COOKIE, next)
  document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`
  const root = document.documentElement
  root.lang = next
  root.dir = dirFor(next)
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider')
  return ctx
}

export { defaultLocale }
