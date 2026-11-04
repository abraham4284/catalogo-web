import { DEFAULT_OG_IMAGE, serializeStructuredData, type SeoMetadata } from './seo'

function upsertMeta(attribute: 'name' | 'property', key: string, content?: string) {
  const matches = [...document.head.querySelectorAll<HTMLMetaElement>(`meta[${attribute}="${key}"]`)]
  const first = matches.shift()
  matches.forEach((node) => node.remove())
  if (content === undefined) { first?.remove(); return }
  const meta = first ?? document.createElement('meta')
  meta.setAttribute(attribute, key)
  meta.content = content
  if (!first) document.head.append(meta)
}

export function applySeo(metadata: SeoMetadata) {
  const image = metadata.ogImage ?? DEFAULT_OG_IMAGE
  const alt = metadata.imageAlt ?? 'VITRUNO — Buenas elecciones, todos los días.'
  document.title = metadata.title
  for (const [name, content] of Object.entries({
    description: metadata.description, robots: metadata.robots ?? 'index,follow',
    'twitter:card': 'summary_large_image', 'twitter:title': metadata.title,
    'twitter:description': metadata.description, 'twitter:image': image, 'twitter:image:alt': alt,
  })) upsertMeta('name', name, content)
  for (const [property, content] of Object.entries({
    'og:title': metadata.title, 'og:description': metadata.description, 'og:url': metadata.canonical,
    'og:type': metadata.ogType ?? 'website', 'og:image': image, 'og:image:alt': alt,
    'og:image:width': image === DEFAULT_OG_IMAGE ? '1200' : undefined,
    'og:image:height': image === DEFAULT_OG_IMAGE ? '630' : undefined,
  })) upsertMeta('property', property, content)

  const canonicals = [...document.head.querySelectorAll<HTMLLinkElement>('link[rel="canonical"]')]
  const canonical = canonicals.shift() ?? document.createElement('link')
  canonicals.forEach((node) => node.remove())
  canonical.rel = 'canonical'
  canonical.href = metadata.canonical
  if (!canonical.isConnected) document.head.append(canonical)

  const existing = document.getElementById('product-jsonld')
  if (!metadata.structuredData) { existing?.remove(); return }
  const script = existing ?? document.createElement('script')
  script.id = 'product-jsonld'
  script.setAttribute('type', 'application/ld+json')
  script.textContent = serializeStructuredData(metadata.structuredData)
  if (!existing) document.head.append(script)
}
