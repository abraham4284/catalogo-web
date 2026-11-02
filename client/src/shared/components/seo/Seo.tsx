import { useEffect } from 'react'
import { applySeo } from '@/shared/seo/seo-dom'
import type { SeoMetadata } from '@/shared/seo/seo'

// One active owner writes the full set. Reusing the HTML fallback prevents
// duplicate head tags; every non-product state also clears stale JSON-LD.
export function Seo({ metadata }: { metadata: SeoMetadata }) {
  useEffect(() => { applySeo(metadata) }, [metadata])
  return null
}
