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
      { index: true, Component: HomePage },
      {
        path: 'productos',
        lazy: async () => ({ Component: (await loadCatalogPage()).CatalogPage }),
      },
      {
        path: 'productos/:slug',
        lazy: async () => ({ Component: (await loadProductDetailPage()).ProductDetailPage }),
      },
      { path: 'carrito', Component: CartPage },
      { path: 'contacto', lazy: async () => ({ Component: (await loadContactPage()).ContactPage }) },
      { path: 'como-comprar', lazy: async () => ({ Component: (await loadHowToBuyPage()).HowToBuyPage }) },
      { path: 'preguntas-frecuentes', lazy: async () => ({ Component: (await loadFaqPage()).FaqPage }) },
      { path: '*', Component: NotFoundPage },
    ],
  },
])
