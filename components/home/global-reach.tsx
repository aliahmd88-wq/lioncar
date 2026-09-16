'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Globe2, Plane, Ship, ShieldCheck, Truck } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'
import { SectionHeading } from '@/components/section-heading'
import { cn } from '@/lib/utils'

type GlobeController = ReturnType<(typeof import('cobe'))['default']>

function locationToAngles(lat: number, lng: number): [number, number] {
  return [Math.PI - ((lng * Math.PI) / 180 - Math.PI / 2), (lat * Math.PI) / 180]
}

/** Continuous rotation only on desktops that did not ask for less motion. */
function canAnimate() {
  if (typeof window === 'undefined') return false
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } }
  return window.matchMedia('(min-width: 1024px)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && !nav.connection?.saveData
}

/**
 * The rotating globe from ALI FLEET: the three import steps on one side, a
 * WebGL globe on the other that turns on its own, swings to the relevant city
 * when a step is hovered, and can be dragged. Colours follow Lion Car: dark
 * land, gold markers on the import markets and on Haifa.
 */
export function GlobalReach() {
  const { t } = useLanguage()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const phiRef = useRef(locationToAngles(31.0, 35.0)[0])
  const thetaRef = useRef(0.3)
  const focusRef = useRef<[number, number] | null>(null)
  const drag = useRef({ active: false, startX: 0, startOffset: 0, offset: 0, target: 0 })
  const [activeCity, setActiveCity] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  const steps = [
    { icon: Globe2, title: t.import.step1Title, text: t.import.step1Desc, city: 'Berlin', lat: 52.52, lng: 13.405 },
    { icon: ShieldCheck, title: t.import.step3Title, text: t.import.step3Desc, city: 'New York', lat: 40.7128, lng: -74.006 },
    { icon: Truck, title: t.import.step4Title, text: t.import.step4Desc, city: 'Haifa', lat: 32.794, lng: 34.9896 },
  ]

  const focusCity = useCallback((lat: number, lng: number, city: string) => {
    focusRef.current = locationToAngles(lat, lng)
    setActiveCity(city)
  }, [])
  const releaseFocus = useCallback(() => {
    focusRef.current = null
    setActiveCity(null)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const wrapper = wrapperRef.current
    if (!canvas || !wrapper) return

    let disposed = false
    let globe: GlobeController | null = null
    let raf = 0
    let visible = false
    const animate = canAnimate()
    let width = Math.max(wrapper.offsetWidth, 1)
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

    const draw = () => {
      if (!globe) return
      const d = drag.current
      d.offset += (d.target - d.offset) * 0.12
      const focus = focusRef.current
      if (focus) {
        const [targetPhi, targetTheta] = focus
        const current = phiRef.current + d.offset
        const a = (targetPhi - current) % (Math.PI * 2)
        const b = a - Math.PI * 2 * Math.sign(a)
        phiRef.current += (Math.abs(a) < Math.abs(b) ? a : b) * 0.08
        thetaRef.current += (targetTheta * 0.9 - thetaRef.current) * 0.08
      } else {
        if (!d.active && animate) phiRef.current += 0.004
        thetaRef.current += (0.3 - thetaRef.current) * 0.05
      }
      const size = Math.round(width * dpr)
      globe.update({ phi: phiRef.current + d.offset, theta: thetaRef.current, width: size, height: size })
    }
    const tick = () => {
      raf = 0
      if (disposed || !visible || document.hidden) return
      draw()
      raf = requestAnimationFrame(tick)
    }
    const start = () => {
      if (!raf && globe && visible && !document.hidden) raf = requestAnimationFrame(tick)
    }
    const stop = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) start()
        else stop()
      },
      { rootMargin: '200px 0px' },
    )
    const ro = new ResizeObserver(() => {
      width = Math.max(wrapper.offsetWidth, 1)
    })
    const onVisibility = () => (document.hidden ? stop() : start())
    const onDown = (e: PointerEvent) => {
      drag.current.active = true
      drag.current.startX = e.clientX
      drag.current.startOffset = drag.current.target
      canvas.style.cursor = 'grabbing'
    }
    const onMove = (e: PointerEvent) => {
      if (!drag.current.active) return
      drag.current.target = drag.current.startOffset + (e.clientX - drag.current.startX) / 200
    }
    const onUp = () => {
      drag.current.active = false
      canvas.style.cursor = 'grab'
    }

    const init = async () => {
      try {
        const { default: createGlobe } = await import('cobe')
        if (disposed) return
        const size = Math.round(width * dpr)
        globe = createGlobe(canvas, {
          devicePixelRatio: dpr,
          width: size,
          height: size,
          phi: phiRef.current,
          theta: thetaRef.current,
          dark: 0,
          diffuse: 1.1,
          mapSamples: 9000,
          mapBrightness: 5,
          baseColor: [0.18, 0.18, 0.19],
          markerColor: [0.83, 0.65, 0.17],
          glowColor: [1, 1, 1],
          markers: [
            { location: [32.794, 34.9896], size: 0.09 },
            { location: [52.52, 13.405], size: 0.06 },
            { location: [40.7128, -74.006], size: 0.06 },
            { location: [43.6532, -79.3832], size: 0.05 },
          ],
        })
        draw()
        setReady(true)
        io.observe(wrapper)
        ro.observe(wrapper)
        document.addEventListener('visibilitychange', onVisibility)
        canvas.addEventListener('pointerdown', onDown)
        window.addEventListener('pointermove', onMove)
        window.addEventListener('pointerup', onUp)
      } catch {
        /* WebGL unavailable: the rings and chips still draw the composition. */
      }
    }
    const idle = typeof window.requestIdleCallback === 'function' ? window.requestIdleCallback(() => void init(), { timeout: 1500 }) : window.setTimeout(() => void init(), 300)

    return () => {
      disposed = true
      stop()
      if (typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(idle as number)
      window.clearTimeout(idle as number)
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      canvas.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      globe?.destroy()
    }
  }, [])

  return (
    <section id="importing" className="overflow-hidden border-t border-border py-20 md:py-28">
      <div className="site-container">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 flex flex-col gap-8 lg:order-1">
            <SectionHeading eyebrow={t.import.eyebrow} title={t.import.title} titleEm={t.import.titleEm} lead={t.import.lead} />
            <ul className="flex flex-col divide-y divide-border border-y border-border">
              {steps.map((step) => {
                const isActive = activeCity === step.city
                return (
                  <li key={step.title}>
                    <button
                      type="button"
                      onMouseEnter={() => focusCity(step.lat, step.lng, step.city)}
                      onMouseLeave={releaseFocus}
                      onFocus={() => focusCity(step.lat, step.lng, step.city)}
                      onBlur={releaseFocus}
                      className={cn('group flex w-full items-start gap-4 px-2 py-5 text-start transition-colors duration-300', isActive ? 'bg-secondary' : 'bg-transparent')}
                    >
                      <span className={cn('flex size-11 shrink-0 items-center justify-center rounded-full transition-all duration-300', isActive ? 'scale-110 bg-primary text-primary-foreground' : 'bg-primary/10 text-primary')}>
                        <step.icon className="size-5" aria-hidden />
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col gap-1">
                        <span className={cn('font-bold transition-colors', isActive ? 'text-primary' : 'text-foreground')}>{step.title}</span>
                        <span className="text-sm leading-relaxed text-muted-foreground">{step.text}</span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="order-1 flex items-center justify-center lg:order-2">
            <div className="relative aspect-square w-[min(620px,92vw)] md:w-[560px] lg:w-[640px]">
              <svg className="orbit-ring pointer-events-none absolute inset-0 h-full w-full text-primary/30" viewBox="0 0 100 100" aria-hidden>
                <circle cx="50" cy="50" r="49" fill="none" stroke="currentColor" strokeWidth="0.4" strokeDasharray="2 3" />
              </svg>
              <svg className="orbit-ring-2 pointer-events-none absolute inset-[8%] h-[84%] w-[84%] text-border" viewBox="0 0 100 100" aria-hidden>
                <circle cx="50" cy="50" r="49" fill="none" stroke="currentColor" strokeWidth="0.3" strokeDasharray="1 6" />
              </svg>
              <div className="satellite-track pointer-events-none absolute inset-0" aria-hidden>
                <div className="satellite absolute left-1/2 top-0 flex size-9 -translate-x-1/2 items-center justify-center rounded-full border border-border bg-background/90 text-primary shadow-sm backdrop-blur-md">
                  <Plane className="size-4" />
                </div>
                <div className="satellite absolute bottom-0 left-1/2 flex size-9 -translate-x-1/2 items-center justify-center rounded-full border border-border bg-background/90 text-primary shadow-sm backdrop-blur-md">
                  <Ship className="size-4" />
                </div>
              </div>

              <div ref={wrapperRef} role="img" aria-label={t.home.globeCountries} className="absolute inset-[1%]" style={{ contain: 'layout paint size' }}>
                <canvas ref={canvasRef} className={cn('relative h-full w-full transition-opacity duration-700', ready ? 'cursor-grab opacity-100' : 'opacity-0')} style={{ aspectRatio: '1' }} aria-hidden />
                <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(circle at center, transparent 0%, transparent 70%, color-mix(in srgb, var(--background) 40%, transparent) 86%, var(--background) 99%)' }} aria-hidden />
              </div>

              <div className="globe-chip absolute -left-2 top-[18%] flex items-center gap-2 rounded-full border border-border bg-background/85 px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm backdrop-blur-md md:-left-6">
                <span className="size-2 rounded-full bg-primary" aria-hidden />
                {t.home.globeCountries}
              </div>
              <div className="globe-chip absolute -right-2 top-[62%] flex items-center gap-2 rounded-full border border-border bg-background/85 px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm backdrop-blur-md md:-right-6">
                <span className="size-2 animate-pulse rounded-full bg-primary" aria-hidden />
                {t.home.globeTracking}
              </div>
              {activeCity ? (
                <div className="pointer-events-none absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full border border-border bg-background/90 px-4 py-1.5 text-sm font-semibold text-foreground shadow-sm backdrop-blur-md" dir="ltr">
                  {activeCity}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
