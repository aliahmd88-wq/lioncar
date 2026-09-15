'use client'

import { useEffect, useRef } from 'react'
import { ArrowUpRight, Check } from 'lucide-react'
import Link from '@/components/localized-link'
import { useLanguage } from '@/lib/i18n/context'

/**
 * The full-screen video chapters from ALI FLEET, in its order: 01 the
 * showroom (personal import), 02 the port (direct import and shipping).
 * Each chapter sticks to the top while the next slides over it; only the
 * chapter on screen plays its video, the rest stay paused on their poster.
 */
export function HomeScenes({ count = 2 }: { count?: 1 | 2 }) {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const s = t.home.services

  const scenes = [
    {
      video: '/videos/scene-showroom.mp4',
      poster: '/images/hero-scene-showroom-poster.png',
      kicker: s.scene1Kicker,
      title1: s.scene1Title1,
      title2: s.scene1Title2,
      description: s.scene1Desc,
      href: '/cars',
      cta: t.nav.cars,
      panelTitle: s.specSheetTitle,
      rows: [
        { label: s.spec1Label, value: s.spec1Value },
        { label: s.spec2Label, value: s.spec2Value },
        { label: s.spec3Label, value: s.spec3Value },
        { label: s.spec4Label, value: s.spec4Value },
      ],
      stats: [
        { value: '100+', label: s.stat1Label },
        { value: '3', label: s.stat2Label },
        { value: '100%', label: s.stat3Label },
      ],
    },
    {
      video: '/videos/scene-port.mp4',
      poster: '/images/hero-scene-port-poster.png',
      kicker: s.scene2Kicker,
      title1: s.scene2Title1,
      title2: s.scene2Title2,
      description: s.scene2Desc,
      href: '/contact',
      cta: t.common.sendRequest,
      panelTitle: s.trackingLabel,
      stops: [s.stop1Label, s.stop2Label, s.stop3Label, s.stop4Label],
    },
  ].slice(0, count)

  // Play only the chapter that is mostly on screen.
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const videos = Array.from(section.querySelectorAll<HTMLVideoElement>('[data-scene-video]'))
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const video = entry.target as HTMLVideoElement
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5 && !reduced && !document.hidden) void video.play().catch(() => {})
          else video.pause()
        }
      },
      { threshold: [0, 0.5, 1] },
    )
    videos.forEach((video) => io.observe(video))
    return () => io.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="scenes" aria-label={s.eyebrow} className="relative bg-black text-white">
      {scenes.map((scene, index) => (
        <div key={scene.video}>
          <article className="sticky top-0 flex h-svh items-end overflow-hidden md:items-center" style={{ zIndex: index + 1 }}>
            <video data-scene-video src={scene.video} poster={scene.poster} muted loop playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover" aria-hidden />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/15 rtl:bg-gradient-to-l" aria-hidden />
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/70 to-transparent" aria-hidden />

            <div className="site-container relative z-10 pb-20 md:pb-0 [@media(max-height:700px)]:scale-[0.85] [@media(max-height:700px)]:origin-bottom">
              <div className="grid gap-10 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:items-center">
                <div className="flex flex-col gap-5">
                  <p className="flex items-baseline gap-4">
                    <span className="text-6xl font-extrabold leading-none text-primary md:text-8xl" dir="ltr">
                      0{index + 1}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-[0.25em] text-white/70">{scene.kicker}</span>
                  </p>
                  <h2 className="text-balance text-3xl font-extrabold leading-tight md:text-5xl">
                    {scene.title1} <span className="text-primary">{scene.title2}</span>
                  </h2>
                  <p className="max-w-xl text-pretty leading-relaxed text-white/80">{scene.description}</p>
                  <Link href={scene.href} className="action-primary w-fit">
                    {scene.cta}
                    <ArrowUpRight className="size-4 flip-x" aria-hidden />
                  </Link>
                </div>

                <div className="hidden rounded-2xl border border-white/15 bg-black/45 p-6 backdrop-blur-md md:block">
                  <p className="text-xs font-bold uppercase tracking-wider text-white/60">{scene.panelTitle}</p>
                  {'rows' in scene && scene.rows ? (
                    <>
                      <dl className="mt-4 divide-y divide-white/10">
                        {scene.rows.map((row) => (
                          <div key={row.label} className="flex items-baseline justify-between gap-4 py-2.5 text-sm">
                            <dt className="text-white/60">{row.label}</dt>
                            <dd className="font-bold">{row.value}</dd>
                          </div>
                        ))}
                      </dl>
                      <div className="mt-5 grid grid-cols-3 gap-3 border-t border-white/10 pt-5">
                        {scene.stats?.map((stat) => (
                          <div key={stat.label}>
                            <p className="text-2xl font-extrabold text-primary" dir="ltr">
                              {stat.value}
                            </p>
                            <p className="mt-1 text-xs text-white/70">{stat.label}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : null}
                  {'stops' in scene && scene.stops ? (
                    <ol className="mt-4 flex flex-col gap-3">
                      {scene.stops.map((stop, i) => (
                        <li key={stop} className="flex items-center gap-3 text-sm">
                          <span className={i < 2 ? 'grid size-6 place-items-center rounded-full bg-primary text-primary-foreground' : 'grid size-6 place-items-center rounded-full border border-white/40 text-white/60'}>
                            {i < 2 ? <Check className="size-3.5" aria-hidden /> : <span className="text-[10px] font-bold" dir="ltr">{i + 1}</span>}
                          </span>
                          <span className={i < 2 ? 'font-bold' : 'text-white/70'}>{stop}</span>
                        </li>
                      ))}
                    </ol>
                  ) : null}
                </div>
              </div>

              <p className="mt-10 text-xs font-bold tracking-[0.3em] text-white/60" dir="ltr">
                0{index + 1} / 0{scenes.length}
              </p>
            </div>
          </article>
          {index < scenes.length - 1 ? <div className="h-[35svh]" aria-hidden /> : null}
        </div>
      ))}
    </section>
  )
}
