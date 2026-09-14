import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPost, getPosts } from '@/lib/wp/blog'
import { BlogPostView } from '@/components/blog/blog-post-view'

export const revalidate = 600

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt || undefined,
    openGraph: post.image ? { images: [post.image], type: 'article' } : { type: 'article' },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const all = await getPosts()
  const related = all.filter((p) => p.slug !== post.slug).slice(0, 3)

  return <BlogPostView post={post} related={related} />
}
