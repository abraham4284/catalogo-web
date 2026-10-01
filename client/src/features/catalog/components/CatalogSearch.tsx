import type { FormEvent } from 'react'

type CatalogSearchProps = { search?: string; onSearch: (value: string) => void }

export function CatalogSearch({ search = '', onSearch }: CatalogSearchProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = new FormData(event.currentTarget).get('search')
    onSearch(typeof value === 'string' ? value.trim() : '')
  }

  return (
    <form onSubmit={handleSubmit} role="search" className="space-y-2">
      <label htmlFor="catalog-search" className="text-sm font-medium">Buscar productos</label>
      <div className="flex flex-wrap gap-2">
        <input key={search} id="catalog-search" name="search" type="search" maxLength={150} defaultValue={search} className="min-w-0 flex-1 basis-40 border bg-background px-3 py-2 focus-visible:outline-2 focus-visible:outline-ring" />
        <button type="submit" className="bg-primary px-4 py-2 text-primary-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4">Buscar</button>
        {search && <button type="button" onClick={() => onSearch('')} className="px-3 py-2 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring">Limpiar búsqueda</button>}
      </div>
    </form>
  )
}
