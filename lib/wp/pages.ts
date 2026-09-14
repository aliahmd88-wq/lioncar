import { wpQuery } from './client'
import type { Locale } from '@/lib/i18n/config'
import type { PolicyPage } from './types'

export type PolicySlug = 'privacy-policy' | 'terms' | 'return-policy'

export async function getPolicyPage(slug: PolicySlug, locale: Locale): Promise<PolicyPage | null> {
  const uri = `${slug}-${locale}`
  const query = `
    query PolicyPage($id: ID!) {
      page(id: $id, idType: URI) { title content modified }
    }
  `
  const data: any = await wpQuery(query, { id: uri })
  const page = data?.page
  if (!page) return null
  return {
    title: page.title ?? '',
    content: page.content ?? '',
    modified: page.modified ?? '',
  }
}
