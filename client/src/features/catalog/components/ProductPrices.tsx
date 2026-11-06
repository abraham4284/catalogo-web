import { formatCurrency } from '@/shared/utils/format-currency'
import { useCatalogPricing } from '../store/business.store'

export function ProductPrices({ priceSale, priceWholesale, variant = 'card' }: {
  priceSale: number; priceWholesale: number | null; variant?: 'card' | 'detail'
}) {
  const policy = useCatalogPricing()
  const showWholesale = policy?.wholesaleEnabled === true
  const hasWholesale = showWholesale && priceWholesale !== null && Number.isFinite(priceWholesale) && priceWholesale > 0
  const retailLabel = variant === 'detail' ? 'Precio minorista' : 'Minorista'
  const wholesaleLabel = variant === 'detail' ? 'Precio mayorista' : 'Mayorista'
  const primaryClass = variant === 'detail' ? 'text-3xl font-semibold tracking-tight' : 'text-2xl font-semibold tracking-tight'

  return <dl className={`space-y-2 break-words ${showWholesale ? 'min-h-24' : 'min-h-14'}`}>
    <div className="flex flex-col-reverse">
      <dt className="text-xs text-muted-foreground">{hasWholesale ? wholesaleLabel : retailLabel}</dt>
      <dd className={primaryClass}>{formatCurrency(hasWholesale ? priceWholesale : priceSale)}</dd>
    </div>
    {showWholesale && (hasWholesale ? <div className="flex flex-wrap items-baseline gap-x-1 text-sm text-muted-foreground">
      <dt>{retailLabel}</dt>
      <dd>{formatCurrency(priceSale)}</dd>
    </div> : <div className="text-sm text-muted-foreground"><dt className="sr-only">Modalidad de venta</dt><dd>Solo minorista</dd></div>)}
  </dl>
}

export function WholesaleNotice({ priceWholesale }: { priceWholesale?: number | null } = {}) {
  const policy = useCatalogPricing()
  if (!policy?.wholesaleEnabled) return null
  if (priceWholesale !== undefined && !(priceWholesale !== null && Number.isFinite(priceWholesale) && priceWholesale > 0)) {
    return <p className="text-sm leading-relaxed text-muted-foreground">Este producto se vende solo a precio minorista.</p>
  }
  return <p className="text-sm leading-relaxed text-muted-foreground">Precio mayorista desde {formatCurrency(policy.wholesaleMinimumAmount)}. Podés combinar productos de distintas categorías.</p>
}
