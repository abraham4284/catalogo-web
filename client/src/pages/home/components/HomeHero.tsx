import { Link } from 'react-router-dom'
import { BrandLogo } from '@/shared/components/brand/BrandLogo'
import { storefrontContent } from '@/content/storefront-content'
import { ProductImage } from '@/shared/components/media/ProductImage'
import type { CatalogProductListItem } from '@/features/catalog'

type HomeHeroProps = {
  status: 'loading' | 'success' | 'error'
  product?: Pick<CatalogProductListItem, 'name' | 'slug' | 'imageUrl'>
}

function HeroVisual({ status, product }: HomeHeroProps) {
  const visualProduct = status === 'success' ? product : undefined
  const surface = status === 'loading' ? 'bg-muted motion-safe:animate-pulse'
    : visualProduct ? 'bg-card p-5' : 'bg-foreground p-5'
  const content = (
    <>
      <div className={`flex aspect-[4/5] max-h-112 items-center justify-center ${surface}`}>
        {status === 'loading' ? null : visualProduct
          ? <ProductImage src={visualProduct.imageUrl} alt={visualProduct.name} loading="eager" />
          : <BrandLogo variant="mark" decorative className="w-56" />}
      </div>
      <p className="line-clamp-2 h-10 break-words text-sm leading-5 text-muted-foreground">
        {visualProduct && <>{visualProduct.name}<span aria-hidden="true" className="ml-3 text-primary">↗</span></>}
      </p>
    </>
  )
  return visualProduct ? (
    <Link to={`/productos/${visualProduct.slug}`} aria-label={`Ver ${visualProduct.name}`} className="block space-y-3 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4">{content}</Link>
  ) : <div aria-hidden="true" className="space-y-3">{content}</div>
}

export function HomeHero({ status, product }: HomeHeroProps) {
  const content = storefrontContent.hero
  return (
    <section className="grid min-w-0 items-center gap-10 py-2 sm:py-6 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
      <div className="min-w-0 space-y-6 py-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">{content.eyebrow}</p>
        <h1 className="max-w-2xl text-5xl font-semibold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">{content.title}</h1>
        <p className="max-w-md leading-relaxed text-muted-foreground">{content.description}</p>
        <div className="flex flex-wrap gap-3">
          <Link to={content.href} className="inline-flex min-h-11 items-center rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4">{content.ctaLabel}<span aria-hidden="true" className="ml-6">→</span></Link>
          <a href="#como-comprar" className="inline-flex min-h-11 items-center rounded-lg border border-input px-5 py-3 text-sm font-medium hover:bg-secondary focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4">Cómo comprar</a>
        </div>
      </div>
      <div className="hidden min-w-0 md:block">
        <HeroVisual status={status} product={product} />
      </div>
    </section>
  )
}
