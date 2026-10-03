import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { StoreLayout } from '@/shared/components/layout/StoreLayout'
import { calculateCartItemCount, useCartStore } from '@/features/cart'
import { storefrontContent } from '@/content/storefront-content'

export function StoreRoute() {
  const { pathname } = useLocation()
  const previousPath = useRef(pathname)
  const cartCount = useCartStore((state) => calculateCartItemCount(state.items))

  useEffect(() => {
    if (previousPath.current !== pathname) {
      document.getElementById('main-content')?.focus()
      previousPath.current = pathname
    }
  }, [pathname])

  return <StoreLayout cartCount={cartCount} announcement={storefrontContent.announcement} footerNote={storefrontContent.footerNote} />
}
