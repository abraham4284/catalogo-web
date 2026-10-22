import { useEffect, useRef, useState } from 'react'
import { showCartAddedToast } from '../utils/show-cart-added-toast'
import { useCartStore } from '../store/cart.store'
import type { AddCartItemInput } from '../types/cart.types'
import { canIncrementCartItem, isCartItemInStock } from '../domain/cart'

export function AddToCartButton({ product }: { product: AddCartItemInput }) {
  const addItem = useCartStore((state) => state.addItem)
  const [addedProductId, setAddedProductId] = useState<number | null>(null)
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const quantity = useCartStore((state) => state.items.find((item) => item.idProduct === product.idProduct)?.quantity ?? 0)
  const inStock = isCartItemInStock(product)
  const canAdd = canIncrementCartItem({ ...product, quantity })
  const added = addedProductId === product.idProduct

  useEffect(() => () => clearTimeout(resetTimer.current), [])

  function handleAdd() {
    if (added || !canAdd) return
    const before = useCartStore.getState().items.find((item) => item.idProduct === product.idProduct)?.quantity ?? 0
    addItem(product)
    const after = useCartStore.getState().items.find((item) => item.idProduct === product.idProduct)?.quantity ?? 0
    if (after <= before) return

    setAddedProductId(product.idProduct)
    clearTimeout(resetTimer.current)
    resetTimer.current = setTimeout(() => setAddedProductId(null), 1200)
    showCartAddedToast(product.name)
  }

  return (
    <div className="space-y-2">
      <button type="button" disabled={added || !canAdd} onClick={handleAdd} data-added={added || undefined} className="min-h-11 w-full rounded-lg bg-primary px-4 py-3 text-sm text-primary-foreground transition-colors data-[added]:bg-primary/85 data-[added]:disabled:opacity-100 data-[added]:disabled:cursor-default disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4 motion-reduce:transition-none">
        {added ? <><span aria-hidden="true">✓ </span>Agregado</> : inStock ? 'Agregar al carrito' : 'No disponible'}
      </button>
      {inStock && !canAdd && <p className="text-sm text-muted-foreground">No podés agregar más por la disponibilidad actual.</p>}
    </div>
  )
}
