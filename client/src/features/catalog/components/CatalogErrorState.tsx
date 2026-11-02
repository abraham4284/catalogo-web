type CatalogErrorStateProps = { message?: string; onRetry?: () => void }

export function CatalogErrorState({ onRetry, message = 'No se pudo cargar el catálogo. Intentá nuevamente más tarde.' }: CatalogErrorStateProps) {
  return <div className="space-y-3"><p role="alert" className="text-foreground">{message}</p>{onRetry && <button type="button" onClick={onRetry} className="min-h-11 rounded-md border px-4 py-2 focus-visible:outline-2 focus-visible:outline-ring">Reintentar</button>}</div>
}
