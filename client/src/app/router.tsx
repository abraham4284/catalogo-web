import { createBrowserRouter } from 'react-router-dom'
import { HomePage } from '@/pages/home/HomePage'
import { NotFoundPage } from '@/pages/not-found/NotFoundPage'
import { CatalogPage } from '@/pages/catalog/CatalogPage'
import { ProductDetailPage } from '@/pages/product/ProductDetailPage'
import { StoreRoute } from './StoreRoute'
import { CartPage } from '@/pages/cart/CartPage'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: StoreRoute,
    children: [
      { index: true, Component: HomePage },
      { path: 'productos', Component: CatalogPage },
      { path: 'productos/:idProduct', Component: ProductDetailPage },
      { path: 'carrito', Component: CartPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
])
