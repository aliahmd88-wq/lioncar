'use client'

import { Check, Ship, Car, Wrench } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'
import { SectionHeading } from '@/components/section-heading'
import { Reveal } from '@/components/reveal'
import { cn } from '@/lib/utils'

export function HomeServices() {
  const { t } = useLanguage()
  const s = t.home.services

  const scenes = [
    {
      icon: Car,
      kicker: s.scene1Kicker,
      title1: s.scene1Title1,
      title2: s.scene1Title2,
      desc: s.scene1Desc,
      rows: [
        [s.spec1Label, s.spec1Value],
        [s.spec2Label, s.spec2Value],
        [s.spec3Label, s.spec3Value],
        [s.spec4Label, s.spec4Value],
      ],
      panelTitle: s.specSheetTitle,
    },
    {
      icon: Ship,
      kicker: s.scene2Kicker,
      title1: s.scene2Title1,
      title2: s.scene2Title2,
      desc: s.scene2Desc,
      stops: [
        [s.stop1Label, s.stop1Place, s.stop1Meta],
        [s.stop2Label, s.stop2Place, s.stop2Meta],
        [s.stop3Label, s.stop3Place, s.stop3Meta],
        [s.stop4Label, s.stop4Place, s.stop4Meta],
      ],
      panelTitle: s.trackingLabel,
    },
    {
      icon: Wrench,
      kicker: s.scene3Kicker,
      title1: s.scene3Title1,
      title2: s.scene3Title2,
      desc: s.scene3Desc,
      callouts: [s.callout1Label, s.callout2Label, s.callout3Label],
      stock: [s.stock1Name, s.stock2Name, s.stock3Name],
      panelTitle: s.liveInventory,
    },
  ]

  return (
    <section className="border-y border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <SectionHeading eyebrow={s.eyebrow} title={s.title} titleEm={s.titleEm} lead={s.lead} align="center" className="mx-auto items-center" />

        <div className="mt-16 flex flex-col gap-16 lg:gap-24">
          {scenes.map((scene, i) => {
            const reversed = i % 2 === 1
            return (
              <Reveal key={scene.kicker}>
                <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
                  <div className={cn('flex flex-col gap-5', reversed && 'lg:order-2')}>
                    <span className="inline-flex w-fit items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
                      <scene.icon className="size-4" aria-hidden />
                      {scene.kicker}
                    </span>
                    <h3 className="text-balance font-serif text-2xl font-bold leading-tight sm:text-3xl">
                      {scene.title1} <span className="text-accent">{scene.title2}</span>
                    </h3>
                    <p className="text-pretty leading-relaxed text-muted-foreground">{scene.desc}</p>
                  </div>

                  <div className={cn(reversed && 'lg:order-1')}>
                    <div className="rounded-3xl border border-border bg-card p-6 shadow-lg shadow-black/5">
                      <div className="flex items-center justify-between border-b border-border pb-3">
                        <span className="font-serif text-sm font-bold">{scene.panelTitle}</span>
                        <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
                          {s.inStock}
                        </span>
                      </div>

                      {scene.rows ? (
                        <dl className="mt-4 grid gap-3">
                          {scene.rows.map(([label, value]) => (
                            <div key={label} className="flex items-center justify-between gap-4 text-sm">
                              <dt className="text-muted-foreground">{label}</dt>
                              <dd className="font-semibold text-end">{value}</dd>
                            </div>
                          ))}
                        </dl>
                      ) : null}

                      {scene.stops ? (
                        <ol className="mt-4 flex flex-col gap-4">
                          {scene.stops.map(([label, place, meta], idx) => (
                            <li key={label} className="flex gap-3">
                              <div className="flex flex-col items-center">
                                <span className={cn('grid size-6 place-items-center rounded-full text-xs font-bold', idx <= 2 ? 'bg-accent text-accent-foreground' : 'border border-border text-muted-foreground')}>
                                  {idx + 1}
                                </span>
                                {idx < 3 ? <span className="mt-1 h-8 w-px bg-border" aria-hidden /> : null}
                              </div>
                              <div className="pb-1">
                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
                                <p className="font-semibold">{place}</p>
                                <p className="text-xs text-muted-foreground">{meta}</p>
                              </div>
                            </li>
                          ))}
                        </ol>
                      ) : null}

                      {scene.stock ? (
                        <ul className="mt-4 flex flex-col gap-2">
                          {scene.stock.map((name) => (
                            <li key={name} className="flex items-center justify-between gap-3 rounded-2xl bg-secondary/70 px-4 py-3 text-sm">
                              <span className="flex items-center gap-2 font-medium">
                                <Check className="size-4 text-accent" aria-hidden />
                                {name}
                              </span>
                              <span className="text-xs font-semibold text-accent">{s.inStock}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
