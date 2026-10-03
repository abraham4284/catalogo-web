import type { FormEvent } from 'react'

type CatalogSearchProps = { search?: string; onSearch: (value: string) => void }

export function CatalogSearch({ search = '', onSearch }: CatalogSearchProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = new FormData(event.currentTarget).get('search')
    onSearch(typeof value === 'string' ? value.trim() : '')
  }

  return (
    <form onSubmit={handleSubmit} role="search" className="space-y-3 rounded-xl border bg-muted/30 p-4 sm:p-6">
      <label htmlFor="catalog-search" className="text-sm font-medium">Buscar productos</label>
      <div className="flex flex-wrap gap-2">
        <input key={search} id="catalog-search" name="search" type="search" maxLength={150} defaultValue={search} className="min-h-11 min-w-0 flex-1 basis-40 rounded-lg border bg-background px-3 py-2 focus-visible:outline-2 focus-visible:outline-ring" />
        <button type="submit" className="min-h-11 rounded-lg bg-primary px-5 py-2 text-primary-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4">Buscar</button>
        {search && <button type="button" onClick={() => onSearch('')} className="px-3 py-2 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring">Limpiar búsqueda</button>}
      </div>
    </form>
  )
}
