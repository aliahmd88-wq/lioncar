import type { Metadata } from 'next'
import { getStoreSettings } from '@/lib/wp/store'
import { ContactView } from '@/components/contact/contact-view'
import { getDictionary } from '@/lib/i18n'
import { readLocale } from '@/lib/i18n/server'

export const revalidate = 600

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await readLocale())
  return { title: t.seo.contactTitle, description: t.seo.contactDescription }
}

export default async function ContactPage() {
  const store = await getStoreSettings()
  return <ContactView store={store} />
}
