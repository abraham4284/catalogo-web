import type { WholesalePolicy, PricingType } from '@/shared/types/pricing'
import { moneyLineCents, sumCents } from '@/shared/utils/money'
import type { CartItem } from '../types/cart.types'

export function hasValidWholesalePrice(value: number | null | undefined): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0
}

export function calculateCartPricing(items: readonly CartItem[], policy?: WholesalePolicy) {
  const allItemsHaveWholesalePrice = items.length > 0 && items.every(item => hasValidWholesalePrice(item.priceWholesale))
  const retailCents = sumCents(items.map(item => moneyLineCents(item.priceSale, item.quantity)))
  const candidateCents = sumCents(items.map(item => hasValidWholesalePrice(item.priceWholesale) ? moneyLineCents(item.priceWholesale, item.quantity) : 0))
  const minimumCents = policy ? moneyLineCents(policy.wholesaleMinimumAmount) : NaN
  const wholesaleEnabled = policy?.wholesaleEnabled === true && Number.isFinite(minimumCents) && minimumCents >= 0
  const qualifies = wholesaleEnabled && allItemsHaveWholesalePrice && Number.isFinite(candidateCents) && candidateCents >= minimumCents
  const effectivePricingType: PricingType = qualifies ? 'WHOLESALE' : 'RETAIL'
  const lines = items.map(item => {
    const unitPrice = qualifies && hasValidWholesalePrice(item.priceWholesale) ? item.priceWholesale : item.priceSale
    return { item, unitPrice, lineTotal: moneyLineCents(unitPrice, item.quantity) / 100 }
  })
  return {
    lines, effectivePricingType, allItemsHaveWholesalePrice, wholesaleEnabled,
    retailSubtotal: retailCents / 100,
    wholesaleCandidate: candidateCents / 100,
    effectiveSubtotal: (qualifies ? candidateCents : retailCents) / 100,
    wholesaleAmountRemaining: wholesaleEnabled && allItemsHaveWholesalePrice ? Math.max(minimumCents - candidateCents, 0) / 100 : 0,
    wholesaleSavings: qualifies ? Math.max(retailCents - candidateCents, 0) / 100 : 0,
    wholesaleMinimumAmount: policy?.wholesaleMinimumAmount ?? 0,
  }
}
export type CartPricing = ReturnType<typeof calculateCartPricing>
