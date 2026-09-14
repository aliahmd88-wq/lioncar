'use client'

import { useLanguage } from '@/lib/i18n/context'

export function HomeStats({ partsCount, vehicleCount, brandsCount }: { partsCount: number; vehicleCount: number; brandsCount: number }) {
  const { t, locale } = useLanguage()
  const format = new Intl.NumberFormat(locale)
  const items = [
    { value: format.format(partsCount), label: t.nav.products },
    { value: format.format(vehicleCount), label: t.nav.cars },
    { value: format.format(brandsCount), label: t.home.stats.brands },
    { value: format.format(3), label: t.home.stats.markets },
  ]
  return (
    <section aria-label={t.home.stats.eyebrow} className="border-b border-border bg-secondary text-secondary-foreground">
      <div className="site-container">
        <dl className="grid grid-cols-2 md:grid-cols-4">
          {items.map((item) => <div key={item.label} className="flex flex-col items-center gap-1 py-6 text-center md:py-7"><dd className="text-3xl font-extrabold tracking-tight" dir="ltr">{item.value}</dd><dt className="text-sm font-medium text-muted-foreground">{item.label}</dt></div>)}
        </dl>
      </div>
    </section>
  )
}
