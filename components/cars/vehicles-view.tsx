'use client'

import { useMemo, useState } from 'react'
import { Car } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'
import { PageHeader } from '@/components/page-header'
import { VehicleCard } from '@/components/vehicle-card'
import { Reveal } from '@/components/reveal'
import { VehicleFaq } from '@/components/cars/vehicle-faq'
import { matchesNewCategory, matchesUsedCategory } from '@/lib/wp/vehicles.shared'
import type { Vehicle } from '@/lib/wp/types'
import { cn } from '@/lib/utils'

type Tab = 'new' | 'used'

export function VehiclesView({ importCars, saleCars }: { importCars: Vehicle[]; saleCars: Vehicle[] }) {
  const { t } = useLanguage()
  const [tab, setTab] = useState<Tab>('new')
  const [category, setCategory] = useState('all')

  const newCategories = [
    { key: 'all', label: t.common.all },
    { key: 'trucks', label: t.cars.catTrucks },
    { key: 'work', label: t.cars.catWork },
    { key: 'buses', label: t.cars.catBuses },
    { key: 'cars', label: t.cars.catCars },
    { key: 'taxi', label: t.cars.catTaxi },
  ]
  const usedCategories = [
    { key: 'all', label: t.common.all },
    { key: 'trucks', label: t.cars.usedCatTrucks },
    { key: 'cars', label: t.cars.usedCatCars },
  ]

  const categories = tab === 'new' ? newCategories : usedCategories

  const list = useMemo(() => {
    const source = tab === 'new' ? importCars : saleCars
    if (category === 'all') return source
    return source.filter((v) => (tab === 'new' ? matchesNewCategory(v, category) : matchesUsedCategory(v, category)))
  }, [tab, category, importCars, saleCars])

  const switchTab = (next: Tab) => {
    setTab(next)
    setCategory('all')
  }

  const empty = list.length === 0

  return (
    <>
      <PageHeader eyebrow={t.cars.eyebrow} title={t.cars.title} titleEm={t.cars.titleEm} lead={t.cars.lead} />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Tab switch */}
        <div className="flex flex-col gap-6">
          <div className="inline-flex w-fit rounded-full border border-border bg-card p-1">
            {(['new', 'used'] as Tab[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => switchTab(k)}
                className={cn(
                  'rounded-full px-6 py-2.5 text-sm font-semibold transition-colors',
                  tab === k ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {k === 'new' ? t.cars.tabNew : t.cars.tabUsed}
              </button>
            ))}
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setCategory(c.key)}
                className={cn(
                  'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
                  category === c.key
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-card text-muted-foreground hover:border-primary hover:text-primary',
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {tab === 'new' && category === 'taxi' ? (
          <p className="mt-6 max-w-3xl rounded-2xl bg-secondary/60 p-4 text-sm leading-relaxed text-muted-foreground">
            {t.cars.taxiLead}
          </p>
        ) : null}

        <div className="mt-8">
          {empty ? (
            <div className="rounded-3xl border border-dashed border-border py-20 text-center">
              <Car className="mx-auto size-12 text-muted-foreground" aria-hidden />
              <h2 className="mt-4 font-serif text-2xl font-bold">
                {tab === 'new' ? t.cars.newEmpty : t.cars.saleEmpty}
              </h2>
              <p className="mx-auto mt-2 max-w-md text-muted-foreground">
                {tab === 'new' ? t.cars.newEmptyLead : t.cars.saleEmptyLead}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((vehicle, i) => (
                <Reveal key={vehicle.slug} delay={Math.min(i, 6) * 70}>
                  <VehicleCard vehicle={vehicle} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <VehicleFaq />
    </>
  )
}
