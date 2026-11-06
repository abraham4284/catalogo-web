import type { CartPricing } from '../domain/pricing'
import { formatCurrency } from '@/shared/utils/format-currency'
import { getWholesaleProgress } from '../utils/wholesale-progress'

export function CartPricingLabel({ pricingType }: { pricingType: CartPricing['effectivePricingType'] }) {
  return <p className="text-sm font-medium">{pricingType === 'WHOLESALE' ? '✓ Precio mayorista desbloqueado' : 'Compra minorista'}</p>
}

export function CartPricingStatus({ pricing, variant = 'full' }: { pricing: CartPricing; variant?: 'full' | 'compact' }) {
  if (!pricing.wholesaleEnabled || pricing.lines.length === 0) return null
  const wholesale = pricing.effectivePricingType === 'WHOLESALE'
  const progress = getWholesaleProgress(pricing)

  if (!pricing.allItemsHaveWholesalePrice) {
    return <p className="border-t pt-4 text-sm leading-relaxed">Este carrito incluye productos que solo tienen precio minorista.</p>
  }

  return <div className={`space-y-3 text-sm leading-relaxed ${wholesale ? '' : 'border-t pt-4'}`}>
    {wholesale ? <p>Ahorrás {formatCurrency(pricing.wholesaleSavings)}</p> : <>
      {variant === 'full' && <h3 className="font-medium">Acceso mayorista</h3>}
      {progress !== undefined && <div className="space-y-1">
        <p className="text-muted-foreground">Progreso mayorista</p>
        <p className="font-medium tabular-nums">{formatCurrency(pricing.wholesaleCandidate)} / {formatCurrency(pricing.wholesaleMinimumAmount)}</p>
      </div>}
    </>}
    {progress !== undefined && <div
      role="progressbar"
      aria-label="Progreso hacia el precio mayorista"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      aria-valuetext={wholesale ? 'Mínimo mayorista alcanzado' : `${formatCurrency(pricing.wholesaleCandidate)} de ${formatCurrency(pricing.wholesaleMinimumAmount)} en valor mayorista`}
      className="h-2 overflow-hidden rounded-full bg-muted"
    >
      <div className="h-full rounded-full bg-primary motion-safe:transition-[width] motion-safe:duration-200" style={{ width: `${progress}%` }} />
    </div>}
    {!wholesale && <>
      <p>Te faltan {formatCurrency(pricing.wholesaleAmountRemaining)} {variant === 'compact' ? 'para mayorista.' : 'para acceder a precios mayoristas.'}</p>
      <p className="text-sm text-muted-foreground">{variant === 'compact' ? 'Calculado con precios mayoristas.' : 'El progreso se calcula usando los precios mayoristas de los productos de tu carrito.'}</p>
    </>}
  </div>
}
