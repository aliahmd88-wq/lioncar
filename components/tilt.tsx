"use client"

import { useRef, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

export function Tilt({
  children,
  className,
  max = 8,
}: {
  children: ReactNode
  className?: string
  max?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState<React.CSSProperties>({})

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    setStyle({
      transform: `perspective(900px) rotateX(${-py * max}deg) rotateY(${px * max}deg) scale(1.02)`,
    })
  }

  function reset() {
    setStyle({ transform: "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)" })
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={style}
      className={cn("transition-transform duration-200 ease-out [transform-style:preserve-3d]", className)}
    >
      {children}
    </div>
  )
}
