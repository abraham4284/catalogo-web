import { useStorefrontPricing } from '@/app/compositions/useStorefrontPricing'
import { useCatalogBusinessStatus, loadCatalogBusiness } from '@/features/catalog'
import { trackInitiateCheckout } from '@/features/analytics'
import { Link } from 'react-router-dom'
import { useCartStore, CartItemRow, CartSummary, isCartReadyForInquiry } from '@/features/cart'
import { WhatsAppCheckoutLink } from '@/features/whatsapp'
import { useCartCatalogRevalidation } from '@/app/compositions/useCartCatalogRevalidation'

export function CartPage() {
  const items = useCartStore((state) => state.items)
  const pricing = useStorefrontPricing()
  const businessStatus = useCatalogBusinessStatus()
  const checkoutItems = pricing.lines.map(({ item, unitPrice, lineTotal }) => ({ name: item.name, quantity: item.quantity, unitPrice, lineTotal }))
  const analyticsItems = pricing.lines.map(({ item, unitPrice }) => ({ idProduct: item.idProduct, quantity: item.quantity, price: unitPrice }))
  const clearCart = useCartStore((state) => state.clearCart)
  const verification = useCartCatalogRevalidation(items)
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold">Carrito</h1>
      {items.length === 0 ? (
        <div className="space-y-4 rounded-xl border bg-muted/30 p-6 sm:p-10">
          <p className="text-muted-foreground">Tu carrito está vacío.</p>
          <Link to="/productos" className="inline-block underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring">Ver productos</Link>
        </div>
      ) : (
        <>
          <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <ul className="min-w-0 space-y-4">{pricing.lines.map(({ item, unitPrice, lineTotal }) => <CartItemRow unitPrice={unitPrice} lineTotal={lineTotal} pricingType={pricing.effectivePricingType} key={item.idProduct} item={item} verificationFailed={verification.failedProductIds.includes(item.idProduct)} />)}</ul>
            <div className="min-w-0 space-y-6 self-start">
              <CartSummary pricing={pricing} />
              {businessStatus === 'loading' && <p role="status" className="text-sm text-muted-foreground">Consultando condiciones mayoristas. Por ahora mostramos precios minoristas.</p>}
              {businessStatus === 'error' && <div className="space-y-2 text-sm"><p>No pudimos consultar las condiciones mayoristas. Podés continuar con precios minoristas.</p><button type="button" className="min-h-11 underline focus-visible:outline-2 focus-visible:outline-ring" onClick={() => { void loadCatalogBusiness(true) }}>Reintentar condiciones mayoristas</button></div>}
              {verification.status === 'success' && isCartReadyForInquiry(items) ? <WhatsAppCheckoutLink onCheckout={() => trackInitiateCheckout(analyticsItems)} items={checkoutItems} pricingType={pricing.effectivePricingType} /> : (
                <div className="space-y-3 rounded-xl border bg-muted/30 p-5">
                  <button type="button" disabled className="min-h-11 rounded-lg bg-primary px-5 py-3 text-primary-foreground opacity-50">Finalizar compra por WhatsApp</button>
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
