import { Link } from 'react-router-dom'

export function StoreFooter({ note }: { note: string }) {
  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-10 text-sm sm:px-6 lg:px-8">
        <div className="space-y-3"><p className="text-xl font-semibold tracking-tight">Catálogo.</p><p className="max-w-sm leading-relaxed text-muted-foreground">{note}</p></div>
        <nav aria-label="Navegación del pie">
          <ul className="flex gap-4 sm:gap-6">
            <li>
              <Link to="/" className="inline-flex min-h-11 items-center py-2 hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4">
                Inicio
              </Link>
            </li>
            <li>
              <Link to="/productos" className="inline-flex min-h-11 items-center py-2 hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4">
                Productos
              </Link>
            </li>
            <li><Link to="/carrito" className="inline-flex min-h-11 items-center hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4">Carrito</Link></li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}
