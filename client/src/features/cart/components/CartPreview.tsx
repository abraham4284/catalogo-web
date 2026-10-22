import { Link } from 'react-router-dom'
import { useCartStore } from '../store/cart.store'
import { calculateCartItemCount, calculateCartTotal } from '../domain/cart'
import { CartItemRow } from './CartItemRow'
import { formatCurrency } from '@/shared/utils/format-currency'

export function CartPreview({ onNavigate }: { onNavigate: () => void }) {
  const items = useCartStore((state) => state.items)
  if (items.length === 0) {
    return (
      <div className="space-y-5">
        <p>Tu carrito está vacío.</p>
        <Link to="/productos" onClick={onNavigate} className="inline-flex min-h-11 items-center text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring">Ver productos</Link>
      </div>
    )
  }
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">Podés ajustar tu selección. En el carrito completo verificamos precio y disponibilidad antes de continuar.</p>
      <ul>{items.map((item) => <CartItemRow key={item.idProduct} item={item} idPrefix="preview-product" onNavigate={onNavigate} />)}</ul>
      <div aria-live="polite" className="space-y-2 border-t pt-5">
        <p>Unidades: {calculateCartItemCount(items)}</p>
        <p className="text-xl font-semibold">Total: {formatCurrency(calculateCartTotal(items))}</p>
      </div>
      <Link to="/carrito" onClick={onNavigate} className="block min-h-11 rounded-md bg-primary px-4 py-3 text-center font-medium text-primary-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4">Ver carrito completo</Link>
    </div>
  )
}
