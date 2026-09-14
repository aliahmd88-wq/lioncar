import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent',
        className,
      )}
    >
      <span className="h-px w-6 bg-accent/60" aria-hidden />
      {children}
    </span>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  titleEm,
  lead,
  align = 'start',
  className,
}: {
  eyebrow?: ReactNode
  title: ReactNode
  titleEm?: ReactNode
  lead?: ReactNode
  align?: 'start' | 'center'
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="text-balance text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
        {title}
        {titleEm ? <span className="text-accent"> {titleEm}</span> : null}
      </h2>
      {lead ? (
        <p
          className={cn(
            'text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg',
            align === 'center' ? 'max-w-2xl' : 'max-w-2xl',
          )}
        >
          {lead}
        </p>
      ) : null}
    </div>
  )
}
