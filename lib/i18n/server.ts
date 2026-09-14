import 'server-only'
import { headers, cookies } from 'next/headers'
import { defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from './config'

export async function readLocale(): Promise<Locale> {
  const value = (await headers()).get('x-lion-locale')
  if (isLocale(value)) return value
  const preference = (await cookies()).get(LOCALE_COOKIE)?.value
  return isLocale(preference) ? preference : defaultLocale
}

export async function readPath(): Promise<string> {
  return (await headers()).get('x-lion-path') || '/'
}
