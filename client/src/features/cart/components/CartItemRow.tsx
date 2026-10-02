import { Link } from 'react-router-dom'
import { formatCurrency } from '@/shared/utils/format-currency'
import { calculateCartLineTotal } from '../domain/cart'
import { canIncrementCartItem, isCartItemAvailable, isCartItemQuantityValid } from '../domain/cart'
import { ProductImage } from '@/shared/components/media/ProductImage'
import { useCartStore } from '../store/cart.store'
import type { CartItem } from '../types/cart.types'

export function CartItemRow({ item }: { item: CartItem }) {
  const increment = useCartStore((state) => state.incrementItem)
  const decrement = useCartStore((state) => state.decrementItem)
  const remove = useCartStore((state) => state.removeItem)
  const buttonClass = 'min-h-11 min-w-11 border px-3 py-2 disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2'
  return (
    <li className="min-w-0 space-y-4 border-b py-6 first:pt-0">
      <Link to={`/productos/${item.idProduct}`} aria-labelledby={`cart-product-${item.idProduct}`} className="flex min-w-0 items-start gap-4 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4">
        <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted sm:size-24">
          <ProductImage src={item.imageUrl} alt={item.name} loading="lazy" />
        </div>
        <h2 id={`cart-product-${item.idProduct}`} className="min-w-0 text-lg font-medium underline underline-offset-4">{item.name}</h2>
      </Link>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Precio unitario: {formatCurrency(item.price)}</p>
        <p className="text-sm">{isCartItemAvailable(item) ? 'Disponible' : 'No disponible'}</p>
        {!isCartItemQuantityValid(item) && isCartItemAvailable(item) && <p role="status" className="text-sm">La cantidad supera la disponibilidad actual. Reducila para continuar.</p>}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" disabled={item.quantity === 1} aria-label={`Disminuir cantidad de ${item.name}`} onClick={() => decrement(item.idProduct)} className={buttonClass}>−</button>
        <span className="break-all"><span className="sr-only">Cantidad de {item.name}: </span>{item.quantity}</span>
        <button type="button" disabled={!canIncrementCartItem(item)} aria-label={`Aumentar cantidad de ${item.name}`} onClick={() => increment(item.idProduct)} className={buttonClass}>+</button>
        <button type="button" onClick={() => remove(item.idProduct)} aria-label={`Eliminar ${item.name} del carrito`} className="px-3 py-2 text-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring">Eliminar</button>
      </div>
      <p className="min-w-0 font-semibold">Subtotal: {formatCurrency(calculateCartLineTotal(item))}</p>
    </li>
  )
}
