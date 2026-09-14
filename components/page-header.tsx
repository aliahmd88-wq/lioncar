'use client'

import type { ReactNode } from 'react'
import { Eyebrow } from '@/components/section-heading'

export function PageHeader({
  eyebrow,
  title,
  titleEm,
  lead,
  children,
}: {
  eyebrow: ReactNode
  title: ReactNode
  titleEm?: ReactNode
  lead?: ReactNode
  children?: ReactNode
}) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-secondary/30">
      <div className="pointer-events-none absolute inset-x-0 top-0 hero-grid h-64 opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex max-w-3xl flex-col gap-4">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="text-balance font-serif text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            {title}
            {titleEm ? <span className="text-accent"> {titleEm}</span> : null}
          </h1>
          {lead ? <p className="text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">{lead}</p> : null}
          {children}
        </div>
      </div>
    </section>
  )
}
