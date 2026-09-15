import type { Metadata } from 'next'
import { getPosts } from '@/lib/wp/blog'
import { BlogView } from '@/components/blog/blog-view'
import { getDictionary } from '@/lib/i18n'
import { readLocale } from '@/lib/i18n/server'

export const revalidate = 600

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await readLocale())
  return { title: t.seo.blogTitle, description: t.seo.blogDescription }
}

export default async function BlogPage() {
  const posts = await getPosts()
  return <BlogView posts={posts} />
}
