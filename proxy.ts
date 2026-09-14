import { NextRequest, NextResponse } from 'next/server'
import { defaultLocale, isLocale, localeFromPath, localeHref, LOCALE_COOKIE, stripLocale } from '@/lib/i18n/config'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const locale = localeFromPath(pathname)
  if (!locale) {
    const preference = request.cookies.get(LOCALE_COOKIE)?.value
    const url = request.nextUrl.clone()
    url.pathname = localeHref(pathname, isLocale(preference) ? preference : defaultLocale)
    return NextResponse.redirect(url)
  }

  const headers = new Headers(request.headers)
  headers.set('x-lion-locale', locale)
  headers.set('x-lion-path', stripLocale(pathname))
  const url = request.nextUrl.clone()
  url.pathname = stripLocale(pathname)
  return NextResponse.rewrite(url, { request: { headers } })
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
