import { Link } from 'react-router-dom'
import type { CatalogProductDetail } from '../types/catalog.types'
import { formatCurrency } from '@/shared/utils/format-currency'
import type { ReactNode } from 'react'
import { getCatalogHref } from '../utils/catalog-url'
import { ProductGallery } from './ProductGallery'
import { ProductRichContentRenderer } from './ProductRichContentRenderer'
import { getCatalogAvailabilityLabel } from '../utils/catalog-availability'

export function ProductDetail({ product, actions }: { product: CatalogProductDetail; actions?: ReactNode }) {
  const description = product.description?.trim()
  return (
    <div className="min-w-0 space-y-12">
      <div className="grid min-w-0 gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery key={product.idProduct} name={product.name} imageUrl={product.imageUrl} gallery={product.gallery} />
        <div className="min-w-0 space-y-6 break-words">
          <Link to={getCatalogHref({ page: 1, categorySlug: product.category.slug })} className="inline-block text-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4">{product.category.name}</Link>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{product.name}</h1>
          <p className="text-2xl font-semibold">{formatCurrency(product.price)}</p>
          <p className="text-muted-foreground">{getCatalogAvailabilityLabel(product.availabilityStatus)}</p>
          {description && <p className="max-w-prose whitespace-pre-line text-muted-foreground">{product.description}</p>}
          {product.availabilityNote?.trim() && <p className="max-w-prose whitespace-pre-line text-muted-foreground">{product.availabilityNote}</p>}
          {actions}
        </div>
      </div>
      {product.richContent && product.richContent.blocks.length > 0 && (
        <section aria-labelledby="product-information" className="space-y-6 border-t pt-8">
          <h2 id="product-information" className="text-2xl font-semibold">Información del producto</h2>
          <ProductRichContentRenderer content={product.richContent} />
        </section>
      )}
    </div>
  )
}
