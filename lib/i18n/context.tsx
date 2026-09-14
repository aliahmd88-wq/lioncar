'use client'

import { createContext, useContext, useCallback, useMemo, useEffect, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { getDictionary, type Dictionary } from './index'
import { type Locale, dirFor, defaultLocale, localeFromPath, localeHref, LOCALE_COOKIE } from './config'

type LanguageContextValue = {
  t: Dictionary
  locale: Locale
  dir: 'rtl' | 'ltr'
  setLocale: (locale: Locale) => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ initialLocale, children }: { initialLocale: Locale; children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const locale = localeFromPath(pathname) ?? initialLocale

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = dirFor(locale)
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    if (next === locale) return
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; SameSite=Lax${window.location.protocol === 'https:' ? '; Secure' : ''}`
    router.push(`${localeHref(pathname, next)}${window.location.search}${window.location.hash}`, { scroll: false })
  }, [locale, pathname, router])

  const value = useMemo<LanguageContextValue>(() => ({ t: getDictionary(locale), locale, dir: dirFor(locale), setLocale }), [locale, setLocale])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider')
  return context
}

export { defaultLocale }
