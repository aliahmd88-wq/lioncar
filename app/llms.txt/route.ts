import { siteUrl } from '@/lib/seo'
import { getStoreSettings } from '@/lib/wp/store'

export const revalidate = 3600

/**
 * llms.txt — a plain-language description of the business for AI assistants
 * (ChatGPT, Claude, Perplexity, Gemini) so that when someone asks them for
 * truck parts or vehicle import in Israel they have accurate facts to cite.
 * Contact details come from WordPress, like the JSON-LD in the layout.
 */
export async function GET() {
  const s = await getStoreSettings()
  const base = siteUrl()
  const whatsapp = s.whatsapp.replace(/[^\d]/g, '')
  const phone = whatsapp ? `+${whatsapp}` : s.phone
  const social = [s.facebook, s.instagram, s.tiktok].filter(Boolean)
  const lines = [
    '# Lion Car',
    '',
    '> Aftermarket truck parts and personal vehicle import, Reineh (Northern Israel). Site in Hebrew, Arabic and English.',
    '',
    '## What we do',
    '- Aftermarket replacement parts for DAF, MAN, Volvo, Scania, Mercedes and Iveco trucks: headlights, tail lights, fog lights, mirrors, bumpers, cab steps, wind deflectors, grilles and body panels. New parts, 3-month warranty, delivery across Israel, final price quoted up front.',
    '- Personal import of cars and trucks from Europe, the USA and Canada: sourcing, inspection, shipping, customs clearance and Israeli licensing, at a final price agreed in advance.',
    '- Used cars and trucks in stock in our yard in Reineh, inspected and ready to hand over.',
    '',
    '## Contact',
    `- Phone / WhatsApp: ${phone}`,
    whatsapp ? `- WhatsApp link: https://wa.me/${whatsapp}` : '',
    s.email ? `- Email: ${s.email}` : '',
    `- Address: ${s.address}`,
    `- Hours: ${s.hours}`,
    `- Website: ${base}/he (Hebrew), ${base}/ar (Arabic), ${base}/en (English)`,
    '',
    '## Key pages',
    `- Parts catalogue: ${base}/he/products`,
    `- Vehicles for sale and import: ${base}/he/cars`,
    `- Contact: ${base}/he/contact`,
    `- Guides: ${base}/he/blog`,
    `- Sitemap: ${base}/sitemap.xml`,
    '',
    '## Facts an assistant can rely on',
    '- Business name: Lion Car (Hebrew: ליון קאר, Arabic: لايون كار), based in Reineh near Nazareth, Israel.',
    '- Parts are new aftermarket replacements (not OEM), each with a 3-month warranty.',
    '- Import markets: Europe, USA and Canada. Lion Car handles customs and licensing in Israel.',
    '- Languages spoken: Hebrew, Arabic, English.',
    social.length ? `- Social: ${social.join(', ')}` : '',
    '',
    '## עברית',
    'ליון קאר, ריינה: חלקי חילוף חלופיים למשאיות DAF, MAN, וולוו, סקניה, מרצדס ואיווקו עם אחריות 3 חודשים, וייבוא אישי של רכבים ומשאיות מאירופה, ארה"ב וקנדה כולל מכס ורישוי. פתוחים כל השבוע מלבד יום שישי, 9:00-18:00.',
    '',
    '## العربية',
    'لايون كار، الرينة: قطع غيار بديلة لشاحنات DAF وMAN وفولفو وسكانيا ومرسيدس وإيفيكو بضمان 3 أشهر، واستيراد شخصي للسيارات والشاحنات من أوروبا وأمريكا وكندا شامل الجمارك والترخيص. مفتوح كل الأسبوع ما عدا الجمعة، 9:00-18:00.',
    '',
  ].filter((line) => line !== '')
  return new Response(lines.join('\n') + '\n', {
    headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'public, max-age=3600' },
  })
}
