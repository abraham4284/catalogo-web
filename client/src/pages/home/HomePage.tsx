import { HomeHero } from './components/HomeHero'
import { HomeProductFeed } from './components/HomeProductFeed'
import { HomeOpeningBanner } from './components/HomeOpeningBanner'
import { HomeFeaturedProduct } from './components/HomeFeaturedProduct'
import { HomeEditorial } from './components/HomeEditorial'
import { HomeBuyingGuide } from './components/HomeBuyingGuide'
import { Link } from 'react-router-dom'
import { useRef } from 'react'
import { QuickCatalogActions } from '@/app/compositions/QuickCatalogActions'
import {
  useCatalogHome, CatalogErrorState,
  CatalogEmptyState,
} from '@/features/catalog'

export function HomePage() {
  const state = useCatalogHome()
  const productsRef = useRef<HTMLElement>(null)
  return (
    <div className="space-y-5 sm:space-y-8">
      <HomeHero />
      {state.status === 'loading' && (
        <section aria-label="Productos" className="space-y-4">
          <div className="flex min-h-11 items-center"><h2 className="text-2xl font-semibold sm:text-3xl">Productos</h2></div>
          <HomeProductFeed products={[]} categories={[]} loading />
        </section>
      )}
      {state.status === 'error' && <CatalogErrorState onRetry={state.retry} message={state.message} />}
      {state.status === 'success' && (
        <>
          <section ref={productsRef} aria-labelledby="home-products" className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 id="home-products" className="text-2xl font-semibold tracking-tight sm:text-3xl">Productos</h2>
              <Link to="/productos" className="inline-flex min-h-11 items-center text-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4">Ver todos los productos</Link>
            </div>
            {state.data.products.items.length === 0 && <CatalogEmptyState />}
            <HomeProductFeed products={state.data.products.items} categories={state.data.categories} />
            {!state.data.products.items.some(({ slug }) => slug === state.data.heroProduct?.slug) && (
              <HomeFeaturedProduct product={state.data.heroProduct} loading={state.data.heroLoading} />
            )}
          </section>
          {state.data.products.items.length > 0 && <QuickCatalogActions productsRef={productsRef} categories={state.data.categories} categoryStatus="success" filters={{ page: 1 }} />}
        </>
      )}
      <HomeOpeningBanner />
      <HomeEditorial />
      <HomeBuyingGuide />
    </div>
  )
}
