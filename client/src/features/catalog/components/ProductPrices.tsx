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

// The global wholesale explanation belongs to the catalog, not individual SKUs.
export function WholesaleNotice({ inquiryHref }: { inquiryHref?: string }) {
  const policy = useCatalogPricing()
  if (!policy?.wholesaleEnabled) return null
  return <p className="text-sm leading-relaxed text-muted-foreground">
    ¿Querés acceder a precios mayoristas? Consultanos las condiciones vigentes según categoría.
    {inquiryHref && (
      <>{' '}<a href={inquiryHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2">Consultar condiciones →</a></>
    )}
  </p>
}
