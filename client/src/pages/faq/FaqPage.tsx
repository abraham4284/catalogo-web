import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { storefrontContent } from '@/content/storefront-content'
import { StorefrontFaq } from '@/app/compositions/StorefrontFaq'
import { getWhatsAppGeneralInquiryHref } from '@/features/whatsapp/utils/whatsapp-general-inquiry'

export function FaqPage() {
  const { hash, key } = useLocation()
  const containerRef = useRef<HTMLDivElement>(null)
  const whatsappHref = getWhatsAppGeneralInquiryHref()

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
      <StorefrontFaq />
      <section aria-labelledby="faq-help" className="space-y-4 rounded-xl border bg-accent/40 p-5 sm:p-8">
        <h2 id="faq-help" className="text-xl font-semibold sm:text-2xl">¿No encontraste lo que buscabas?</h2>
        <p className="text-muted-foreground">Estamos para ayudarte con cualquier consulta.</p>
        <div className="flex flex-wrap gap-3">
          <Link to="/contacto" className="inline-flex min-h-11 items-center rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2">Contacto</Link>
          {whatsappHref && <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-lg border bg-card px-4 py-2 font-medium focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2">WhatsApp</a>}
        </div>
      </section>
    </div>
  )
}
