import { Link } from 'react-router-dom'

type HomeBannerContent = { eyebrow: string; title: string; description: string; ctaLabel: string; href: string }

export function HomeBanner({ content }: { content: HomeBannerContent }) {
  return <div className="flex h-full flex-col items-start gap-3 rounded-xl border bg-card p-6 sm:p-8">
    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{content.eyebrow}</p>
    <h2 className="text-xl font-semibold tracking-tight">{content.title}</h2>
    <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">{content.description}</p>
    <Link to={content.href} className="mt-auto inline-flex min-h-11 items-center gap-3 text-sm font-medium underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring">{content.ctaLabel}<span aria-hidden="true">↗</span></Link>
  </div>
}
