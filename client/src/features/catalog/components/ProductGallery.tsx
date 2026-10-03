import { useState } from 'react'
import type { CatalogProductImage } from '../types/catalog.types'
import { buildCatalogGallery } from '../utils/catalog-gallery'
import { ProductImage } from '@/shared/components/media/ProductImage'

type ProductGalleryProps = { name: string; imageUrl: string | null; gallery: CatalogProductImage[] }

export function ProductGallery(props: ProductGalleryProps) {
  const images = buildCatalogGallery(props)
  const [selectedUrl, setSelectedUrl] = useState<string>()
  const selectedImage = images.find((image) => image.imageUrl === selectedUrl) ?? images[0]

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[5.5rem_minmax(0,1fr)]">
      <div className={`flex aspect-square min-w-0 items-center justify-center overflow-hidden rounded-xl bg-muted ${images.length > 1 ? 'lg:col-start-2 lg:row-start-1' : 'lg:col-span-2'}`}>
        <ProductImage src={selectedImage?.imageUrl ?? null} alt={selectedImage?.alt ?? props.name} loading="eager" />
      </div>
      {images.length > 1 && (
        <div role="group" aria-label="Imágenes del producto" className="flex gap-3 overflow-x-auto p-1 lg:col-start-1 lg:row-start-1 lg:max-h-144 lg:flex-col lg:overflow-y-auto">
          {images.map((image, index) => (
            <button key={image.imageUrl} type="button" aria-label={`Ver imagen ${index + 1}: ${image.alt}`} aria-pressed={selectedImage?.imageUrl === image.imageUrl} onClick={() => setSelectedUrl(image.imageUrl)} className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted p-1 aria-pressed:border-foreground aria-pressed:ring-1 aria-pressed:ring-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2">
              <ProductImage src={image.imageUrl} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
