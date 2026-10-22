import { createBrowserRouter } from 'react-router-dom'
import { HomePage } from '@/pages/home/HomePage'
import { NotFoundPage } from '@/pages/not-found/NotFoundPage'
import { CatalogLoadingState } from '@/features/catalog'
import { StoreRoute } from './StoreRoute'
import { CartPage } from '@/pages/cart/CartPage'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: StoreRoute,
    HydrateFallback: CatalogLoadingState,
    children: [
      { index: true, Component: HomePage },
      {
        path: 'productos',
        lazy: async () => ({ Component: (await import('@/pages/catalog/CatalogPage')).CatalogPage }),
      },
      {
        path: 'productos/:slug',
        lazy: async () => ({ Component: (await import('@/pages/product/ProductDetailPage')).ProductDetailPage }),
      },
      { path: 'carrito', Component: CartPage },
      { path: 'contacto', lazy: async () => ({ Component: (await import('@/pages/contact/ContactPage')).ContactPage }) },
      { path: 'como-comprar', lazy: async () => ({ Component: (await import('@/pages/how-to-buy/HowToBuyPage')).HowToBuyPage }) },
      { path: 'preguntas-frecuentes', lazy: async () => ({ Component: (await import('@/pages/faq/FaqPage')).FaqPage }) },
      { path: '*', Component: NotFoundPage },
    ],
  },
])
