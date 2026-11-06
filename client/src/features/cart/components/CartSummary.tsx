import { formatCurrency } from '@/shared/utils/format-currency'
import { calculateCartItemCount } from '../domain/cart'
import type { CartPricing } from '../domain/pricing'
import { CartPricingLabel, CartPricingStatus } from './CartPricingStatus'

export function CartSummary({ pricing }: { pricing: CartPricing }) {
  return <section aria-labelledby="cart-summary" className="space-y-5 bg-accent/40 p-6">
    <h2 id="cart-summary" className="text-xl font-semibold">Resumen</h2>
    <div aria-live="polite" className="space-y-3 break-words">
      <p>Productos: {calculateCartItemCount(pricing.lines.map(line => line.item))}</p>
      <CartPricingLabel pricingType={pricing.effectivePricingType} />
      <dl>
        <dt className="text-sm font-medium">{pricing.effectivePricingType === 'WHOLESALE' ? 'Total mayorista' : 'Total actual'}</dt>
        <dd className="mt-1 text-3xl font-semibold tracking-tight">{formatCurrency(pricing.effectiveSubtotal)}</dd>
      </dl>
      <CartPricingStatus pricing={pricing} />
    </div>
    {pricing.wholesaleEnabled && <p className="text-sm leading-relaxed text-muted-foreground">¿Ya sos cliente mayorista? Escribinos por WhatsApp para conservar tu condición mayorista.</p>}
  </section>
}
