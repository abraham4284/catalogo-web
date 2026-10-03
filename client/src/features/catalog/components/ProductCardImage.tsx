import { useState } from 'react'
import { ProductImage } from '@/shared/components/media/ProductImage'

function SecondaryImage({ src }: { src: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) return null
  return <img src={src} alt="" aria-hidden="true" loading="lazy" onError={() => setFailed(true)} className="product-card-secondary absolute inset-0 h-full w-full bg-muted object-contain" />
}

export function ProductCardImage({ imageUrl, secondaryImageUrl, name }: {
  imageUrl: string | null; secondaryImageUrl: string | null; name: string
}) {
  const [loadedSecondary, setLoadedSecondary] = useState<string>()
  return (
    <div onPointerEnter={(event) => { if (event.pointerType === 'mouse' || event.pointerType === 'pen') setLoadedSecondary(secondaryImageUrl ?? undefined) }} className="product-card-image relative flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-muted">
      <ProductImage src={imageUrl} alt={name} loading="lazy" />
      {secondaryImageUrl && loadedSecondary === secondaryImageUrl && secondaryImageUrl !== imageUrl && <SecondaryImage key={secondaryImageUrl} src={secondaryImageUrl} />}
    </div>
  )
}
