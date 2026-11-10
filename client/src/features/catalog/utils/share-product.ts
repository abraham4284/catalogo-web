import { buildCanonical } from '@/shared/seo/seo'

export async function shareProduct(
  { name, slug }: { name: string; slug: string },
  browser: Partial<Pick<Navigator, 'share' | 'clipboard'>>,
): Promise<'shared' | 'cancelled' | 'copied' | 'unavailable'> {
  const url = buildCanonical(`/productos/${slug}`)
  if (browser.share) {
    try {
      await browser.share({ title: name, text: `Mirá ${name} en VITRUNO`, url })
      return 'shared'
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return 'cancelled'
    }
  }
  try {
    if (!browser.clipboard) return 'unavailable'
    await browser.clipboard.writeText(url)
    return 'copied'
  } catch {
    return 'unavailable'
  }
}
