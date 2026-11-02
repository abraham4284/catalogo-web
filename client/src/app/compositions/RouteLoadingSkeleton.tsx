import { useLocation } from 'react-router-dom'
import { CatalogLoadingState, ProductDetailSkeleton } from '@/features/catalog'

export function RouteLoadingSkeleton() {
  const { pathname } = useLocation()
  const content = pathname.startsWith('/productos/') ? <ProductDetailSkeleton />
    : pathname === '/' || pathname === '/productos' ? <CatalogLoadingState /> : null
  return content ? <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">{content}</div> : null
}
