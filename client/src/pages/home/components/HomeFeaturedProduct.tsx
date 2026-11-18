import { Link } from 'react-router-dom'
import { ProductAvailabilityBadge } from '@/features/catalog/components/ProductAvailabilityBadge'
import type { HeroItem } from '@/features/catalog/utils/merchandising'
import { ProductImage } from '@/shared/components/media/ProductImage'
import { formatCurrency } from '@/shared/utils/format-currency'

export function HomeFeaturedProduct({ product, loading }: { product?: HeroItem; loading: boolean }) {
  if (loading) return <div aria-hidden="true" className="min-h-40 rounded-xl bg-muted motion-safe:animate-pulse" />
  if (!product?.name.trim()) return null

  return (
    <Link to={`/productos/${product.slug}`} className="group flex min-h-40 min-w-0 flex-wrap items-center gap-4 rounded-xl border bg-card p-4 hover:border-primary focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4 sm:flex-nowrap sm:gap-6">
      <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted sm:size-28">
        <ProductImage src={product.imageUrl} alt={product.name} loading="lazy" />
      </div>
      <div className="min-w-0 flex-1 basis-32 space-y-2">
        <h3 className="text-lg leading-tight font-semibold">{product.name}</h3>
        <p className="font-semibold">{formatCurrency(product.priceSale)}</p>
        <ProductAvailabilityBadge status={product.availabilityStatus} />
      </div>
      <span className="text-sm font-semibold text-primary underline-offset-4 group-hover:underline sm:ml-auto">Ver producto <span aria-hidden="true">→</span></span>
    </Link>
  )
}
