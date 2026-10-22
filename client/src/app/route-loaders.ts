import { createRecoverablePageLoader } from './recoverable-page-loader'

// A failed module fetch can remain cached by the browser. A distinct URL lets
// navigation recover once without reloading the document or delaying healthy imports.
export const loadCatalogPage = createRecoverablePageLoader(
  () => import('@/pages/catalog/CatalogPage'),
  () => import('@/pages/catalog/CatalogPage?navigation-retry'),
)
export const loadProductDetailPage = () => import('@/pages/product/ProductDetailPage')
export const loadContactPage = createRecoverablePageLoader(
  () => import('@/pages/contact/ContactPage'),
  () => import('@/pages/contact/ContactPage?navigation-retry'),
)
export const loadHowToBuyPage = createRecoverablePageLoader(
  () => import('@/pages/how-to-buy/HowToBuyPage'),
  () => import('@/pages/how-to-buy/HowToBuyPage?navigation-retry'),
)
export const loadFaqPage = createRecoverablePageLoader(
  () => import('@/pages/faq/FaqPage'),
  () => import('@/pages/faq/FaqPage?navigation-retry'),
)
