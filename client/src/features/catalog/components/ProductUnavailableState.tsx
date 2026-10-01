import { Link } from 'react-router-dom'

export function ProductUnavailableState() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">Producto no disponible</h1>
      <p className="text-muted-foreground">Este producto no está disponible en este momento.</p>
      <Link to="/productos" className="inline-block underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4">Volver a productos</Link>
    </section>
  )
}
