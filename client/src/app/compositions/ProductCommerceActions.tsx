import { useEffect } from 'react'
import { AddToCartButton, useCartStore } from '@/features/cart'
import { ProductInquiryLink } from '@/features/whatsapp'

import { toCartV2Snapshot, type CommerceProduct } from './product-cart-compatibility'

export function ProductCommerceActions({ product }: { product: CommerceProduct }) {
  const { idProduct, name, price, imageUrl, availabilityStatus, stockAvailable } = product
  const reconcileItem = useCartStore((state) => state.reconcileItem)
  useEffect(() => {
    reconcileItem(toCartV2Snapshot({ idProduct, name, price, imageUrl, availabilityStatus, stockAvailable }))
  }, [reconcileItem, idProduct, name, price, imageUrl, availabilityStatus, stockAvailable])

  const snapshot = toCartV2Snapshot(product)
  return (
    <div className="space-y-3">
      {snapshot.available && <AddToCartButton product={snapshot} />}
      <ProductInquiryLink product={{ name, price, availabilityStatus }} />
    </div>
  )
}
