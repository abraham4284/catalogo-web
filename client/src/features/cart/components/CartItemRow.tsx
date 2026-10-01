import { Link } from 'react-router-dom'
import { formatCurrency } from '@/shared/utils/format-currency'
import { calculateCartLineTotal } from '../domain/cart'
import { useCartStore } from '../store/cart.store'
import type { CartItem } from '../types/cart.types'

export function CartItemRow({ item }: { item: CartItem }) {
  const increment = useCartStore((state) => state.incrementItem)
  const decrement = useCartStore((state) => state.decrementItem)
  const remove = useCartStore((state) => state.removeItem)
  const buttonClass = 'min-h-11 min-w-11 border px-3 py-2 disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2'
  return (
    <li className="space-y-4 border-b py-6 first:pt-0">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 max-w-full flex-1 basis-48 space-y-2 break-words">
          <h2 className="text-lg font-medium"><Link to={`/productos/${item.idProduct}`} className="underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring">{item.name}</Link></h2>
          <p className="text-sm text-muted-foreground">Precio unitario: {formatCurrency(item.price)}</p>
        </div>
        <p className="min-w-0 max-w-full font-semibold">Subtotal: {formatCurrency(calculateCartLineTotal(item))}</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" disabled={item.quantity === 1} aria-label={`Disminuir cantidad de ${item.name}`} onClick={() => decrement(item.idProduct)} className={buttonClass}>−</button>
        <span aria-label={`Cantidad de ${item.name}`} className="break-all">{item.quantity}</span>
        <button type="button" disabled={item.quantity === Number.MAX_SAFE_INTEGER} aria-label={`Aumentar cantidad de ${item.name}`} onClick={() => increment(item.idProduct)} className={buttonClass}>+</button>
        <button type="button" onClick={() => remove(item.idProduct)} aria-label={`Eliminar ${item.name} del carrito`} className="px-3 py-2 text-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring">Eliminar</button>
      </div>
    </li>
  )
}
