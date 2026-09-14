'use client'

import { useLanguage } from '@/lib/i18n/context'

export function HomeStats({ partsCount }: { partsCount: number }) {
  const { t } = useLanguage()

  const items = [
    { value: '100+', label: t.home.stats.customers },
    { value: partsCount > 0 ? `${partsCount}+` : '500+', label: t.home.stats.parts },
    { value: '6', label: t.home.stats.brands },
    { value: '3', label: t.home.stats.markets },
  ]

  return (
    <section className="border-b border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-1 py-8 text-center lg:py-10">
            <span className="font-serif text-4xl font-black tracking-tight text-foreground lg:text-5xl" dir="ltr">
              {item.value}
            </span>
            <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
