import { useState, type FormEvent } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { MagnifyingGlassIcon } from '@phosphor-icons/react/dist/csr/MagnifyingGlass'
import { XIcon } from '@phosphor-icons/react/dist/csr/X'
import type { CatalogCategory } from '../types/catalog.types'
import type { CatalogFilters } from '../utils/catalog-url'

type QuickCatalogSearchProps = {
  categories: readonly CatalogCategory[]
  filters: CatalogFilters
  onSearch: (value: string, categorySlug?: string) => void
}

export function QuickCatalogSearch({ categories, filters, onSearch }: QuickCatalogSearchProps) {
  const [categoryRemoved, setCategoryRemoved] = useState(false)
  const category = categories.find(({ slug }) => slug === filters.categorySlug)
  const categorySlug = categoryRemoved ? undefined : filters.categorySlug
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = new FormData(event.currentTarget).get('search')
    onSearch(typeof value === 'string' ? value.trim() : '', categorySlug)
  }
  return (
    <form role="search" aria-label="Búsqueda rápida" onSubmit={submit}>
      <div className="flex items-center gap-1 sm:gap-2">
        <MagnifyingGlassIcon size={20} aria-hidden="true" className="ml-2 shrink-0 text-muted-foreground" />
        <label htmlFor="quick-catalog-search" className="sr-only">Buscar productos o categorías</label>
        <input id="quick-catalog-search" name="search" type="search" enterKeyHint="search" maxLength={150} defaultValue={filters.search ?? ''} placeholder="¿Qué estás buscando?" className="min-h-11 min-w-0 flex-1 rounded-full bg-background px-1 text-sm focus-visible:outline-2 focus-visible:outline-ring sm:px-2 sm:text-base" />
        <button type="submit" className="min-h-11 rounded-full bg-primary px-3 text-sm font-medium text-primary-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 sm:px-5">Buscar</button>
        <Dialog.Close aria-label="Cerrar búsqueda" className="inline-flex size-11 shrink-0 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-ring"><XIcon size={18} aria-hidden="true" /></Dialog.Close>
      </div>
      {categorySlug && <div className="mt-2 flex flex-wrap items-center gap-x-2 px-3 text-xs text-muted-foreground">
        <span>{category ? 'Buscando en:' : 'Filtro de categoría activo:'}</span>
        <button type="button" onClick={() => setCategoryRemoved(true)} aria-label={`Quitar filtro de categoría${category ? ` ${category.name}` : ''}`} className="inline-flex min-h-11 max-w-full items-center gap-2 rounded-full bg-muted px-3 text-foreground focus-visible:outline-2 focus-visible:outline-ring">
          <span className="min-w-0 truncate">{category?.name ?? 'Categoría seleccionada'}</span><XIcon size={14} aria-hidden="true" className="shrink-0" />
        </button>
      </div>}
      {filters.search && <button type="button" onClick={() => onSearch('', categorySlug)} className="min-h-11 rounded-full px-3 text-xs underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring">Limpiar búsqueda</button>}
    </form>
  )
}
