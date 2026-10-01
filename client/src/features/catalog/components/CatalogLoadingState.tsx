type CatalogLoadingStateProps = { message?: string }

export function CatalogLoadingState({ message = 'Cargando productos…' }: CatalogLoadingStateProps) {
  return <p role="status" aria-live="polite" className="text-muted-foreground">{message}</p>
}
