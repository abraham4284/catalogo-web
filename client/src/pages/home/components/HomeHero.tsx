import { Link } from 'react-router-dom'
import { BrandLogo } from '@/shared/components/brand/BrandLogo'
import { storefrontContent } from '@/content/storefront-content'

export function HomeHero() {
  const content = storefrontContent.hero
  return (
    <section className="grid min-w-0 gap-8 rounded-xl border bg-card p-6 sm:p-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:p-12">
      <div className="min-w-0 space-y-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-foreground"><span aria-hidden="true" className="mr-3 inline-block h-0.5 w-6 align-middle bg-brand-teal" />{content.eyebrow}</p>
        <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">{content.title}</h1>
        <p className="max-w-md leading-relaxed text-muted-foreground">{content.description}</p>
        <div className="flex flex-wrap gap-3">
          <Link to={content.href} className="inline-flex min-h-11 items-center rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4">{content.ctaLabel}<span aria-hidden="true" className="ml-6">→</span></Link>
          <a href="#como-comprar" className="inline-flex min-h-11 items-center rounded-lg border border-input px-5 py-3 text-sm font-medium hover:bg-secondary focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4">Cómo comprar</a>
        </div>
      </div>
      <div aria-hidden="true" className="hidden flex-col items-center justify-center gap-4 lg:flex">
        <BrandLogo variant="mark" decorative className="w-56 rounded-xl" />
        <span className="border-b-2 border-brand-gold pb-3 text-sm text-muted-foreground">{content.decoration}</span>
      </div>
    </section>
  )
}
