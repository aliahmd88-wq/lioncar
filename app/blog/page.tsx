import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { getPosts } from '@/lib/wp/blog'
import { BlogView } from '@/components/blog/blog-view'
import { getDictionary } from '@/lib/i18n'
import { defaultLocale, isLocale, LOCALE_COOKIE } from '@/lib/i18n/config'

export const revalidate = 600

export async function generateMetadata(): Promise<Metadata> {
  const store = await cookies()
  const value = store.get(LOCALE_COOKIE)?.value
  const t = getDictionary(isLocale(value) ? value : defaultLocale)
  return { title: t.seo.blogTitle, description: t.seo.blogDescription }
}

export default async function BlogPage() {
  const posts = await getPosts()
  return <BlogView posts={posts} />
}
