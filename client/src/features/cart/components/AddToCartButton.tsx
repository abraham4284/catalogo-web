import { useCartStore } from '../store/cart.store'
import type { AddCartItemInput } from '../types/cart.types'
import { canIncrementCartItem, isCartItemAvailable } from '../domain/cart'

export function AddToCartButton({ product }: { product: AddCartItemInput }) {
  const addItem = useCartStore((state) => state.addItem)
  const quantity = useCartStore((state) => state.items.find((item) => item.idProduct === product.idProduct)?.quantity ?? 0)
  const available = isCartItemAvailable(product)
  const canAdd = canIncrementCartItem({ ...product, quantity })
  return (
    <div className="space-y-2">
      <button type="button" disabled={!canAdd} onClick={() => addItem(product)} className="min-h-11 w-full bg-primary px-4 py-3 text-sm text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4">
        {available ? 'Agregar al carrito' : 'No disponible'}
      </button>
      <p role="status" aria-live="polite" className="text-sm text-muted-foreground">{quantity > 0 ? `En carrito: ${quantity}` : ''}</p>
      {available && !canAdd && <p className="text-sm text-muted-foreground">No podés agregar más por la disponibilidad actual.</p>}
    </div>
  )
}
