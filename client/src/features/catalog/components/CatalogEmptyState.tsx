export function CatalogEmptyState({ filtered = false }: { filtered?: boolean }) {
  return <p role="status" className="py-8 text-muted-foreground">{filtered ? 'No encontramos productos con esos filtros.' : 'Todavía no hay productos publicados.'}</p>
}
