import type { Vehicle } from './types'

// New-tab category buckets. Client-safe (no server-only imports).
export function matchesNewCategory(v: Vehicle, cat: string): boolean {
  switch (cat) {
    case 'trucks':
      return v.bodyTypes.includes('truck')
    case 'work':
      return v.bodyTypes.some((b) => b === 'van' || b === 'pickup')
    case 'buses':
      return v.bodyTypes.includes('minivan')
    case 'cars':
      return v.bodyTypes.some((b) => b === 'suv' || b === 'luxury_mpv')
    case 'taxi':
      return v.isTaxi
    default:
      return true
  }
}

// Used-tab category buckets.
export function matchesUsedCategory(v: Vehicle, cat: string): boolean {
  switch (cat) {
    case 'trucks':
      return v.bodyTypes.some((b) => ['truck', 'van', 'pickup', 'minivan'].includes(b))
    case 'cars':
      return v.bodyTypes.some((b) => b === 'suv' || b === 'luxury_mpv')
    default:
      return true
  }
}
