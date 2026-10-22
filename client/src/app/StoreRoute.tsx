import { lazy, Suspense, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { StoreLayout } from '@/shared/components/layout/StoreLayout'
import { calculateCartItemCount, calculateCartTotal, useCartStore } from '@/features/cart'
import { storefrontContent } from '@/content/storefront-content'
import { useStorefrontUi } from './storefront-ui.store'

const StorePanels = lazy(() => import('./compositions/StorePanels').then((module) => ({ default: module.StorePanels })))

export function StoreRoute() {
  const { pathname } = useLocation()
  const previousPath = useRef(pathname)
  const cartCount = useCartStore((state) => calculateCartItemCount(state.items))
  const cartTotal = useCartStore((state) => calculateCartTotal(state.items))
  const { panel, hasOpened, openCart, openMenu, closeForNavigation } = useStorefrontUi()

  useEffect(() => {
    if (previousPath.current !== pathname) {
      closeForNavigation()
      document.getElementById('main-content')?.focus()
      previousPath.current = pathname
    }
  }, [pathname, closeForNavigation])

  return (
    <>
      <StoreLayout
        cartCount={cartCount} cartTotal={cartTotal} cartOpen={panel === 'cart'} menuOpen={panel === 'menu'}
        onOpenCart={openCart} onOpenMenu={openMenu}
        announcement={storefrontContent.announcement} footerNote={storefrontContent.footerNote}
      />
      {hasOpened && <Suspense fallback={<p role="status" className="fixed bottom-24 right-4 z-20 bg-background p-3 text-sm">Abriendo panel…</p>}><StorePanels /></Suspense>}
    </>
  )
}
