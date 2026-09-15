import type { MetadataRoute } from 'next'

import { siteUrl } from '@/lib/seo'
import { locales, localeHref } from '@/lib/i18n/config'
import { getProducts } from '@/lib/wp/products'
import { getPosts } from '@/lib/wp/blog'
import { getImportCars, getSaleCars } from '@/lib/wp/vehicles'

/**
 * Sitemap for the storefront. Every public page exists once per language
 * under its locale prefix (/he/…, /ar/…, /en/…), which is exactly what the
 * hreflang alternates in the layout advertise.
 *
 * The static routes are listed by hand; everything else is read live from
 * WordPress, so a product, vehicle or article published in the CMS enters the
 * sitemap on the next revalidation without a code change. Each WordPress read
 * is guarded: a CMS outage degrades the sitemap to its static routes rather
 * than failing the whole response, because a 500 here tells search engines
 * the site is broken.
 */
export const revalidate = 3600

type Entry = MetadataRoute.Sitemap[number]

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: Entry['changeFrequency'] }[] = [
  { path: '/', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/products', priority: 0.9, changeFrequency: 'daily' },
  { path: '/cars', priority: 0.9, changeFrequency: 'daily' },
  { path: '/blog', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/contact', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/return-policy', priority: 0.4, changeFrequency: 'yearly' },
  { path: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
]

async function safe<T>(load: () => Promise<T>, fallback: T, label: string): Promise<T> {
  try {
    return await load()
  } catch (error) {
    console.error(`[lioncar] sitemap: ${label} unavailable`, error)
    return fallback
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const base = siteUrl()

  const [products, posts, importCars, saleCars] = await Promise.all([
    safe(getProducts, [], 'products'),
    safe(getPosts, [], 'posts'),
    safe(getImportCars, [], 'import cars'),
    safe(getSaleCars, [], 'sale cars'),
  ])

  const entries: Entry[] = []
  const addLocalized = (path: string, details: Omit<Entry, 'url' | 'alternates'>) => {
    const languages = Object.fromEntries(locales.map((locale) => [locale, `${base}${localeHref(path, locale)}`]))
    for (const locale of locales) {
      entries.push({ url: `${base}${localeHref(path, locale)}`, alternates: { languages }, ...details })
    }
  }

  for (const route of STATIC_ROUTES) {
    addLocalized(route.path, { lastModified: now, changeFrequency: route.changeFrequency, priority: route.priority })
  }
  for (const product of products) {
    if (product.slug) addLocalized(`/products/${product.slug}`, { lastModified: now, changeFrequency: 'weekly', priority: 0.8 })
  }
  for (const car of importCars) {
    if (car.slug) addLocalized(`/cars/import/${car.slug}`, { lastModified: now, changeFrequency: 'weekly', priority: 0.8 })
  }
  for (const car of saleCars) {
    if (car.slug) addLocalized(`/cars/sale/${car.slug}`, { lastModified: now, changeFrequency: 'weekly', priority: 0.8 })
  }
  for (const post of posts) {
    if (!post.slug) continue
    // Articles carry a real publication date; using it lets crawlers tell a
    // fresh post from an old one instead of seeing every URL as "just now".
    addLocalized(`/blog/${post.slug}`, { lastModified: post.date ? new Date(post.date) : now, changeFrequency: 'monthly', priority: 0.6 })
  }

  return entries
}
