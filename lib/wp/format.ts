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

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', hellip: '…', ndash: '–', mdash: '—', laquo: '«', raquo: '»', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“' }

/** Turns HTML entities back into characters (WordPress excerpts arrive as "… [&hellip;]"). */
export function decodeEntities(value: string): string {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (match, name) => ENTITIES[name.toLowerCase()] ?? match)
}

export function stripHtml(html: string | null | undefined): string {
  if (!html) return ''
  const text = decodeEntities(html.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim()
  // WordPress closes auto-excerpts with " […]"; a plain ellipsis reads better.
  return text.replace(/\s*\[…\]\s*$/, '…')
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
