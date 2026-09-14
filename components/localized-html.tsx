import { cn } from '@/lib/utils'

/**
 * Renders a WordPress description. Hebrew comes back as sanitized HTML from
 * WooCommerce; the Arabic/English ACF fields are plain text. We detect a tag
 * and render accordingly.
 */
export function LocalizedHtml({ value, className }: { value: string; className?: string }) {
  if (!value) return null
  const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(value)
  if (looksLikeHtml) {
    return (
      <div
        className={cn('prose-leon', className)}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    )
  }
  return (
    <div className={cn('prose-leon whitespace-pre-line', className)}>
      {value}
    </div>
  )
}
