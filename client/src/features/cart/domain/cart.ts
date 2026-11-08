import { moneyLineCents, sumCents } from '@/shared/utils/money'
import type { CartItem, AddCartItemInput, CartAvailabilityStatus } from '../types/cart.types'

export function isCartItemInStock(item: Pick<AddCartItemInput, 'availabilityStatus' | 'stockAvailable'>): boolean {
  return item.availabilityStatus === 'in_stock' && item.stockAvailable > 0
}

export function isCartItemQuantityValid(item: CartItem): boolean {
  return Number.isSafeInteger(item.quantity) && item.quantity >= 1 && item.quantity <= item.stockAvailable
}

export function canIncrementCartItem(item: CartItem): boolean {
  return isCartItemInStock(item) && item.quantity < item.stockAvailable
}

export function isCartReadyForInquiry(items: readonly CartItem[]): boolean {
  return items.length > 0 && Number.isFinite(calculateCartTotal(items)) && items.every((item) => isCartItemInStock(item) && isCartItemQuantityValid(item))
}

export function calculateCartLineTotal(item: CartItem): number {
  return moneyLineCents(item.priceSale, item.quantity) / 100
}

export function calculateCartTotal(items: readonly CartItem[]): number {
  return sumCents(items.map(item => moneyLineCents(item.priceSale, item.quantity))) / 100
}

export function calculateCartItemCount(items: readonly CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0)
}

export function getCartAvailabilityLabel(status: CartAvailabilityStatus): string {
  const labels: Record<CartAvailabilityStatus, string> = {
    in_stock: 'Disponible', out_of_stock: 'Agotado', on_order: 'Por encargo',
  }
  return labels[status]
}
