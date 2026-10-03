import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import type { CatalogProductListItem } from '../types/catalog.types'
import { formatCurrency } from '@/shared/utils/format-currency'
import { ProductCardImage } from './ProductCardImage'
import { getCatalogAvailabilityLabel } from '../utils/catalog-availability'

export function ProductCard({ product, actions }: { product: CatalogProductListItem; actions?: ReactNode }) {
  const description = product.description?.trim()
  return (
    <article className="flex h-full min-w-0 flex-col gap-4">
      <Link to={`/productos/${product.slug}`} aria-label={`Ver ${product.name}`} className="block focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4">
        <ProductCardImage imageUrl={product.imageUrl} secondaryImageUrl={product.secondaryImageUrl} name={product.name} />
      </Link>
      <div className="space-y-2 break-words">
        <p className="text-xs text-muted-foreground">{product.category.name}</p>
        <h3 className="font-medium"><Link to={`/productos/${product.slug}`} className="hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring">{product.name}</Link></h3>
        {description && <p className="line-clamp-3 text-sm text-muted-foreground">{product.description}</p>}
        <p className="font-semibold">{formatCurrency(product.price)}</p>
        <p className="text-sm text-muted-foreground">{getCatalogAvailabilityLabel(product.availabilityStatus)}</p>
      </div>
      {actions && <div className="mt-auto pt-1">{actions}</div>}
    </article>
  )
}
