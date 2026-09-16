import Image from 'next/image'
import { cn } from '@/lib/utils'

export function LionMark() {
  return <Image src="/brand/lion-logo.png" alt="" width={34} height={48} className="h-12 w-auto shrink-0 object-contain" priority />
}

export function BrandLogo({ inverse = false, compact = false }: { inverse?: boolean; compact?: boolean }) {
  return (
    <span dir="ltr" className="inline-flex shrink-0 items-center gap-2.5">
      <LionMark />
      <span className={cn('font-sans font-black leading-none tracking-tight', compact ? 'text-xl' : 'text-2xl', inverse ? 'text-inverse-foreground' : 'text-foreground')}>
        LION<span className="text-primary">CAR</span>
      </span>
    </span>
  )
}
