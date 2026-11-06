import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackViewContent, useAnalyticsConsent } from '@/features/analytics'

export function ProductAnalytics({ product }: { product: { idProduct: number; name: string; priceSale: number } }) {
  const consent = useAnalyticsConsent((state) => state.consent)
  const { pathname } = useLocation()
  const { idProduct, name, priceSale } = product
  useEffect(() => { trackViewContent({ idProduct, name, price: priceSale }, pathname) }, [idProduct, name, priceSale, pathname, consent])
  return null
}
