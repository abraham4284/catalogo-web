import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { CatalogBusiness } from '@/features/catalog'
import { storefrontContent } from '@/content/storefront-content'

function BusinessLogo({ src, name }: { src: string; name: string }) {
  const [failed, setFailed] = useState(false)
  return failed ? null : <img src={src} alt={`Logo de ${name}`} width={48} height={48} onError={() => setFailed(true)} className="size-12 shrink-0 rounded-lg border bg-background object-contain p-1" />
}

export function HomeHero({ business }: { business?: CatalogBusiness }) {
  const content = storefrontContent.hero
  return <section className="grid min-w-0 gap-8 rounded-xl bg-muted p-6 sm:p-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:p-12">
    <div className="min-w-0 space-y-6">
      {business && <div className="flex items-center gap-3">{business.logoUrl && <BusinessLogo key={business.logoUrl} src={business.logoUrl} name={business.name} />}<p className="min-w-0 break-words text-sm font-medium">{business.name}</p></div>}
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{content.eyebrow}</p>
      <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">{content.title}</h1>
      <p className="max-w-md leading-relaxed text-muted-foreground">{content.description}</p>
      <div className="flex flex-wrap gap-3"><Link to={content.href} className="inline-flex min-h-11 items-center rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4">{content.ctaLabel}<span aria-hidden="true" className="ml-6">→</span></Link><a href="#como-comprar" className="inline-flex min-h-11 items-center rounded-lg border border-foreground/20 px-5 py-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4">Cómo comprar</a></div>
    </div>
    <div aria-hidden="true" className="hidden items-end justify-end lg:flex"><div className="relative flex aspect-square w-full max-w-72 items-center justify-center rounded-full border border-foreground/10"><div className="flex size-48 items-center justify-center rounded-full border border-foreground/15"><span className="text-7xl font-light text-foreground/70">↗</span></div><span className="absolute bottom-6 right-0 rounded-lg bg-background px-6 py-4 text-sm shadow-sm">{content.decoration}</span></div></div>
  </section>
}
