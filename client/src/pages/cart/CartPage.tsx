import { Link } from 'react-router-dom'
import { useCartStore, CartItemRow, CartSummary } from '@/features/cart'

export function CartPage() {
  const items = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold">Carrito</h1>
      {items.length === 0 ? (
        <div className="space-y-4">
          <p className="text-muted-foreground">Tu carrito está vacío.</p>
          <Link to="/productos" className="inline-block underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring">Ver productos</Link>
        </div>
      ) : (
        <>
          <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <ul className="min-w-0">{items.map((item) => <CartItemRow key={item.idProduct} item={item} />)}</ul>
            <div className="min-w-0"><CartSummary items={items} /></div>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Link to="/productos" className="underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring">Seguir viendo productos</Link>
            <button type="button" onClick={clearCart} className="py-2 text-sm text-muted-foreground underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring">Vaciar carrito</button>
          </div>
        </>
      )}
    </div>
  )
}
