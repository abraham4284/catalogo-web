import { trackAddToCart, trackContact } from '@/features/analytics'
import { useEffect } from 'react'
import { AddToCartButton, useCartStore } from '@/features/cart'
import { ProductInquiryLink } from '@/features/whatsapp'

import { toCartSnapshot, type CommerceProduct } from './catalog-cart-snapshot'

export function ProductCommerceActions({ product }: { product: CommerceProduct }) {
  const { idProduct, slug, name, priceSale, priceWholesale, imageUrl, availabilityStatus, stockAvailable } = product
  const reconcileItem = useCartStore((state) => state.reconcileItem)
  useEffect(() => {
    reconcileItem(toCartSnapshot({ idProduct, slug, name, priceSale, priceWholesale, imageUrl, availabilityStatus, stockAvailable }))
  }, [reconcileItem, idProduct, slug, name, priceSale, priceWholesale, imageUrl, availabilityStatus, stockAvailable])

  const snapshot = toCartSnapshot(product)
  return (
    <div className="space-y-3">
      {snapshot.availabilityStatus === 'in_stock' && <AddToCartButton onAdded={() => trackAddToCart({ idProduct, name, price: priceSale })} product={snapshot} />}
      <ProductInquiryLink onContact={() => trackContact('product_inquiry', product)} product={{ name, price: priceSale, availabilityStatus, slug }} />
    </div>
  )
}
