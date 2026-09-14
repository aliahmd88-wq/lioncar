'use client'

import { useState } from 'react'
import { Clock, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'
import { PageHeader } from '@/components/page-header'
import type { StoreSettings } from '@/lib/wp/types'

export function ContactView({ store }: { store: StoreSettings }) {
  const { t } = useLanguage()
  const wa = store.whatsapp.replace(/[^\d]/g, '')

  const [form, setForm] = useState({ name: '', phone: '', subject: 'parts', message: '' })

  const buildMessage = () => {
    const subjectLabel = (t.contact.subjects as Record<string, string>)[form.subject] ?? form.subject
    return [
      `${t.contact.name}: ${form.name}`,
      `${t.contact.phone}: ${form.phone}`,
      `${t.contact.subject}: ${subjectLabel}`,
      '',
      form.message,
    ].join('\n')
  }

  const onWhatsapp = (e: React.FormEvent) => {
    e.preventDefault()
    const url = `https://wa.me/${wa}?text=${encodeURIComponent(buildMessage())}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const onEmail = () => {
    const subjectLabel = (t.contact.subjects as Record<string, string>)[form.subject] ?? form.subject
    const url = `mailto:${store.email}?subject=${encodeURIComponent(subjectLabel)}&body=${encodeURIComponent(buildMessage())}`
    window.location.href = url
  }

  const details = [
    { icon: Phone, label: t.contact.phoneLabel, value: store.phone, href: `tel:${store.phone.replace(/\s/g, '')}`, ltr: true },
    { icon: MessageCircle, label: t.contact.whatsappLabel, value: `+${wa}`, href: `https://wa.me/${wa}`, ltr: true },
    { icon: Mail, label: t.contact.emailLabel, value: store.email, href: `mailto:${store.email}`, ltr: true },
    { icon: MapPin, label: t.contact.addressLabel, value: store.address, href: null, ltr: false },
    { icon: Clock, label: t.contact.hoursLabel, value: store.hours, href: null, ltr: false },
  ]

  const inputClass =
    'w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-accent'

  return (
    <>
      <PageHeader eyebrow={t.contact.eyebrow} title={t.contact.title} titleEm={t.contact.titleEm} lead={t.contact.lead} />

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:px-8">
        <div className="flex flex-col gap-4">
          <ul className="flex flex-col gap-3">
            {details.map((d) => {
              const content = (
                <span className="flex items-center gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-secondary text-accent">
                    <d.icon className="size-5" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{d.label}</span>
                    <span className="block font-semibold" dir={d.ltr ? 'ltr' : undefined}>
                      {d.value}
                    </span>
                  </span>
                </span>
              )
              return (
                <li key={d.label} className="rounded-3xl border border-border bg-card p-4">
                  {d.href ? (
                    <a href={d.href} target={d.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="block transition-opacity hover:opacity-80">
                      {content}
                    </a>
                  ) : (
                    content
                  )}
                </li>
              )
            })}
          </ul>

          <a
            href={`https://wa.me/${wa}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
          >
            <MessageCircle className="size-4" aria-hidden />
            {t.common.whatsapp}
          </a>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
          <h2 className="font-serif text-2xl font-bold">{t.contact.formTitle}</h2>
          <form onSubmit={onWhatsapp} className="mt-6 flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium">{t.contact.name}</span>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder={t.contact.namePlaceholder}
                  className={inputClass}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium">{t.contact.phone}</span>
                <input
                  required
                  type="tel"
                  dir="ltr"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder={t.contact.phonePlaceholder}
                  className={inputClass}
                />
              </label>
            </div>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">{t.contact.subject}</span>
              <select
                value={form.subject}
                onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                className={inputClass}
              >
                {Object.entries(t.contact.subjects).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label as string}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">{t.contact.message}</span>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                placeholder={t.contact.messagePlaceholder}
                className={`${inputClass} resize-none`}
              />
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
              >
                <MessageCircle className="size-4" aria-hidden />
                {t.contact.sendWhatsapp}
              </button>
              <button
                type="button"
                onClick={onEmail}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold transition-colors hover:border-accent hover:text-accent"
              >
                <Send className="size-4" aria-hidden />
                {t.contact.send}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}
