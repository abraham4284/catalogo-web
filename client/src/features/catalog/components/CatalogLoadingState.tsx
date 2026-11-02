import { ProductGridSkeleton } from './ProductSkeletons'
export function CatalogLoadingState({ message = 'Cargando productos…' }: { message?: string }) {
  return <ProductGridSkeleton message={message} />
}
