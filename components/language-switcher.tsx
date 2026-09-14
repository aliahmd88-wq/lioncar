'use client'

import { Globe, ChevronDown } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'
import { locales, localeLabels, isLocale } from '@/lib/i18n/config'
import { cn } from '@/lib/utils'

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLanguage()
  return (
    <label className={cn('relative flex h-10 items-center rounded-lg border border-current/20', className)}>
      <Globe className="pointer-events-none absolute start-3 size-4" aria-hidden />
      <span className="sr-only">{t.nav.language}</span>
      <select value={locale} onChange={(event) => { if (isLocale(event.target.value)) setLocale(event.target.value) }} className="h-full w-full appearance-none rounded-lg bg-transparent ps-9 pe-8 text-sm font-semibold outline-offset-4">
        {locales.map((value) => <option key={value} value={value} lang={value} className="bg-background text-foreground">{localeLabels[value].name}</option>)}
      </select>
      <ChevronDown className="pointer-events-none absolute end-2 size-4" aria-hidden />
    </label>
  )
}
