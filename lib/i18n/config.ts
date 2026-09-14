export const locales = ['he', 'ar', 'en'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'he'

export function dirFor(locale: Locale): 'rtl' | 'ltr' {
  return locale === 'en' ? 'ltr' : 'rtl'
}

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value)
}

export const LOCALE_COOKIE = 'NEXT_LOCALE'

export function localeFromPath(pathname: string): Locale | undefined {
  const segment = pathname.split('/')[1]
  return isLocale(segment) ? segment : undefined
}

export function stripLocale(pathname: string): string {
  return pathname.replace(/^\/(he|ar|en)(?=\/|$|\?|#)/, '') || '/'
}

export function localeHref(href: string, locale: Locale): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href
  const path = stripLocale(href)
  return `/${locale}${path === '/' ? '' : path}`
}

export const localeLabels: Record<Locale, { short: string; name: string }> = {
  he: { short: 'עב', name: 'עברית' },
  ar: { short: 'ع', name: 'العربية' },
  en: { short: 'EN', name: 'English' },
}
