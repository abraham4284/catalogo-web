import { useEffect } from 'react'
import { isCatalogProductAvailable, type CatalogProductDetail } from '@/features/catalog'
import { AddToCartButton, useCartStore } from '@/features/cart'
import { ProductInquiryLink } from '@/features/whatsapp'

type CommerceProduct = Pick<CatalogProductDetail, 'idProduct' | 'name' | 'price' | 'imageUrl' | 'available' | 'stockAvailable'>

export function ProductCommerceActions({ product }: { product: CommerceProduct }) {
  const { idProduct, name, price, imageUrl, available, stockAvailable } = product
  const reconcileItem = useCartStore((state) => state.reconcileItem)
  useEffect(() => {
    reconcileItem({ idProduct, name, price, imageUrl, available, stockAvailable })
  }, [reconcileItem, idProduct, name, price, imageUrl, available, stockAvailable])

  const canPurchase = isCatalogProductAvailable(product)
  return (
    <div className="space-y-3">
      {canPurchase && <AddToCartButton product={{ idProduct, name, price, imageUrl, available, stockAvailable }} />}
      <ProductInquiryLink product={{ name, price, available: canPurchase }} />
    </div>
  )
}
