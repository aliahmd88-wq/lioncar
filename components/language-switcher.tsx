'use client'

import { useEffect, useRef, useState } from 'react'
import { Globe, Check } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'
import { locales, localeLabels } from '@/lib/i18n/config'
import { cn } from '@/lib/utils'

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-2 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t.nav.language}
      >
        <Globe className="size-4" aria-hidden />
        <span>{localeLabels[locale].short}</span>
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute end-0 z-50 mt-2 min-w-40 overflow-hidden rounded-2xl border border-border bg-popover p-1 shadow-lg"
        >
          {locales.map((l) => (
            <button
              key={l}
              role="menuitemradio"
              aria-checked={l === locale}
              type="button"
              onClick={() => {
                setLocale(l)
                setOpen(false)
              }}
              className={cn(
                'flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm transition-colors',
                l === locale ? 'bg-secondary text-foreground' : 'hover:bg-secondary/60',
              )}
            >
              <span className="flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground">{localeLabels[l].short}</span>
                {localeLabels[l].name}
              </span>
              {l === locale ? <Check className="size-4 text-accent" aria-hidden /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
