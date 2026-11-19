import { useEffect, useRef, useState, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import { Dialog } from '@base-ui/react/dialog'
import { Link, useNavigate } from 'react-router-dom'
import { MagnifyingGlassIcon } from '@phosphor-icons/react/dist/csr/MagnifyingGlass'
import { SlidersHorizontalIcon } from '@phosphor-icons/react/dist/csr/SlidersHorizontal'
import type { CatalogCategory } from '../types/catalog.types'
import { getCatalogHref, type CatalogFilters } from '../utils/catalog-url'
import { QuickCatalogSearch } from './QuickCatalogSearch'
import { useCatalogQuickVisibility } from '../hooks/useCatalogQuickVisibility'

export type CatalogQuickActionsProps = {
  categories: readonly CatalogCategory[]
  categoryStatus: 'loading' | 'success' | 'error'
  filters: CatalogFilters
  productsRef: RefObject<HTMLElement | null>
}

export function CatalogQuickActions({ categories, categoryStatus, filters, productsRef }: CatalogQuickActionsProps) {
  const visible = useCatalogQuickVisibility(productsRef)
  const [mode, setMode] = useState<'filter' | 'search'>('filter')
  const [open, setOpen] = useState(false)
  const [present, setPresent] = useState(false)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const popupRef = useRef<HTMLDivElement | null>(null)
  const searchDestinationRef = useRef<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!present || !window.visualViewport) return
    const viewport = window.visualViewport
    const update = () => {
      popupRef.current?.style.setProperty('--keyboard-inset', `${Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop)}px`)
      popupRef.current?.style.setProperty('--quick-viewport-height', `${viewport.height}px`)
    }
    update()
    viewport.addEventListener('resize', update)
    return () => viewport.removeEventListener('resize', update)
  }, [present])

  function search(value: string, categorySlug?: string) {
    searchDestinationRef.current = getCatalogHref({ ...filters, search: value, categorySlug, page: 1 })
    setOpen(false)
  }

  function finishClose(isOpen: boolean) {
    if (isOpen) return
    setPresent(false)
    const destination = searchDestinationRef.current
    searchDestinationRef.current = null
    // Keep the submitted capsule mounted until Base UI finishes its exit.
    if (destination) navigate(destination)
  }

  if (typeof document === 'undefined') return null
  return (
    <>
      {visible && <span hidden data-catalog-quick-context />}
      {present && <span hidden data-catalog-quick-open />}
      {createPortal(
        <Dialog.Root open={open} onOpenChange={setOpen} onOpenChangeComplete={finishClose}>
          <div data-catalog-quick-bar role="group" aria-label="Acciones del catálogo"
            className={`fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-20 flex -translate-x-1/2 divide-x divide-background/25 rounded-full border border-background/30 bg-foreground p-1 text-background shadow-md transition-[opacity,scale] duration-200 ease-out motion-reduce:scale-100 motion-reduce:transition-none ${!visible || present ? 'invisible pointer-events-none scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
            {[
              { value: 'filter' as const, label: 'Filtrar', Icon: SlidersHorizontalIcon, active: Boolean(filters.categorySlug) },
              { value: 'search' as const, label: 'Buscar', Icon: MagnifyingGlassIcon, active: Boolean(filters.search) },
            ].map(({ value, label, Icon, active }) => (
              <button key={value} type="button" aria-label={label} aria-description={active ? 'Filtro activo' : undefined} aria-haspopup="dialog" aria-expanded={open && mode === value}
                onClick={(event) => { triggerRef.current = event.currentTarget; setMode(value); setPresent(true); setOpen(true) }}
                className="inline-flex min-h-11 min-w-24 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium focus-visible:outline-2 focus-visible:outline-background focus-visible:-outline-offset-2">
                <Icon size={18} aria-hidden="true" />{label}
                {active && <span aria-hidden="true" className="size-1.5 rounded-full bg-background" />}
              </button>
            ))}
          </div>
          <Dialog.Portal>
            <Dialog.Backdrop className="fixed inset-0 z-40 bg-foreground/50 transition-opacity duration-200 ease-out data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 data-[ending-style]:duration-150 motion-reduce:transition-none" />
            <Dialog.Popup ref={popupRef}
              initialFocus={() => mode === 'search' ? document.getElementById('quick-catalog-search') : true}
              finalFocus={() => triggerRef.current?.isConnected && visible ? triggerRef.current : document.getElementById('main-content')}
              className={`fixed bottom-[calc(max(1rem,env(safe-area-inset-bottom))+var(--keyboard-inset,0px))] left-1/2 z-50 max-h-[min(70dvh,calc(var(--quick-viewport-height,100dvh)-2rem))] w-[calc(100%-2rem)] -translate-x-1/2 transition-[opacity,translate,scale] ease-out data-[starting-style]:translate-y-2 data-[starting-style]:opacity-0 data-[ending-style]:translate-y-2 data-[ending-style]:opacity-0 data-[ending-style]:duration-150 motion-reduce:translate-y-0 motion-reduce:transition-none motion-reduce:data-[starting-style]:translate-y-0 motion-reduce:data-[ending-style]:translate-y-0 overflow-y-auto overscroll-contain border text-foreground focus:outline-none ${mode === 'search' ? 'duration-[220ms] data-[starting-style]:scale-[0.94] data-[ending-style]:scale-[0.96] motion-reduce:scale-100 motion-reduce:data-[starting-style]:scale-100 motion-reduce:data-[ending-style]:scale-100 max-w-2xl rounded-[2rem] border-background/70 bg-background/90 p-2 shadow-[0_0_32px_6px_color-mix(in_srgb,var(--primary)_38%,transparent)] backdrop-blur-sm sm:p-3' : 'duration-200 max-w-md rounded-2xl bg-background p-4 shadow-xl sm:p-5'}`}>
              <div className={mode === 'search' ? 'sr-only' : 'mb-3 flex items-center justify-between gap-3'}>
                <Dialog.Title className="text-lg font-semibold">{mode === 'filter' ? 'Filtrar por categoría' : 'Buscar productos o categorías'}</Dialog.Title>
                {mode === 'filter' && <Dialog.Close className="min-h-11 min-w-11 rounded-lg border px-3 text-sm focus-visible:outline-2 focus-visible:outline-ring">Cerrar</Dialog.Close>}
              </div>
              <Dialog.Description className="sr-only">Elegí una categoría o enviá una búsqueda. Podés cerrar con Escape.</Dialog.Description>
              {mode === 'filter' ? (
                <div className="space-y-3">
                  {categoryStatus !== 'success' && <p role="status" className="text-sm text-muted-foreground">{categoryStatus === 'loading' ? 'Cargando categorías…' : 'No pudimos cargar las categorías. Podés seguir buscando.'}</p>}
                  {categoryStatus === 'success' && categories.length === 0 && <p className="text-sm text-muted-foreground">Todavía no hay categorías disponibles.</p>}
                  <ul className="divide-y">
                    {[{ name: 'Todas las categorías', slug: undefined }, ...categories].map((category) => (
                      <li key={category.slug ?? 'all'}>
                        <Link to={getCatalogHref({ ...filters, categorySlug: category.slug, page: 1 })}
                          aria-current={filters.categorySlug === category.slug ? 'true' : undefined}
                          onClick={() => setOpen(false)}
                          className="flex min-h-11 items-center rounded-lg px-3 py-2 text-sm aria-[current=true]:bg-accent aria-[current=true]:font-semibold focus-visible:outline-2 focus-visible:outline-ring">
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : <QuickCatalogSearch categories={categories} filters={filters} onSearch={search} />}
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>,
        document.body,
      )}
    </>
  )
}
