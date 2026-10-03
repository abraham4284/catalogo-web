export type WhatsAppCheckoutItem = {
  name: string
  price: number
  quantity: number
}

export type WhatsAppProductInquiry = {
  name: string
  price: number
  availabilityStatus: WhatsAppInquiryAvailability
}

export type WhatsAppInquiryAvailability = 'in_stock' | 'out_of_stock' | 'on_order'
