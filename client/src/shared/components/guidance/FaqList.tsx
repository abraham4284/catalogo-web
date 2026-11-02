type FaqItem = { question: string; answer: string; items?: never }
type FaqGroup = { question: string; answer: string; items: readonly FaqItem[] }
export type FaqEntry = FaqItem | FaqGroup

export function FaqList({ items }: { items: readonly FaqEntry[] }) {
  return (
    <div className="min-w-0 divide-y border-t">
      {items.map((item) => (
        <details key={item.question} className="py-1">
          <summary className="min-h-11 cursor-pointer py-4 text-sm font-medium focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2">{item.question}</summary>
          <p className="max-w-prose pb-5 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
          {item.items && (
            <div className="mb-5 ml-2 border-l pl-4 sm:ml-4 sm:pl-6">
              <FaqList items={item.items} />
            </div>
          )}
        </details>
      ))}
    </div>
  )
}
