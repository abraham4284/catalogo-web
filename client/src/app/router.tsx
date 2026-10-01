import { createBrowserRouter } from 'react-router-dom'
import { HomePage } from '@/pages/home/HomePage'
import { NotFoundPage } from '@/pages/not-found/NotFoundPage'
import { CatalogPage } from '@/pages/catalog/CatalogPage'
import { ProductDetailPage } from '@/pages/product/ProductDetailPage'
import { StoreLayout } from '@/shared/components/layout/StoreLayout'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: StoreLayout,
    children: [
      { index: true, Component: HomePage },
      { path: 'productos', Component: CatalogPage },
      { path: 'productos/:idProduct', Component: ProductDetailPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
])
