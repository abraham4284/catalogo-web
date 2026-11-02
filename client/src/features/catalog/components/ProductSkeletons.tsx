import { Skeleton } from '@/shared/components/ui/Skeleton'

export function ProductCardSkeleton() {
  return <div aria-hidden="true" className="min-w-0 space-y-5 p-1">
    <Skeleton className="aspect-square w-full rounded-xl" />
    <div className="space-y-3"><Skeleton className="h-4 w-24" /><Skeleton className="h-6 w-4/5" /><Skeleton className="h-16 w-full" /><Skeleton className="h-7 w-28" /><Skeleton className="h-6 w-24 rounded-full" /></div>
    <Skeleton className="h-11 w-full" /><Skeleton className="h-11 w-full" />
  </div>
}

export function ProductGridSkeleton({ count = 8, message = 'Cargando productos…' }: { count?: number; message?: string }) {
  return <div aria-busy="true" data-skeleton="products">
    <p role="status" className="sr-only">{message}</p>
    <div aria-hidden="true" className="grid grid-cols-1 gap-x-4 gap-y-8 min-[540px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 sm:gap-x-6">
      {Array.from({ length: count }, (_, index) => <ProductCardSkeleton key={index} />)}
    </div>
  </div>
}

export function ProductDetailSkeleton() {
  return <div aria-busy="true" data-skeleton="detail" className="min-w-0 space-y-12">
    <h1 className="sr-only">Detalle de producto</h1><p role="status" className="sr-only">Cargando producto…</p>
    <Skeleton className="h-5 w-3/4" />
    <div aria-hidden="true" className="grid min-w-0 gap-8 lg:grid-cols-2 lg:gap-12">
      <div className="grid min-w-0 gap-4 lg:grid-cols-[5.5rem_minmax(0,1fr)]">
        <Skeleton className="aspect-square w-full rounded-xl lg:col-start-2 lg:row-start-1" />
        <div className="flex gap-3 overflow-hidden p-1 lg:col-start-1 lg:row-start-1 lg:flex-col">{[0, 1, 2].map((n) => <Skeleton key={n} className="size-20 shrink-0 rounded-lg" />)}</div>
      </div>
      <div className="min-w-0 space-y-6 py-2 lg:pl-4"><Skeleton className="h-5 w-32" /><Skeleton className="h-20 w-full" /><Skeleton className="h-9 w-40" /><Skeleton className="h-6 w-24 rounded-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-11 w-full" /><Skeleton className="h-11 w-full" /></div>
    </div>
    <Skeleton className="h-8 w-1/2" /><Skeleton className="h-28 w-full" />
  </div>
}
