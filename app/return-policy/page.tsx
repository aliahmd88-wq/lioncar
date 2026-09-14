import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { getPolicyPage } from '@/lib/wp/pages'
import { PolicyView } from '@/components/policy/policy-view'
import { getDictionary } from '@/lib/i18n'
import { defaultLocale, isLocale, LOCALE_COOKIE } from '@/lib/i18n/config'

export const revalidate = 600

async function locale() {
  const store = await cookies()
  const value = store.get(LOCALE_COOKIE)?.value
  return isLocale(value) ? value : defaultLocale
}

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await locale())
  return { title: t.seo.returnsTitle, description: t.seo.returnsDescription }
}

export default async function ReturnPolicyPage() {
  const l = await locale()
  const t = getDictionary(l)
  const page = await getPolicyPage('return-policy', l)
  return <PolicyView page={page} fallbackTitle={t.seo.returnsTitle} />
}
