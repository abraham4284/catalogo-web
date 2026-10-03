import type { ProductRichContent } from '../types/catalog.types'

export function ProductRichContentRenderer({ content }: { content: ProductRichContent }) {
  return (
    <div className="min-w-0 space-y-6 break-words leading-relaxed [overflow-wrap:anywhere]">
      {content.blocks.map((block, index) => {
        switch (block.type) {
          case 'heading':
            return block.level === 2
              ? <h2 key={index} className="text-2xl font-semibold">{block.text}</h2>
              : <h3 key={index} className="text-lg font-semibold">{block.text}</h3>
          case 'paragraph':
            return <p key={index} className="max-w-prose whitespace-pre-line text-muted-foreground">{block.text}</p>
          case 'list': {
            const List = block.style === 'numbered' ? 'ol' : 'ul'
            return <List key={index} className={`max-w-prose space-y-2 pl-6 ${block.style === 'numbered' ? 'list-decimal' : 'list-disc'}`}>
              {block.items.map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}
            </List>
          }
          case 'specs':
            return <dl key={index} className="max-w-3xl divide-y overflow-hidden rounded-xl border bg-card">
              {block.items.map((item, itemIndex) => <div key={itemIndex} className="grid gap-1 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] sm:gap-4">
                <dt className="font-medium">{item.label}</dt>
                <dd className="text-muted-foreground">{item.value}</dd>
              </div>)}
            </dl>
        }
      })}
    </div>
  )
}
