import type { CatalogProductImage } from '../types/catalog.types'

type GalleryInput = { name: string; imageUrl: string | null; gallery: CatalogProductImage[] }
export type CatalogGalleryImage = { imageUrl: string; alt: string }

export function buildCatalogGallery({ name, imageUrl, gallery }: GalleryInput): CatalogGalleryImage[] {
  const images: CatalogGalleryImage[] = []
  const seen = new Set<string>()
  if (imageUrl) {
    images.push({ imageUrl, alt: name })
    seen.add(imageUrl)
  }
  for (const image of [...gallery].sort((left, right) => left.sortOrder - right.sortOrder)) {
    if (!image.imageUrl || seen.has(image.imageUrl)) continue
    images.push({ imageUrl: image.imageUrl, alt: image.altText?.trim() || name })
    seen.add(image.imageUrl)
  }
  return images
}
