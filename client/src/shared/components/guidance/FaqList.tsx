import type { ReactNode } from 'react'

type FaqItem = { id?: string; question: string; answer: string; action?: string; items?: never }
type FaqGroup = { id?: string; question: string; answer: string; action?: never; items: readonly FaqItem[] }
export type FaqEntry = FaqItem | FaqGroup

export function FaqList({ items, renderAction }: {
  items: readonly FaqEntry[]
  renderAction?: (action: string) => ReactNode
}) {
  return (
    <div className="min-w-0 divide-y border-t">
      {items.map((item) => (
        <details id={item.id} key={item.id ?? item.question} className={item.id ? "scroll-mt-6 py-1" : "py-1"}>
          <summary className="min-h-11 cursor-pointer py-4 text-sm font-medium focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2">{item.question}</summary>
          <p className="max-w-prose pb-5 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
          {item.action && renderAction?.(item.action)}
          {item.items && (
            <div className="mb-5 ml-2 border-l pl-4 sm:ml-4 sm:pl-6">
              <FaqList items={item.items} renderAction={renderAction} />
            </div>
          )}
        </details>
      ))}
    </div>
  )
}
