import type { CartPricing } from '../domain/pricing'
import { formatCurrency } from '@/shared/utils/format-currency'

export function CartPricingStatus({ pricing }: { pricing: CartPricing }) {
  if (!pricing.wholesaleEnabled || pricing.lines.length === 0) return null
  return <div className="space-y-2 text-sm leading-relaxed">
    {pricing.effectivePricingType === 'WHOLESALE' ? <><p className="font-medium">✓ Accediste al precio mayorista</p><p>Ahorrás {formatCurrency(pricing.wholesaleSavings)}</p></>
      : <><p>Compra minorista</p><p>{pricing.allItemsHaveWholesalePrice ? `Te faltan ${formatCurrency(pricing.wholesaleAmountRemaining)} para acceder a precios mayoristas.` : 'Este carrito incluye productos sin precio mayorista disponible.'}</p></>}
  </div>
}
