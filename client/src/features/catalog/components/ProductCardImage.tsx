import { useState } from 'react'
import { ProductImage } from '@/shared/components/media/ProductImage'
import type { ProductAvailabilityStatus } from '../types/catalog.types'
import { LastUnitBadge } from './LastUnitBadge'

function SecondaryImage({ src }: { src: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) return null
  return <img src={src} alt="" aria-hidden="true" loading="lazy" onError={() => setFailed(true)} className="product-card-secondary absolute inset-0 h-full w-full bg-muted object-contain" />
}

export function ProductCardImage({ imageUrl, secondaryImageUrl, name, availabilityStatus, stockAvailable }: {
  imageUrl: string | null; secondaryImageUrl: string | null; name: string; availabilityStatus: ProductAvailabilityStatus; stockAvailable: number
}) {
  const [loadedSecondary, setLoadedSecondary] = useState<string>()
  return (
    <div onPointerEnter={(event) => { if (event.pointerType === 'mouse' || event.pointerType === 'pen') setLoadedSecondary(secondaryImageUrl ?? undefined) }} className="product-card-image relative flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-muted">
      <ProductImage src={imageUrl} alt={name} loading="lazy" />
      {secondaryImageUrl && loadedSecondary === secondaryImageUrl && secondaryImageUrl !== imageUrl && <SecondaryImage key={secondaryImageUrl} src={secondaryImageUrl} />}
      {availabilityStatus === 'out_of_stock' && <span className="pointer-events-none absolute right-3 top-3 z-10 rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-primary-foreground">AGOTADO</span>}
      <LastUnitBadge availabilityStatus={availabilityStatus} stockAvailable={stockAvailable} className="pointer-events-none absolute right-3 top-3 z-10" />
    </div>
  )
}
