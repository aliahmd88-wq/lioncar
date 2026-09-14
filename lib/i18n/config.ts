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

export const localeLabels: Record<Locale, { short: string; name: string }> = {
  he: { short: 'עב', name: 'עברית' },
  ar: { short: 'ع', name: 'العربية' },
  en: { short: 'EN', name: 'English' },
}
