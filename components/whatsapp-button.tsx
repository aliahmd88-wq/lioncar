'use client'

import { MessageCircle } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'

export function WhatsAppButton({ whatsapp }: { whatsapp: string }) {
  const { t } = useLanguage()
  const num = whatsapp.replace(/[^\d]/g, '')
  const href = `https://wa.me/${num}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.common.whatsapp}
      className="group fixed bottom-5 end-5 z-30 flex min-h-12 items-center gap-2 rounded-full border border-inverse-foreground/15 bg-inverse px-4 py-3 text-sm font-semibold text-inverse-foreground shadow-xl transition-colors hover:bg-primary hover:text-primary-foreground"
    >
      <MessageCircle className="size-5" aria-hidden />
      <span className="hidden sm:inline">{t.common.whatsapp}</span>
    </a>
  )
}
