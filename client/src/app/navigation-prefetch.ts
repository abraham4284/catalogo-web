import { loadCatalogPage, loadContactPage, loadFaqPage, loadHowToBuyPage } from './route-loaders'

const navigationLoaders = new Map<string, () => Promise<unknown>>([
  ['/productos', loadCatalogPage],
  ['/contacto', loadContactPage],
  ['/como-comprar', loadHowToBuyPage],
  ['/preguntas-frecuentes', loadFaqPage],
])

export function prefetchRoute(href: string) {
  const load = navigationLoaders.get(href)
  // Intent is opportunistic; the router remains responsible for actual navigation.
  if (load) void load().catch(() => {})
}
