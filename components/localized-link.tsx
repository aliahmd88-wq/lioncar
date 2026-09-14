'use client'

import NextLink from 'next/link'
import type { ComponentProps } from 'react'
import { useLanguage } from '@/lib/i18n/context'
import { localeHref } from '@/lib/i18n/config'

export default function LocalizedLink({ href, ...props }: ComponentProps<typeof NextLink>) {
  const { locale } = useLanguage()
  const localized = typeof href === 'string'
    ? localeHref(href, locale)
    : { ...href, pathname: localeHref(href.pathname || '/', locale) }
  return <NextLink href={localized} {...props} />
}
