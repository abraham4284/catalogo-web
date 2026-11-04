export const SEO_ORIGIN = 'https://vitruno.com.ar'
export const DEFAULT_OG_IMAGE = `${SEO_ORIGIN}/og-image-v2.png`

export type SeoMetadata = {
  title: string
  description: string
  canonical: string
  robots?: 'index,follow' | 'noindex,follow'
  ogType?: 'website' | 'product'
  ogImage?: string
  imageAlt?: string
  structuredData?: Record<string, unknown>
}

export function buildCanonical(pathname: string) {
  const path = pathname.split(/[?#]/)[0]
  if (!path.startsWith('/') || path.startsWith('//') || path.includes('\\')) throw new Error('Expected a local pathname')
  return `${SEO_ORIGIN}${path.replace(/\/+$/, '') || '/'}`
}

export function normalizeSeoText(value: string, limit?: number) {
  const text = value.replace(/\s+/g, ' ').trim()
  const characters = Array.from(text)
  return limit && characters.length > limit ? `${characters.slice(0, limit - 1).join('').trimEnd()}…` : text
}

export function getSeoImageUrl(value: string | null | undefined, baseUrl = `${SEO_ORIGIN}/`): string | undefined {
  if (!value?.trim()) return undefined
  try {
    const url = new URL(value.trim(), baseUrl)
    return /^https?:$/.test(url.protocol) && !url.username && !url.password ? url.href : undefined
  } catch { return undefined }
}

export function serializeStructuredData(data: Record<string, unknown>) {
  return JSON.stringify(data).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029')
}
