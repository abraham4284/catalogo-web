import { Link } from 'react-router-dom'
import {
  useCatalogHome, ProductGrid, CatalogLoadingState, CatalogErrorState,
  CatalogEmptyState, getCatalogHref,
} from '@/features/catalog'

export function HomePage() {
  const state = useCatalogHome()
  return (
    <div className="space-y-12">
      <section className="max-w-2xl space-y-5 py-4 sm:py-8">
        {state.status === 'success' && <p className="break-words text-muted-foreground">{state.data.business.name}</p>}
        <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">Explorá nuestro catálogo</h1>
        <p className="text-muted-foreground">Encontrá productos y consultá su disponibilidad.</p>
        <Link to="/productos" className="inline-block bg-primary px-5 py-3 text-primary-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4">Ver productos</Link>
      </section>
      {state.status === 'loading' && <CatalogLoadingState />}
      {state.status === 'error' && <CatalogErrorState message={state.message} />}
      {state.status === 'success' && (
        <>
          {state.data.categories.length > 0 && (
            <section aria-labelledby="home-categories" className="space-y-4">
              <h2 id="home-categories" className="text-2xl font-semibold">Categorías</h2>
              <ul className="flex flex-wrap gap-3">
                {state.data.categories.map((category) => (
                  <li key={category.idProductCategory} className="min-w-0 max-w-full">
                    <Link to={getCatalogHref({ page: 1, category: category.idProductCategory })} className="block break-words border px-4 py-3 hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4">{category.name}</Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <section aria-labelledby="home-products" className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 id="home-products" className="text-2xl font-semibold">Productos</h2>
              <Link to="/productos" className="underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4">Ver todos los productos</Link>
            </div>
            {state.data.products.items.length > 0 ? <ProductGrid products={state.data.products.items} /> : <CatalogEmptyState />}
          </section>
        </>
      )}
    </div>
  )
}
