import { ProductRecommendations } from '@/app/compositions/ProductRecommendations'
import { ProductAnalytics } from '@/app/compositions/ProductAnalytics'
import { useLocation, useParams } from 'react-router-dom'
import { Seo } from '@/shared/components/seo/Seo'
import { getProductSeo, getPendingProductSeo } from './product-seo'
import { ProductCommerceActions } from '@/app/compositions/ProductCommerceActions'
import {
  parseCatalogProductSlugParam, useCatalogProduct, ProductDetail,
  ProductUnavailableState, ProductDetailSkeleton, CatalogErrorState,
} from '@/features/catalog'

function ProductContent({ slug }: { slug: string }) {
  const state = useCatalogProduct(slug)
  if (state.status === 'success') {
    return <><ProductAnalytics product={state.data} /><Seo metadata={getProductSeo(state.data)} /><ProductDetail product={state.data} actions={<ProductCommerceActions product={state.data} />} /><ProductRecommendations product={state.data} /></>
  }
  if (state.status === 'error' && state.reason === 'not-found') return <><Seo metadata={getPendingProductSeo(`/productos/${slug}`, true)} /><ProductUnavailableState /></>
  if (state.status === 'loading') return <><Seo metadata={getPendingProductSeo(`/productos/${slug}`)} /><ProductDetailSkeleton /></>
  return (
    <section className="space-y-4">
      <Seo metadata={getPendingProductSeo(`/productos/${slug}`, true)} />
      <h1 className="text-3xl font-semibold">Detalle de producto</h1>
      <CatalogErrorState onRetry={state.retry} message={state.message} />
    </section>
  )
}

export function ProductDetailPage() {
  const { pathname } = useLocation()
  const { slug: param } = useParams()
  const slug = parseCatalogProductSlugParam(param)
  if (slug === undefined) return <><Seo metadata={getPendingProductSeo(pathname, true)} /><ProductUnavailableState /></>
  return (
    <div className="space-y-8">
      <ProductContent key={slug} slug={slug} />
    </div>
  )
}
