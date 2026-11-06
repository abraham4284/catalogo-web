import type { CartPricing } from '../domain/pricing'
import { formatCurrency } from '@/shared/utils/format-currency'
import { getWholesaleProgress } from '../utils/wholesale-progress'

export function CartPricingStatus({ pricing, variant = 'full' }: { pricing: CartPricing; variant?: 'full' | 'compact' }) {
  if (!pricing.wholesaleEnabled || pricing.lines.length === 0) return null
  const wholesale = pricing.effectivePricingType === 'WHOLESALE'
  const progress = getWholesaleProgress(pricing)

  return <div className="space-y-3 text-sm leading-relaxed">
    <p className="font-medium">{wholesale ? '✓ Accediste al precio mayorista' : 'Compra minorista'}</p>
    {!pricing.allItemsHaveWholesalePrice ? <p>Este carrito incluye productos que solo tienen precio minorista.</p> : <>
      {progress !== undefined && <>
        {variant === 'full' && !wholesale && <p className="text-muted-foreground">{formatCurrency(pricing.wholesaleCandidate)} de {formatCurrency(pricing.wholesaleMinimumAmount)} para precio mayorista</p>}
        <div
          role="progressbar"
          aria-label="Progreso hacia el precio mayorista"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          aria-valuetext={wholesale ? 'Mínimo mayorista alcanzado' : `${formatCurrency(pricing.wholesaleCandidate)} de ${formatCurrency(pricing.wholesaleMinimumAmount)}`}
          className="h-2 overflow-hidden rounded-full bg-muted"
        >
          <div className="h-full rounded-full bg-primary motion-safe:transition-[width] motion-safe:duration-200" style={{ width: `${progress}%` }} />
        </div>
      </>}
      <p>{wholesale ? `Ahorrás ${formatCurrency(pricing.wholesaleSavings)}` : `Te faltan ${formatCurrency(pricing.wholesaleAmountRemaining)} ${variant === 'compact' ? 'para mayorista.' : 'para acceder a precios mayoristas.'}`}</p>
    </>}
  </div>
}
