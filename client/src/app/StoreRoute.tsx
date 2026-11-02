import { AnalyticsConsent, useAnalyticsConsent } from '@/features/analytics'
import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { StoreLayout } from '@/shared/components/layout/StoreLayout'
import { FeedbackToaster } from '@/shared/components/ui/FeedbackToaster'
import { calculateCartItemCount, calculateCartTotal, useCartStore } from '@/features/cart'
import { storefrontContent } from '@/content/storefront-content'
import { useStorefrontUi } from './storefront-ui.store'
import { StorePanels } from './compositions/StorePanels'
import { prefetchRoute } from './navigation-prefetch'
import { RouteSeo } from './compositions/RouteSeo'

export function StoreRoute() {
  const { pathname } = useLocation()
  const previousPath = useRef(pathname)
  const cartCount = useCartStore((state) => calculateCartItemCount(state.items))
  const cartTotal = useCartStore((state) => calculateCartTotal(state.items))
  const { panel, openCart, openMenu, closeForNavigation } = useStorefrontUi()

  useEffect(() => {
    if (previousPath.current !== pathname) {
      closeForNavigation()
      document.getElementById('main-content')?.focus()
      previousPath.current = pathname
    }
  }, [pathname, closeForNavigation])

  return (
    <>
      <RouteSeo />
      <AnalyticsConsent />
      <StoreLayout
        cartCount={cartCount} cartTotal={cartTotal} cartOpen={panel === 'cart'} menuOpen={panel === 'menu'}
        onOpenCart={openCart} onOpenMenu={openMenu}
        onPrefetchRoute={prefetchRoute}
        onCookiePreferences={useAnalyticsConsent.getState().openPreferences}
        announcement={storefrontContent.announcement} footerNote={storefrontContent.footerNote}
      />
      <StorePanels />
      <FeedbackToaster />
    </>
  )
}
