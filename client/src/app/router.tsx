import { createBrowserRouter } from 'react-router-dom'
import { HomePage } from '@/pages/home/HomePage'
import { NotFoundPage } from '@/pages/not-found/NotFoundPage'
import { CatalogLoadingState } from '@/features/catalog'
import { StoreRoute } from './StoreRoute'
import { CartPage } from '@/pages/cart/CartPage'
import { loadCatalogPage, loadProductDetailPage, loadContactPage, loadHowToBuyPage, loadFaqPage } from './route-loaders'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: StoreRoute,
    HydrateFallback: CatalogLoadingState,
    children: [
      { id: 'home', index: true, Component: HomePage },
      {
        id: 'catalog', path: 'productos',
        lazy: async () => ({ Component: (await loadCatalogPage()).CatalogPage }),
      },
      {
        id: 'product', path: 'productos/:slug',
        lazy: async () => ({ Component: (await loadProductDetailPage()).ProductDetailPage }),
      },
      { id: 'cart', path: 'carrito', Component: CartPage },
      { id: 'contact', path: 'contacto', lazy: async () => ({ Component: (await loadContactPage()).ContactPage }) },
      { id: 'howToBuy', path: 'como-comprar', lazy: async () => ({ Component: (await loadHowToBuyPage()).HowToBuyPage }) },
      { id: 'faq', path: 'preguntas-frecuentes', lazy: async () => ({ Component: (await loadFaqPage()).FaqPage }) },
      { id: 'notFound', path: '*', Component: NotFoundPage },
    ],
  },
])
