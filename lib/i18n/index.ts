import { he } from './dictionaries/he'
import { ar } from './dictionaries/ar'
import { en } from './dictionaries/en'
import type { Dictionary } from './dictionaries/en'
import type { Locale } from './config'
import { defaultLocale } from './config'

export type { Dictionary }

const dictionaries: Record<Locale, Dictionary> = { he, ar, en }

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale]
}
