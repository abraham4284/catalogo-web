import { HomeHero } from './components/HomeHero'
import { HomeCategories } from './components/HomeCategories'
import { HomeOpeningBanner } from './components/HomeOpeningBanner'
import { HomeFeaturedProduct } from './components/HomeFeaturedProduct'
import { HomeEditorial } from './components/HomeEditorial'
import { HomeBuyingGuide } from './components/HomeBuyingGuide'
import { Link } from 'react-router-dom'
import { ProductCommerceActions } from '@/app/compositions/ProductCommerceActions'
import {
  useCatalogHome, ProductGrid, CatalogLoadingState, CatalogErrorState,
  CatalogEmptyState,
} from '@/features/catalog'

export function HomePage() {
  const state = useCatalogHome()
  return (
    <div className="-mt-6 space-y-8 sm:space-y-10">
      <HomeHero />
      {state.status === 'success' && <HomeCategories categories={state.data.categories} />}
      <HomeOpeningBanner />
      {state.status === 'loading' && <section aria-label="Productos" className="space-y-6"><h2 className="text-3xl font-semibold">Productos</h2><CatalogLoadingState /></section>}
      {state.status === 'error' && <CatalogErrorState onRetry={state.retry} message={state.message} />}
      {state.status === 'success' && (
        <>
          <section aria-labelledby="home-products" className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 id="home-products" className="text-3xl font-semibold tracking-tight">Productos</h2>
              <Link to="/productos" className="underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4">Ver todos los productos</Link>
            </div>
            <HomeFeaturedProduct product={state.data.heroProduct} loading={state.data.heroLoading} />
            {state.data.products.items.length > 0 ? <ProductGrid products={state.data.products.items} renderActions={(product) => <ProductCommerceActions product={product} />} /> : <CatalogEmptyState />}
          </section>
        </>
      )}
      <HomeEditorial />
      <HomeBuyingGuide />
    </div>
  )
}
