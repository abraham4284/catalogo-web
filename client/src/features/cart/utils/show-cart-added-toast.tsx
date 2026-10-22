import toast from 'react-hot-toast'
import { CheckCircleIcon } from '@phosphor-icons/react/dist/csr/CheckCircle'

export function showCartAddedToast(productName: string) {
  toast.success(
    <span className="min-w-0 text-left [overflow-wrap:anywhere]">
      <span className="block text-sm font-medium">Agregado al carrito</span>
      <span className="mt-1 block text-xs leading-5 text-muted-foreground">{productName}</span>
    </span>,
    {
      id: 'cart-added',
      icon: <CheckCircleIcon aria-hidden="true" size={20} weight="fill" className="shrink-0 text-foreground" />,
    },
  )
}
