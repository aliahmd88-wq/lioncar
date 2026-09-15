import type { Metadata } from 'next'
import { getPolicyPage } from '@/lib/wp/pages'
import { PolicyView } from '@/components/policy/policy-view'
import { getDictionary } from '@/lib/i18n'
import { readLocale } from '@/lib/i18n/server'

export const revalidate = 600

async function locale() {
  return readLocale()
}

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await locale())
  return { title: t.seo.privacyTitle, description: t.seo.privacyDescription }
}

export default async function PrivacyPolicyPage() {
  const l = await locale()
  const t = getDictionary(l)
  const page = await getPolicyPage('privacy-policy', l)
  return <PolicyView page={page} fallbackTitle={t.seo.privacyTitle} />
}
