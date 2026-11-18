import { Link } from 'react-router-dom'
import { storefrontContent } from '@/content/storefront-content'
import { getCatalogHref, type CatalogCategory } from '@/features/catalog'

function normalizeCategory(value: string) {
  return value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/-/g, ' ').replace(/\s+/g, ' ').trim()
}

export function HomeCategories({ categories }: { categories: readonly CatalogCategory[] }) {
  if (!categories.length) return null

  const used = new Set<string>()
  const unique = [...new Map(categories.map((category) => [category.slug, category])).values()]
  const featured = storefrontContent.homeCategories.flatMap((card) => {
    const findCategory = (match: string) => categories.find(({ slug, name }) =>
      !used.has(slug) && (match === normalizeCategory(name) || match === normalizeCategory(slug)),
    )
    const preferred = card.matches.map(findCategory).find(Boolean)
    const category = preferred ?? ('fallback' in card ? findCategory(card.fallback) : undefined)
    if (!category) return []
    used.add(category.slug)
    return [{ ...card, title: preferred ? card.title : category.name, slug: category.slug }]
  })

  return (
    <section aria-labelledby="home-categories" className="space-y-4">
      <h2 id="home-categories" className="text-2xl font-semibold tracking-tight sm:text-3xl">Explorá por categoría</h2>
      {featured.length > 0 && (
        <ul className={`grid gap-4 ${featured.length === 3 ? 'sm:grid-cols-3' : featured.length === 2 ? 'sm:grid-cols-2' : 'sm:max-w-lg'}`}>
          {featured.map(({ title, slug, image }) => (
            <li key={slug} className="min-w-0">
              <Link to={getCatalogHref({ page: 1, categorySlug: slug })} className="group relative isolate flex min-h-44 items-center overflow-hidden rounded-xl border bg-accent p-4 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4 lg:min-h-54 lg:p-5">
                <img src={image} alt="" loading="lazy" width={2000} height={1294} className="absolute inset-0 size-full object-cover object-right" />
                <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,var(--accent)_42%,transparent_74%)]" />
                <span className="relative flex w-[58%] flex-col items-start gap-3 lg:w-[54%]">
                  <span className="text-lg leading-tight font-semibold lg:text-2xl">{title}</span>
                  <span className="text-sm font-semibold text-primary underline-offset-4 group-hover:underline">Ver productos <span aria-hidden="true">→</span></span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {unique.some(({ slug }) => !used.has(slug)) && (
        <ul aria-label="Más categorías" className="flex flex-wrap gap-2">
          {unique.filter(({ slug }) => !used.has(slug)).map(({ slug, name }) => (
            <li key={slug} className="min-w-0 max-w-full">
              <Link to={getCatalogHref({ page: 1, categorySlug: slug })} className="inline-flex min-h-11 items-center rounded-full border px-4 py-2 text-sm hover:border-primary hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4">{name}</Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
