import { storefrontContent } from '@/content/storefront-content'

export function HomeBuyingGuide() {
  return (
    <>
      <section id="como-comprar" aria-labelledby="buying-heading" className="scroll-mt-8 space-y-6 border-t pt-10">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Paso a paso</p>
          <h2 id="buying-heading" className="text-3xl font-semibold tracking-tight">Cómo comprar</h2>
        </div>
        <ol className="grid gap-6 md:grid-cols-3">
          {storefrontContent.steps.map((step, index) => (
            <li key={step.title} className="space-y-3 rounded-xl bg-muted/60 p-6">
              <span aria-hidden="true" className="text-sm font-medium text-muted-foreground">0{index + 1}</span>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>
      <section aria-labelledby="faq-heading" className="grid gap-6 border-t pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <h2 id="faq-heading" className="text-3xl font-semibold tracking-tight">Preguntas frecuentes</h2>
        <div className="min-w-0 divide-y rounded-xl border px-5">
          {storefrontContent.faq.map((item) => (
            <details key={item.question} className="py-1">
              <summary className="min-h-11 cursor-pointer py-4 text-sm font-medium focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2">{item.question}</summary>
              <p className="max-w-prose pb-5 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  )
}
