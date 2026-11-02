import { buildCanonical, type SeoMetadata } from '@/shared/seo/seo'

function page(path: string, title: string, description: string, robots: SeoMetadata['robots'] = 'index,follow'): SeoMetadata {
  return { title, description, canonical: buildCanonical(path), robots }
}

export const routeSeo: Readonly<Record<string, SeoMetadata>> = {
  home: page('/', 'VITRUNO | Buenas elecciones, todos los días.', 'VITRUNO: productos útiles, atractivos y seleccionados con criterio. Explorá el catálogo y consultanos por WhatsApp.'),
  catalog: page('/productos', 'Productos | VITRUNO', 'Explorá el catálogo de VITRUNO y encontrá productos disponibles y por encargo.'),
  howToBuy: page('/como-comprar', 'Cómo comprar | VITRUNO', 'Conocé cómo comprar en VITRUNO, cómo funciona el carrito y cómo finalizamos la compra por WhatsApp.'),
  faq: page('/preguntas-frecuentes', 'Preguntas frecuentes | VITRUNO', 'Consultá información sobre envíos, medios de pago, productos por encargo y disponibilidad en VITRUNO.'),
  contact: page('/contacto', 'Contacto | VITRUNO', 'Contactate con VITRUNO y prepará tu consulta para continuar por WhatsApp.'),
  cart: page('/carrito', 'Carrito | VITRUNO', 'Revisá tu selección y verificá precio y disponibilidad antes de finalizar por WhatsApp.', 'noindex,follow'),
}

export function getNotFoundSeo(path: string): SeoMetadata {
  return page(path, 'Página no encontrada | VITRUNO', 'La dirección solicitada no existe. Volvé al inicio o explorá los productos de VITRUNO.', 'noindex,follow')
}
