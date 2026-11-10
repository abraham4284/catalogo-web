import { ShareNetworkIcon } from '@phosphor-icons/react/dist/csr/ShareNetwork'
import toast from 'react-hot-toast'
import { shareProduct } from '../utils/share-product'

export function ProductShareButton({ name, slug }: { name: string; slug: string }) {
  async function handleShare() {
    const result = await shareProduct({ name, slug }, navigator)
    if (result === 'copied') toast.success('Enlace copiado')
    if (result === 'unavailable') toast.error('No pudimos compartir el enlace. Intentá de nuevo.')
  }

  return (
    <button type="button" aria-label="Compartir producto" onClick={handleShare} className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border bg-card text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2">
      <ShareNetworkIcon size={20} aria-hidden="true" />
    </button>
  )
}
