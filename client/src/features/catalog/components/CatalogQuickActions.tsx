import { useEffect, useRef, useState, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import { Dialog } from '@base-ui/react/dialog'
import { Link, useNavigate } from 'react-router-dom'
import { MagnifyingGlassIcon } from '@phosphor-icons/react/dist/csr/MagnifyingGlass'
import { SlidersHorizontalIcon } from '@phosphor-icons/react/dist/csr/SlidersHorizontal'
import type { CatalogCategory } from '../types/catalog.types'
import { getCatalogHref, type CatalogFilters } from '../utils/catalog-url'
import { CatalogSearch } from './CatalogSearch'
import { isCatalogQuickVisible } from '../utils/catalog-quick-visibility'

export type CatalogQuickActionsProps = {
  categories: readonly CatalogCategory[]
  categoryStatus: 'loading' | 'success' | 'error'
  filters: CatalogFilters
  controlsRef: RefObject<HTMLElement | null>
  productsRef: RefObject<HTMLElement | null>
}

export function CatalogQuickActions({ categories, categoryStatus, filters, controlsRef, productsRef }: CatalogQuickActionsProps) {
  const [visible, setVisible] = useState(false)
  const [mode, setMode] = useState<'filter' | 'search' | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const popupRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const controls = controlsRef.current
    const products = productsRef.current
    if (!controls || !products) return
    const update = () => setVisible(isCatalogQuickVisible(
      controls.getBoundingClientRect().bottom, products.getBoundingClientRect(), window.innerHeight,
    ))
    const controlsObserver = new IntersectionObserver(update, { rootMargin: '24px 0px 0px 0px' })
    const productsObserver = new IntersectionObserver(update, { rootMargin: '-180px 0px -100px 0px' })
    controlsObserver.observe(controls)
    productsObserver.observe(products)
    return () => { controlsObserver.disconnect(); productsObserver.disconnect() }
  }, [controlsRef, productsRef])

  useEffect(() => {
    if (!mode || !window.visualViewport) return
    const viewport = window.visualViewport
    const update = () => {
      popupRef.current?.style.setProperty('--keyboard-inset', `${Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop)}px`)
      popupRef.current?.style.setProperty('--quick-viewport-height', `${viewport.height}px`)
    }
    update()
    viewport.addEventListener('resize', update)
    return () => viewport.removeEventListener('resize', update)
  }, [mode])

  function search(value: string) {
    setMode(null)
    navigate(getCatalogHref({ ...filters, search: value, page: 1 }))
  }

  if (typeof document === 'undefined') return null
  return (
    <>
      {visible && <span hidden data-catalog-quick-context />}
      {mode && <span hidden data-catalog-quick-open />}
      {createPortal(
        <Dialog.Root open={mode !== null} onOpenChange={(open) => { if (!open) setMode(null) }}>
          <div data-catalog-quick-bar role="group" aria-label="Acciones del catálogo"
            className={`fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-20 flex -translate-x-1/2 divide-x divide-background/25 rounded-full border border-background/30 bg-foreground p-1 text-background shadow-md data-[obscured=true]:invisible ${!visible || mode ? 'invisible' : ''}`}>
            {[
              { value: 'filter' as const, label: 'Filtrar', Icon: SlidersHorizontalIcon, active: Boolean(filters.categorySlug) },
              { value: 'search' as const, label: 'Buscar', Icon: MagnifyingGlassIcon, active: Boolean(filters.search) },
            ].map(({ value, label, Icon, active }) => (
              <button key={value} type="button" aria-label={label} aria-description={active ? 'Filtro activo' : undefined} aria-haspopup="dialog" aria-expanded={mode === value}
                onClick={(event) => { triggerRef.current = event.currentTarget; setMode(value) }}
                className="inline-flex min-h-11 min-w-24 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium focus-visible:outline-2 focus-visible:outline-background focus-visible:-outline-offset-2">
                <Icon size={18} aria-hidden="true" />{label}
                {active && <span aria-hidden="true" className="size-1.5 rounded-full bg-background" />}
              </button>
            ))}
          </div>
          <Dialog.Portal>
            <Dialog.Backdrop className="fixed inset-0 z-40 bg-foreground/50" />
            <Dialog.Popup ref={popupRef}
              initialFocus={() => mode === 'search' ? document.getElementById('quick-catalog-search') : true}
              finalFocus={() => triggerRef.current?.isConnected && visible ? triggerRef.current : document.getElementById('main-content')}
              className="fixed bottom-[calc(max(1rem,env(safe-area-inset-bottom))+var(--keyboard-inset,0px))] left-1/2 z-50 max-h-[min(70dvh,calc(var(--quick-viewport-height,100dvh)-2rem))] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 overflow-y-auto overscroll-contain rounded-2xl border bg-background p-4 text-foreground shadow-xl focus:outline-none sm:p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <Dialog.Title className="text-lg font-semibold">{mode === 'filter' ? 'Filtrar por categoría' : 'Buscar productos o categorías'}</Dialog.Title>
                <Dialog.Close className="min-h-11 min-w-11 rounded-lg border px-3 text-sm focus-visible:outline-2 focus-visible:outline-ring">Cerrar</Dialog.Close>
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
                          onClick={() => setMode(null)}
                          className="flex min-h-11 items-center rounded-lg px-3 py-2 text-sm aria-[current=true]:bg-accent aria-[current=true]:font-semibold focus-visible:outline-2 focus-visible:outline-ring">
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : <CatalogSearch id="quick-catalog-search" search={filters.search} onSearch={search} />}
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>,
        document.body,
      )}
    </>
  )
}
