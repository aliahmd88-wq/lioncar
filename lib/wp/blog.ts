import { wpQuery } from './client'
import { estimateReadMinutes, stripHtml } from './format'
import type { BlogPost } from './types'

function normalize(raw: any, withContent = false): BlogPost {
  const category = raw?.categories?.nodes?.[0]?.slug ?? null
  return {
    slug: raw.slug,
    title: stripHtml(raw.title) || raw.title,
    excerpt: stripHtml(raw.excerpt),
    date: raw.date,
    image: raw?.featuredImage?.node?.sourceUrl ?? null,
    category,
    readMinutes: estimateReadMinutes(raw.content ?? raw.excerpt),
    content: withContent ? (raw.content ?? '') : undefined,
  }
}

export async function getPosts(): Promise<BlogPost[]> {
  const query = `
    query Posts {
      posts(first: 24, where: { status: PUBLISH }) {
        nodes {
          slug title excerpt date
          featuredImage { node { sourceUrl altText } }
          categories { nodes { name slug } }
        }
      }
    }
  `
  const data: any = await wpQuery(query)
  return (data?.posts?.nodes ?? []).map((n: any) => normalize(n))
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  const query = `
    query Post($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        slug title excerpt content date
        featuredImage { node { sourceUrl altText } }
        categories { nodes { name slug } }
      }
    }
  `
  const data: any = await wpQuery(query, { slug })
  if (!data?.post) return null
  return normalize(data.post, true)
}
