export function getSecondProductRowIndex(tops: readonly number[]) {
  return tops.findIndex((top) => top > tops[0] + 1)
}

export function isCatalogQuickVisible(secondRowTop: number | null, viewportHeight: number) {
  return secondRowTop !== null && viewportHeight > 0 && secondRowTop <= viewportHeight * 0.65
}
