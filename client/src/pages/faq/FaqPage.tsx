import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { storefrontContent } from '@/content/storefront-content'
import { FaqList } from '@/shared/components/guidance/FaqList'

export function FaqPage() {
  const { hash, key } = useLocation()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const targetId = hash.slice(1)
    if (!storefrontContent.faq.some(entry => 'id' in entry && entry.id === targetId)) return
    // Run after route focus and native history restoration; keep details uncontrolled.
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(targetId)
      if (!(target instanceof HTMLDetailsElement) || !containerRef.current?.contains(target)) return
      target.open = true
      target.scrollIntoView({ behavior: 'auto', block: 'start' })
    })
    return () => cancelAnimationFrame(frame)
  }, [hash, key])

  return (
    <div ref={containerRef} className="mx-auto max-w-3xl space-y-8">
      <h1 className="text-3xl font-semibold sm:text-4xl">Preguntas frecuentes</h1>
      <p className="text-muted-foreground">Encontrá información sobre compras minoristas y mayoristas, encargos, disponibilidad, envíos y medios de pago.</p>
      <FaqList items={storefrontContent.faq} />
      <Link to="/contacto" className="inline-flex min-h-11 items-center text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring">¿Tenés otra consulta? Contactanos</Link>
    </div>
  )
}
