import { WhatsappLogoIcon } from '@phosphor-icons/react/dist/csr/WhatsappLogo'
import type { Ref } from 'react'
import { getWhatsAppGeneralInquiryHref } from '../utils/whatsapp-general-inquiry'

export function FloatingWhatsAppButton({ anchorRef, obscured = false }: { anchorRef?: Ref<HTMLAnchorElement>; obscured?: boolean }) {
  const href = getWhatsAppGeneralInquiryHref()
  if (!href) return null

  return (
    <a
      ref={anchorRef}
      style={{ visibility: obscured ? 'hidden' : undefined }}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Consultar por WhatsApp"
      className="fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-20 flex size-14 items-center justify-center rounded-full bg-[#128C4E] text-white shadow-md hover:bg-[#0F753F] focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4 sm:right-[max(1.5rem,env(safe-area-inset-right))] sm:bottom-[max(1.5rem,env(safe-area-inset-bottom))]"
    >
      <WhatsappLogoIcon size={30} weight="fill" aria-hidden="true" />
    </a>
  )
}
