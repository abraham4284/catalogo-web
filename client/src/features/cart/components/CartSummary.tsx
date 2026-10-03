import { formatCurrency } from '@/shared/utils/format-currency'
import { calculateCartItemCount, calculateCartTotal } from '../domain/cart'
import type { CartItem } from '../types/cart.types'

export function CartSummary({ items }: { items: CartItem[] }) {
  return (
    <section aria-labelledby="cart-summary" className="space-y-5 rounded-xl border bg-card p-6">
      <h2 id="cart-summary" className="text-xl font-semibold">Resumen</h2>
      <div aria-live="polite" className="space-y-3 break-words">
        <p>Productos: {calculateCartItemCount(items)}</p>
        <p className="border-t pt-4 text-2xl font-semibold">Total: {formatCurrency(calculateCartTotal(items))}</p>
      </div>
    </section>
  )
}
