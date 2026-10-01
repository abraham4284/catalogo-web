import { Link } from 'react-router-dom'
import type { CatalogProductDetail } from '../types/catalog.types'
import { formatCatalogPrice } from '../utils/catalog-price'
import { getCatalogHref } from '../utils/catalog-url'
import { ProductGallery } from './ProductGallery'

export function ProductDetail({ product }: { product: CatalogProductDetail }) {
  const description = product.description?.trim()
  return (
    <div className="grid min-w-0 gap-8 lg:grid-cols-2 lg:gap-12">
      <ProductGallery key={product.idProduct} name={product.name} imageUrl={product.imageUrl} gallery={product.gallery} />
      <div className="min-w-0 space-y-6 break-words">
        <Link to={getCatalogHref({ page: 1, category: product.category.idProductCategory })} className="inline-block text-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4">{product.category.name}</Link>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{product.name}</h1>
        <p className="text-2xl font-semibold">{formatCatalogPrice(product.price)}</p>
        <p className="text-muted-foreground">{product.available ? 'Disponible' : 'No disponible'}</p>
        {description && (
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Descripción</h2>
            <p className="whitespace-pre-line text-muted-foreground">{description}</p>
          </section>
        )}
      </div>
    </div>
  )
}
