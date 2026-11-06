import { buildCanonical, DEFAULT_OG_IMAGE, getSeoImageUrl, normalizeSeoText, type SeoMetadata } from '@/shared/seo/seo'

type SeoProduct = {
  slug: string; name: string; description: string | null; imageUrl: string | null; priceSale: number
  availabilityStatus: 'in_stock' | 'out_of_stock' | 'on_order'
  gallery: readonly { imageUrl: string }[]
}

export function getSchemaAvailability(status: SeoProduct['availabilityStatus']) {
  if (status === 'in_stock') return 'https://schema.org/InStock'
  if (status === 'out_of_stock') return 'https://schema.org/OutOfStock'
  // Consultation-only orders do not establish a pre-release or back-order policy.
  return undefined
}

export function getProductSeo(product: SeoProduct): SeoMetadata {
  const name = normalizeSeoText(product.name) || 'Producto'
  const description = normalizeSeoText(product.description ?? '') || `Consultá por ${name} en VITRUNO y confirmá precio y disponibilidad por WhatsApp.`
  const canonical = buildCanonical(`/productos/${product.slug}`)
  const images = [...new Set([product.imageUrl, ...product.gallery.map((image) => image.imageUrl)].map((image) => getSeoImageUrl(image, canonical)).filter((url) => url !== undefined))]
  const availability = getSchemaAvailability(product.availabilityStatus)
  const structuredData = {
    '@context': 'https://schema.org', '@type': 'Product', name, description,
    ...(images.length ? { image: images } : {}),
    ...(Number.isFinite(product.priceSale) && product.priceSale >= 0 ? { offers: {
      '@type': 'Offer', priceCurrency: 'ARS', price: product.priceSale, url: canonical,
      ...(availability ? { availability } : {}),
    } } : {}),
  }
  return {
    title: `${name} | VITRUNO`, description: normalizeSeoText(description, 180), canonical,
    robots: 'index,follow', ogType: 'product', ogImage: images[0] ?? DEFAULT_OG_IMAGE,
    imageAlt: images.length ? name : undefined, structuredData,
  }
}

export function getPendingProductSeo(path: string, unavailable = false): SeoMetadata {
  return {
    title: unavailable ? 'Producto no disponible | VITRUNO' : 'Producto | VITRUNO',
    description: 'Consultá los productos de VITRUNO y su disponibilidad.', canonical: buildCanonical(path),
    robots: unavailable ? 'noindex,follow' : 'index,follow',
  }
}
