import type { CartItem, AddCartItemInput } from '../types/cart.types'

export function isCartItemAvailable(item: Pick<AddCartItemInput, 'available' | 'stockAvailable'>): boolean {
  return item.available && item.stockAvailable > 0
}

export function isCartItemQuantityValid(item: CartItem): boolean {
  return Number.isSafeInteger(item.quantity) && item.quantity >= 1 && item.quantity <= item.stockAvailable
}

export function canIncrementCartItem(item: CartItem): boolean {
  return isCartItemAvailable(item) && item.quantity < item.stockAvailable
}

export function isCartReadyForInquiry(items: readonly CartItem[]): boolean {
  return items.length > 0 && items.every((item) => isCartItemAvailable(item) && isCartItemQuantityValid(item))
}

export function calculateCartLineTotal(item: CartItem): number {
  return item.price * item.quantity
}

export function calculateCartTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + calculateCartLineTotal(item), 0)
}

export function calculateCartItemCount(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0)
}
