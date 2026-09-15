import { wpQuery } from './client'
import type { StoreSettings } from './types'

const FALLBACK: StoreSettings = {
  phone: '053-957-3718',
  whatsapp: '972539573718',
  email: 'info@lioncar.co.il',
  hours: 'Sat–Thu 09:00–18:00 · Friday closed',
  address: 'Main road 745, Reineh, Israel',
  storeUrl: 'https://a-f.site',
  facebook: null,
  instagram: null,
  tiktok: null,
}

export async function getStoreSettings(): Promise<StoreSettings> {
  const query = `
    query StoreSettings {
      storeSettings { phone whatsapp email addressLines hours facebook instagram tiktok storeUrl }
    }
  `
  const data: any = await wpQuery(query)
  const s = data?.storeSettings
  if (!s) return FALLBACK
  return {
    phone: s.phone || FALLBACK.phone,
    whatsapp: s.whatsapp || FALLBACK.whatsapp,
    email: s.email || FALLBACK.email,
    hours: s.hours || FALLBACK.hours,
    address: Array.isArray(s.addressLines) && s.addressLines.length ? s.addressLines.filter(Boolean).join(', ') : FALLBACK.address,
    storeUrl: s.storeUrl || FALLBACK.storeUrl,
    facebook: s.facebook || null,
    instagram: s.instagram || null,
    tiktok: s.tiktok || null,
  }
}

export function whatsappLink(whatsapp: string, message?: string): string {
  const num = whatsapp.replace(/[^\d]/g, '')
  const base = `https://wa.me/${num}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}
