import { useParams } from 'react-router-dom'
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
      <ProductContent key={slug} slug={slug} />
    </div>
  )
}
