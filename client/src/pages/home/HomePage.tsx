import { HomeHero } from './components/HomeHero'
import { HomeEditorial } from './components/HomeEditorial'
import { HomeBuyingGuide } from './components/HomeBuyingGuide'
import { Link } from 'react-router-dom'
import { ProductCommerceActions } from '@/app/compositions/ProductCommerceActions'
import {
  useCatalogHome, ProductGrid, CatalogLoadingState, CatalogErrorState,
  CatalogEmptyState, getCatalogHref,
} from '@/features/catalog'

export function HomePage() {
  const state = useCatalogHome()
  const heroProduct = state.status === 'success'
    ? state.data.products.items.find((product) => Boolean(product.imageUrl)) ?? state.data.products.items[0]
    : undefined
  return (
    <div className="space-y-12 sm:space-y-20">
      <HomeHero status={state.status} product={heroProduct} />
      {state.status === 'loading' && <CatalogLoadingState />}
      {state.status === 'error' && <CatalogErrorState message={state.message} />}
      {state.status === 'success' && (
        <>
          {state.data.categories.length > 0 && (
            <section aria-labelledby="home-categories" className="space-y-4">
              <h2 id="home-categories" className="text-3xl font-semibold tracking-tight">Categorías</h2>
              <ul className="flex flex-wrap gap-3">
                {state.data.categories.map((category) => (
                  <li key={category.idProductCategory} className="min-w-0 max-w-full">
                    <Link to={getCatalogHref({ page: 1, categorySlug: category.slug })} className="inline-flex min-h-11 items-center gap-6 rounded-full break-words border px-5 py-3 hover:border-primary hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4">{category.name}</Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <section aria-labelledby="home-products" className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 id="home-products" className="text-3xl font-semibold tracking-tight">Productos</h2>
              <Link to="/productos" className="underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4">Ver todos los productos</Link>
            </div>
            {state.data.products.items.length > 0 ? <ProductGrid products={state.data.products.items} renderActions={(product) => <ProductCommerceActions product={product} />} /> : <CatalogEmptyState />}
          </section>
        </>
      )}
      <HomeEditorial />
      <HomeBuyingGuide />
    </div>
  )
}
