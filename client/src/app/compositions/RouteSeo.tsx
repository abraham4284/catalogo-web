import { useLocation, useMatches } from 'react-router-dom'
import { Seo } from '@/shared/components/seo/Seo'
import { routeSeo, getNotFoundSeo } from '@/content/seo-content'

export function RouteSeo() {
  const { pathname } = useLocation()
  const routeId = useMatches().at(-1)?.id
  if (routeId === 'product') return null
  return <Seo metadata={routeSeo[routeId ?? ''] ?? getNotFoundSeo(pathname)} />
}
