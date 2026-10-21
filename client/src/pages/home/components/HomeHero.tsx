import { Link } from 'react-router-dom'
import { BrandLogo } from '@/shared/components/brand/BrandLogo'
import { storefrontContent } from '@/content/storefront-content'
import { ProductImage } from '@/shared/components/media/ProductImage'
import type { CatalogProductListItem } from '@/features/catalog'

type HomeHeroProps = { product?: Pick<CatalogProductListItem, 'name' | 'slug' | 'imageUrl'> }

export function HomeHero({ product }: HomeHeroProps) {
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
      {product?.imageUrl ? (
        <Link to={`/productos/${product.slug}`} aria-label={`Ver ${product.name}`} className="hidden min-w-0 space-y-3 md:block focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4">
          <div className="flex aspect-[4/5] max-h-112 items-center justify-center bg-card p-5">
            <ProductImage src={product.imageUrl} alt={product.name} loading="eager" />
          </div>
          <p className="break-words text-sm text-muted-foreground">{product.name}<span aria-hidden="true" className="ml-3 text-primary">↗</span></p>
        </Link>
      ) : (
        <div aria-hidden="true" className="hidden items-center justify-center bg-foreground py-12 md:flex">
          <BrandLogo variant="mark" decorative className="w-56" />
        </div>
      )}
    </section>
  )
}
