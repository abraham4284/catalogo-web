import { Link, useParams } from 'react-router-dom'
import { ProductCommerceActions } from '@/app/compositions/ProductCommerceActions'
import {
  parseCatalogProductSlugParam, useCatalogProduct, ProductDetail,
  ProductUnavailableState, CatalogLoadingState, CatalogErrorState,
} from '@/features/catalog'

function ProductContent({ slug }: { slug: string }) {
  const state = useCatalogProduct(slug)
  if (state.status === 'success') {
    return <ProductDetail product={state.data} actions={<ProductCommerceActions product={state.data} />} />
  }
  if (state.status === 'error' && state.reason === 'not-found') return <ProductUnavailableState />
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">Detalle de producto</h1>
      {state.status === 'loading' ? <CatalogLoadingState message="Cargando producto…" /> : <CatalogErrorState message={state.message} />}
    </section>
  )
}

export function ProductDetailPage() {
  const { slug: param } = useParams()
  const slug = parseCatalogProductSlugParam(param)
  if (slug === undefined) return <ProductUnavailableState />
  return (
    <div className="space-y-8">
      <Link to="/productos" className="inline-block underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4">← Volver a productos</Link>
      <ProductContent key={slug} slug={slug} />
    </div>
  )
}
