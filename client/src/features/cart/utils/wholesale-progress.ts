import type { CartPricing } from '../domain/pricing'

type ProgressInput = Pick<CartPricing, 'wholesaleEnabled' | 'lines' | 'allItemsHaveWholesalePrice' | 'wholesaleCandidate' | 'wholesaleMinimumAmount'>

// Visual derivation only: eligibility and amounts remain owned by cart pricing.
export function getWholesaleProgress(pricing: ProgressInput): number | undefined {
  const { wholesaleEnabled, lines, allItemsHaveWholesalePrice, wholesaleCandidate, wholesaleMinimumAmount } = pricing
  if (!wholesaleEnabled || lines.length === 0 || !allItemsHaveWholesalePrice
    || !Number.isFinite(wholesaleCandidate) || wholesaleCandidate < 0
    || !Number.isFinite(wholesaleMinimumAmount) || wholesaleMinimumAmount <= 0) return undefined
  return Math.min(wholesaleCandidate / wholesaleMinimumAmount, 1) * 100
}
