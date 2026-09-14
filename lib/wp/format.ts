import type { Localized } from './types'

/** Take the first non-empty value from a WPGraphQL field that may be an array. */
export function first(value: unknown): string {
  if (Array.isArray(value)) return typeof value[0] === 'string' ? value[0] : ''
  return typeof value === 'string' ? value : ''
}

export function asArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string')
  if (typeof value === 'string' && value) return [value]
  return []
}

export function stripHtml(html: string | null | undefined): string {
  if (!html) return ''
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#8211;/g, '–')
    .replace(/&#8217;/g, '’')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

export function cleanPrice(price: string | null | undefined): string | null {
  if (!price) return null
  const text = stripHtml(price).trim()
  return text || null
}

export function localized(he: string, ar: string, en: string): Localized {
  return {
    he: (he || '').trim(),
    ar: (ar || '').trim(),
    en: (en || '').trim(),
  }
}

export function toNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const n = Number(value.replace(/[^\d.]/g, ''))
    return Number.isFinite(n) && value.trim() !== '' ? n : null
  }
  return null
}

export function estimateReadMinutes(html: string | null | undefined): number {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}
