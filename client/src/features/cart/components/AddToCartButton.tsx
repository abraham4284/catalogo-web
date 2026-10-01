import { useCartStore } from '../store/cart.store'
import type { AddCartItemInput } from '../types/cart.types'

export function AddToCartButton({ product, available }: { product: AddCartItemInput; available: boolean }) {
  const addItem = useCartStore((state) => state.addItem)
  const quantity = useCartStore((state) => state.items.find((item) => item.idProduct === product.idProduct)?.quantity ?? 0)
  return (
    <div className="space-y-2">
      <button type="button" disabled={!available} onClick={() => { if (available) addItem(product) }} className="bg-primary px-5 py-3 text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4">
        {available ? 'Agregar al carrito' : 'No disponible'}
      </button>
      <p role="status" aria-live="polite" className="text-sm text-muted-foreground">{quantity > 0 ? `En carrito: ${quantity}` : ''}</p>
    </div>
  )
}
