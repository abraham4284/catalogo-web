export function isCatalogQuickVisible(controlsBottom: number, products: Pick<DOMRect, 'top' | 'bottom'>, viewportHeight: number) {
  return controlsBottom < -24 && products.top < viewportHeight - 100 && products.bottom > 180
}
