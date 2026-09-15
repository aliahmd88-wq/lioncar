'use client'

import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'

// First scene: the moving car — personal / premium car import.
// Second scene: the port — direct import.
const SCENES = [
  { src: '/videos/scene-showroom.mp4', poster: '/images/hero-scene-showroom-poster.png' },
  { src: '/videos/scene-port.mp4', poster: '/images/hero-scene-port-poster.png' },
] as const

// Each scene plays alone for this long before switching to the next.
const SCENE_MS = 8000
// The switch fades the current scene out to black, then the next one in,
// so the two videos are never blended on top of each other.
const FADE_MS = 700

export function HeroVideoBackground() {
  const { t } = useLanguage()
  const [useVideo, setUseVideo] = useState(false)
  const [active, setActive] = useState(0)
  const [visible, setVisible] = useState(true)
  const [paused, setPaused] = useState(false)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  // Decide between video and static poster based on viewport and motion preference.
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mobile = window.matchMedia('(max-width: 767px)')
    const update = () => setUseVideo(!motion.matches && !mobile.matches)
    update()
    motion.addEventListener('change', update)
    mobile.addEventListener('change', update)
    return () => {
      motion.removeEventListener('change', update)
      mobile.removeEventListener('change', update)
    }
  }, [])

  // Switch scenes one at a time: fade the current one out to black, then
  // bring the next one in. The two videos are never shown together.
  useEffect(() => {
    if (!useVideo || paused) return
    let fadeTimer: number
    const interval = window.setInterval(() => {
      setVisible(false)
      fadeTimer = window.setTimeout(() => {
        setActive((current) => (current + 1) % SCENES.length)
        setVisible(true)
      }, FADE_MS)
    }, SCENE_MS)
    return () => {
      window.clearInterval(interval)
      window.clearTimeout(fadeTimer)
    }
  }, [useVideo, paused])

  // Keep playback state in sync with the pause control.
  useEffect(() => {
    if (!useVideo) return
    videoRefs.current.forEach((video) => {
      if (!video) return
      if (paused) video.pause()
      else void video.play().catch(() => {})
    })
  }, [useVideo, paused, active])

  return (
    <div className="absolute inset-0 overflow-hidden bg-secondary" aria-hidden={!useVideo}>
      {useVideo ? (
        SCENES.map((scene, i) => (
          <video
            key={scene.src}
            ref={(node) => {
              videoRefs.current[i] = node
            }}
            className="absolute inset-0 size-full object-cover transition-opacity ease-in-out"
            style={{ opacity: i === active && visible ? 1 : 0, transitionDuration: `${FADE_MS}ms` }}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={scene.poster}
          >
            <source src={scene.src} type="video/mp4" />
          </video>
        ))
      ) : (
        <img
          src={SCENES[0].poster || '/placeholder.svg'}
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
      )}

      {/* Black-to-transparent gradient keeps the white title readable over any frame, in both LTR and RTL. */}
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/40" />

      {useVideo && (
        <button
          type="button"
          onClick={() => setPaused((value) => !value)}
          aria-label={paused ? t.home.heroPlay : t.home.heroPause}
          className="absolute bottom-4 end-4 z-10 inline-flex size-10 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur transition hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          {paused ? <Play className="size-4" aria-hidden /> : <Pause className="size-4" aria-hidden />}
        </button>
      )}
    </div>
  )
}
