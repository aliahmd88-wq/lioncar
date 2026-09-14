import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2.5 text-sm font-bold uppercase tracking-wider text-foreground',
        className,
      )}
    >
      <span className="h-0.5 w-6 bg-primary" aria-hidden />
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
      <h2 className="text-balance font-sans text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
        {title}
        {titleEm ? <span> {titleEm}</span> : null}
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
