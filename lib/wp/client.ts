import 'server-only'

const ENDPOINT = process.env.WORDPRESS_GRAPHQL_ENDPOINT || 'https://a-f.site/graphql'
const ORIGIN = 'https://lioncar.co.il'

type GraphQLResponse<T> = {
  data?: T
  errors?: { message: string }[]
}

/**
 * Server-only WPGraphQL fetch. The upstream WordPress locks requests to the
 * production origin, so we always send `Origin: https://lioncar.co.il`.
 */
export async function wpQuery<T>(
  query: string,
  variables: Record<string, unknown> = {},
  revalidate = 600,
): Promise<T | null> {
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: ORIGIN,
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate },
    })

    if (!res.ok) {
      console.log('[v0] wpQuery HTTP error', res.status)
      return null
    }

    const json = (await res.json()) as GraphQLResponse<T>
    if (json.errors?.length) {
      console.log('[v0] wpQuery GraphQL errors', json.errors.map((e) => e.message).join('; '))
      // Data may still be partially present; return it when available.
      return json.data ?? null
    }
    return json.data ?? null
  } catch (err) {
    console.log('[v0] wpQuery fetch failed', (err as Error).message)
    return null
  }
}
