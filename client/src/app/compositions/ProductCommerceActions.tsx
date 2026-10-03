import { useEffect } from 'react'
import { AddToCartButton, useCartStore } from '@/features/cart'
import { ProductInquiryLink } from '@/features/whatsapp'

import { toCartSnapshot, type CommerceProduct } from './catalog-cart-snapshot'

export function ProductCommerceActions({ product }: { product: CommerceProduct }) {
  const { idProduct, slug, name, price, imageUrl, availabilityStatus, stockAvailable } = product
  const reconcileItem = useCartStore((state) => state.reconcileItem)
  useEffect(() => {
    reconcileItem(toCartSnapshot({ idProduct, slug, name, price, imageUrl, availabilityStatus, stockAvailable }))
  }, [reconcileItem, idProduct, slug, name, price, imageUrl, availabilityStatus, stockAvailable])

  const snapshot = toCartSnapshot(product)
  return (
    <div className="space-y-3">
      {snapshot.availabilityStatus === 'in_stock' && <AddToCartButton product={snapshot} />}
      <ProductInquiryLink product={{ name, price, availabilityStatus }} />
    </div>
  )
}
