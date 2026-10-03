import type { AddCartItemInput } from '@/features/cart'
import { toCartSnapshot, type CommerceProduct } from './catalog-cart-snapshot'

export type CartVerificationTarget = Pick<AddCartItemInput, 'idProduct' | 'slug'>
export type CartVerificationResult = { snapshots: AddCartItemInput[]; failedProductIds: number[] }
type FetchProduct = (slug: string, signal: AbortSignal) => Promise<CommerceProduct>

export function getCartVerificationKey(items: readonly CartVerificationTarget[]): string {
  return JSON.stringify(items.map(({ idProduct, slug }) => ({ idProduct, slug }))
    .sort((a, b) => a.idProduct - b.idProduct))
}

export async function revalidateCartProducts(
  targets: readonly CartVerificationTarget[], fetchProduct: FetchProduct, signal: AbortSignal,
): Promise<CartVerificationResult | undefined> {
  if (signal.aborted) return undefined
  const results = await Promise.allSettled(targets.map(async (target) => {
    const product = await fetchProduct(target.slug, signal)
    if (product.idProduct !== target.idProduct || product.slug !== target.slug) {
      throw new Error('La identidad del producto no coincide.')
    }
    // Catalog permite nombres vacíos; el carrito necesita un nombre utilizable para la consulta.
    if (!product.name.trim()) throw new Error('El producto no tiene un nombre válido para el carrito.')
    return toCartSnapshot(product)
  }))
  if (signal.aborted) return undefined
  const snapshots: AddCartItemInput[] = []
  const failedProductIds: number[] = []
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') snapshots.push(result.value)
    else failedProductIds.push(targets[index].idProduct)
  })
  return { snapshots, failedProductIds }
}
