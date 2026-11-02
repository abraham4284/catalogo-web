import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackViewContent, useAnalyticsConsent } from '@/features/analytics'

export function ProductAnalytics({ product }: { product: { idProduct: number; name: string; price: number } }) {
  const consent = useAnalyticsConsent((state) => state.consent)
  const { pathname } = useLocation()
  const { idProduct, name, price } = product
  useEffect(() => { trackViewContent({ idProduct, name, price }, pathname) }, [idProduct, name, price, pathname, consent])
  return null
}
