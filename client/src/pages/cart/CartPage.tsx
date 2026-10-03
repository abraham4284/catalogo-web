import { Link } from 'react-router-dom'
import { useCartStore, CartItemRow, CartSummary, isCartReadyForInquiry } from '@/features/cart'
import { WhatsAppCheckoutLink } from '@/features/whatsapp'
import { useCartCatalogRevalidation } from '@/app/compositions/useCartCatalogRevalidation'

export function CartPage() {
  const items = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)
  const verification = useCartCatalogRevalidation(items)
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
            <ul className="min-w-0">{items.map((item) => <CartItemRow key={item.idProduct} item={item} verificationFailed={verification.failedProductIds.includes(item.idProduct)} />)}</ul>
            <div className="min-w-0 space-y-6">
              <CartSummary items={items} />
              {verification.status === 'success' && isCartReadyForInquiry(items) ? <WhatsAppCheckoutLink items={items} /> : (
                <div className="space-y-3">
                  <button type="button" disabled className="min-h-11 bg-primary px-5 py-3 text-primary-foreground opacity-50">Consultar por WhatsApp</button>
                  <p role="status" aria-live="polite" className="text-sm">
                    {verification.status === 'loading' ? 'Verificando precio y disponibilidad…'
                      : verification.status === 'error' ? 'No pudimos verificar la disponibilidad actual de todos los productos. Reintentá antes de continuar.'
                        : 'Revisá los productos con cambios de disponibilidad antes de continuar.'}
                  </p>
                  {verification.status === 'error' && <button type="button" onClick={verification.retry} className="min-h-11 border px-4 py-3 text-sm focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4">Reintentar verificación</button>}
                </div>
              )}
            </div>
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
