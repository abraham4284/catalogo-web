import { Dialog } from '@base-ui/react/dialog'
import type { ReactNode } from 'react'

type SidePanelProps = {
  open: boolean
  title: string
  onClose: () => void
  getReturnFocus: () => HTMLElement | null
  children: ReactNode
}

export function SidePanel({ open, title, onClose, getReturnFocus, children }: SidePanelProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => { if (!nextOpen) onClose() }}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-foreground/50 transition-opacity duration-200 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 motion-reduce:transition-none" />
        <Dialog.Popup
          id="store-panel"
          finalFocus={() => {
            const target = getReturnFocus()
            return target
              ? target.isConnected && !target.matches(':disabled') ? target : document.getElementById('cart-access')
              : document.getElementById('main-content')
          }}
          className="fixed inset-y-0 right-0 z-50 flex w-[92vw] max-w-105 flex-col bg-background text-foreground shadow-xl transition-transform duration-250 ease-out data-[starting-style]:translate-x-full data-[ending-style]:translate-x-full focus:outline-none motion-reduce:transition-none"
        >
          <div className="flex shrink-0 items-center justify-between gap-3 border-b px-5 py-4">
            <Dialog.Title className="text-xl font-semibold">{title}</Dialog.Title>
            <Dialog.Close className="min-h-11 min-w-11 rounded-md border px-3 text-sm focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2">Cerrar</Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">Panel lateral. Podés cerrarlo con el botón Cerrar o con Escape.</Dialog.Description>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 [overflow-wrap:anywhere]">
            {children}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
