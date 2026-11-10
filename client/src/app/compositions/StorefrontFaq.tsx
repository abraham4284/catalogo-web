import { storefrontContent, WHOLESALE_CONDITIONS_ACTION } from '@/content/storefront-content'
import { getWhatsAppWholesaleInquiryHref } from '@/features/whatsapp/utils/whatsapp-general-inquiry'
import { FaqList } from '@/shared/components/guidance/FaqList'

export function StorefrontFaq() {
  const wholesaleHref = getWhatsAppWholesaleInquiryHref()

  return (
    <FaqList items={storefrontContent.faq} renderAction={(action) => {
      if (action !== WHOLESALE_CONDITIONS_ACTION || !wholesaleHref) return null
      return (
        <a href={wholesaleHref} target="_blank" rel="noopener noreferrer" className="mb-4 inline-flex min-h-11 items-center text-sm font-medium text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring">
          Consultar condiciones mayoristas por WhatsApp →
        </a>
      )
    }} />
  )
}
