type CatalogErrorStateProps = { message?: string }

export function CatalogErrorState({ message = 'No se pudo cargar el catálogo. Intentá nuevamente más tarde.' }: CatalogErrorStateProps) {
  return <p role="alert" className="text-foreground">{message}</p>
}
