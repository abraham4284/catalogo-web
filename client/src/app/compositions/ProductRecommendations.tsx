import { Link } from 'react-router-dom'
import { useRelatedProducts, ProductCard, ProductCardSkeleton, type CatalogProductDetail } from '@/features/catalog'
import { ProductCommerceActions } from './ProductCommerceActions'
import { FaqList } from '@/shared/components/guidance/FaqList'
import { getProductFaq } from '@/content/storefront-content'
import { prefetchRoute } from '../navigation-prefetch'

export function ProductRecommendations({ product }: { product: CatalogProductDetail }) {
  const related = useRelatedProducts(product)
  return <div className="space-y-12">
    {(related.loading || related.items.length > 0) && <section aria-labelledby="related-heading" className="space-y-6 border-t pt-8">
      <h2 id="related-heading" className="text-2xl font-semibold">También te puede interesar</h2>
      {related.loading && <p role="status" className="sr-only">Cargando productos relacionados…</p>}
      <ul aria-label="Productos relacionados" tabIndex={0} className="relative flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 focus-visible:outline-2 focus-visible:outline-ring sm:gap-6">
        {related.loading ? [0, 1, 2, 3].map((n) => <li key={n} aria-hidden="true" className="w-[75%] shrink-0 md:w-[calc((100%-3rem)/3)] xl:w-[calc((100%-4.5rem)/4)]"><ProductCardSkeleton /></li>) : related.items.map((item) => <li key={item.idProduct} className="w-[75%] shrink-0 snap-start md:w-[calc((100%-3rem)/3)] xl:w-[calc((100%-4.5rem)/4)]"><ProductCard product={item} actions={<ProductCommerceActions product={item} />} /></li>)}
      </ul>
    </section>}
    <section aria-labelledby="product-faq" className="space-y-5 border-t pt-8">
      <h2 id="product-faq" className="text-2xl font-semibold">Preguntas frecuentes</h2>
      <FaqList items={getProductFaq(product.availabilityStatus)} />
      <Link to="/preguntas-frecuentes" onPointerEnter={() => prefetchRoute('/preguntas-frecuentes')} onFocus={() => prefetchRoute('/preguntas-frecuentes')} className="inline-flex min-h-11 items-center text-primary underline focus-visible:outline-2 focus-visible:outline-ring">Ver todas las preguntas frecuentes →</Link>
    </section>
  </div>
}
