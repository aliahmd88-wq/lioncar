import { wpQuery } from './client'
import { estimateReadMinutes, stripHtml } from './format'
import type { BlogPost } from './types'
import { defaultLocale, type Locale } from '@/lib/i18n/config'

/**
 * Posts are written once in WordPress; the Hebrew, Arabic and English titles
 * and excerpts live in the `blogPostFields` ACF group, the body in the normal
 * post content. The reader's language is resolved here, on the server, so the
 * pages keep a plain BlogPost with one title and one excerpt.
 */
const POST_FIELDS = `
  slug title excerpt date
  featuredImage { node { sourceUrl altText } }
  categories { nodes { name slug } }
  blogPostFields {
    postTitleHe postTitleAr postTitleEn
    postExcerptHe postExcerptAr postExcerptEn
    readingMinutes blogCategory featuredPost
  }
`

function localizedField(acf: Record<string, unknown> | null | undefined, base: string, locale: Locale): string {
  const suffix = { he: 'He', ar: 'Ar', en: 'En' }[locale]
  const value = acf?.[`${base}${suffix}`]
  return typeof value === 'string' ? value.trim() : ''
}

function normalize(raw: any, locale: Locale, withContent = false): BlogPost {
  const acf = (raw?.blogPostFields ?? null) as Record<string, unknown> | null
  const title = localizedField(acf, 'postTitle', locale) || localizedField(acf, 'postTitle', 'he') || stripHtml(raw.title) || raw.title
  const excerpt = localizedField(acf, 'postExcerpt', locale) || localizedField(acf, 'postExcerpt', 'he') || stripHtml(raw.excerpt)
  const acfCategory = typeof acf?.blogCategory === 'string' ? acf.blogCategory : null
  const category = acfCategory || raw?.categories?.nodes?.[0]?.slug || null
  const readingMinutes = Number(acf?.readingMinutes)
  return {
    slug: raw.slug,
    title,
    excerpt,
    date: raw.date,
    image: raw?.featuredImage?.node?.sourceUrl ?? null,
    category,
    readMinutes: Number.isFinite(readingMinutes) && readingMinutes > 0 ? readingMinutes : estimateReadMinutes(raw.content ?? raw.excerpt),
    content: withContent ? (raw.content ?? '') : undefined,
  }
}

export async function getPosts(locale: Locale = defaultLocale): Promise<BlogPost[]> {
  const query = `
    query Posts {
      posts(first: 24, where: { status: PUBLISH }) {
        nodes { ${POST_FIELDS} }
      }
    }
  `
  const data: any = await wpQuery(query)
  return (data?.posts?.nodes ?? []).map((n: any) => normalize(n, locale))
}

export async function getPost(slug: string, locale: Locale = defaultLocale): Promise<BlogPost | null> {
  const query = `
    query Post($slug: ID!) {
      post(id: $slug, idType: SLUG) { ${POST_FIELDS} content }
    }
  `
  const data: any = await wpQuery(query, { slug })
  if (!data?.post) return null
  return normalize(data.post, locale, true)
}
