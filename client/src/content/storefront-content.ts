import type { FaqEntry } from '@/shared/components/guidance/FaqList'

export const WHOLESALE_FAQ_ID = 'compras-minoristas-y-mayoristas'
export const WHOLESALE_CONDITIONS_ACTION = 'wholesale-conditions'

const baseStorefrontContent = {
  announcement: 'Explorá productos con stock y opciones por encargo · Consultas por WhatsApp',
  hero: {
    eyebrow: 'VITRUNO',
    title: 'Buenas elecciones, todos los días.',
    description: 'Productos útiles, atractivos y seleccionados con criterio. Explorá el catálogo y consultanos por WhatsApp.',
    ctaLabel: 'Ver productos',
    href: '/productos',
  },
  editorial: {
    eyebrow: 'Nuestra manera de elegir',
    title: 'Productos que tengan sentido para vos.',
    description: 'Objetos para distintos momentos, seleccionados con una idea simple: que valga la pena elegirlos.',
    note: 'Explorá lo disponible o consultá las condiciones de los productos por encargo. La conversación sigue por WhatsApp.',
    ctaLabel: 'Explorar el catálogo',
    href: '/productos',
  },
  steps: [
    { title: 'Explorá', text: 'Buscá productos y revisá si están disponibles o por encargo.' },
    { title: 'Agregá o consultá', text: 'Agregá los productos disponibles al carrito. Los productos por encargo se consultan directamente desde su ficha.' },
    { title: 'Finalizá por WhatsApp', text: 'El carrito verifica precio y disponibilidad antes de continuar. Luego coordinamos por WhatsApp el pago, la entrega y los datos necesarios para completar la compra.' },
  ],
  faq: [
    { question: '¿Cómo realizo una consulta?', answer: 'Podés consultar desde la ficha de un producto o reunir productos disponibles en el carrito y finalizar la compra por WhatsApp.' },
    { question: '¿El carrito reserva stock?', answer: 'No. Agregar productos al carrito no reserva stock; la disponibilidad se vuelve a verificar antes de continuar por WhatsApp.' },
    { question: '¿El precio y la disponibilidad quedan confirmados al agregar al carrito?', answer: 'No. El carrito vuelve a verificar precio y disponibilidad antes de continuar. La compra se coordina y confirma por WhatsApp.' },
    { question: '¿Realizan envíos a todo el país?', answer: 'Sí. Realizamos envíos a todo el país. Antes de despachar coordinamos con vos el medio de envío, el costo y los datos necesarios para realizar la entrega.' },
    { question: '¿Cuánto demora mi pedido?', answer: 'El tiempo de entrega depende de tu localidad y del medio de envío elegido. Al coordinar la compra te informamos el plazo estimado antes de realizar el despacho.' },
    { question: '¿Qué medios de pago aceptan?', answer: 'Aceptamos transferencias bancarias, transferencias mediante billeteras virtuales y pagos en efectivo. Al finalizar la compra coordinamos por WhatsApp el medio de pago y los datos necesarios.' },
  ],
  footerNote: 'Precio y disponibilidad se confirman antes de coordinar.',
} as const

const orderFaq = {
  question: 'Compras por encargo',
  answer: 'Los productos por encargo requieren confirmar precio, disponibilidad y plazo. Para reservar el pedido solicitamos un anticipo del 30% del valor total acordado.',
  items: [
    { question: '¿Cómo funciona una compra por encargo?', answer: 'El producto no está disponible para entrega inmediata. Consultanos desde su ficha o por WhatsApp: verificamos modelo o variante, disponibilidad, precio final y plazo, y te enviamos una cotización. La consulta sola no confirma la operación.' },
    { question: '¿Cómo se realiza el pago?', answer: 'Solicitamos un anticipo del 30% del precio final acordado como pago a cuenta; resta abonar el 70%. El encargo se confirma solo después de tu aceptación expresa y de la acreditación del anticipo. Una vez disponible y verificado el artículo, abonás el saldo según la cotización aceptada y antes de coordinar la entrega.' },
    { question: '¿Cuánto demora y qué pasa si no se consigue?', answer: 'Te informamos una fecha o un plazo concreto antes de recibir el anticipo y te avisamos si surgen demoras. Si no podemos cumplir en las condiciones acordadas, te devolvemos íntegramente el anticipo o podés aceptar voluntariamente una alternativa. No sustituimos el producto ni modificamos el precio unilateralmente.' },
    { question: '¿Puedo cancelar el pedido? ¿Tiene garantía?', answer: 'Cancelación y arrepentimiento: contactanos por WhatsApp para solicitar la cancelación o ejercer los derechos legales que correspondan a tu operación, incluido el derecho de arrepentimiento cuando resulte aplicable. No aplicamos retenciones automáticas del anticipo. Garantía: es independiente de la cancelación; los productos por encargo conservan las garantías y los derechos legales aplicables. Si el artículo presenta un inconveniente, contactanos para gestionarlo.' },
  ],
} as const satisfies FaqEntry

const wholesaleFaq = {
  id: WHOLESALE_FAQ_ID,
  question: 'Compras minoristas y mayoristas',
  answer: 'Conocé qué precio se aplica a tu compra y cómo acceder al beneficio mayorista.',
  items: [
    { question: '¿Cuál es la diferencia entre precio minorista y mayorista?', answer: 'El precio minorista se aplica a las compras que no alcanzan las condiciones mayoristas. Algunos productos también tienen un precio mayorista, que puede aplicarse automáticamente cuando el carrito alcanza el mínimo vigente.' },
    { question: '¿Hay un monto mínimo de compra para acceder a precios mayoristas?', answer: 'Sí. Las condiciones y mínimos pueden variar según la categoría. Consultanos por WhatsApp para conocer los requisitos mayoristas vigentes.', action: WHOLESALE_CONDITIONS_ACTION },
    { question: '¿Cómo se calcula el mínimo mayorista?', answer: 'El progreso se calcula usando los precios mayoristas de los productos de tu carrito. Por eso el total minorista de tu compra puede ser mayor al importe que aparece en el progreso mayorista.' },
    { question: '¿Qué pasa si no llego al mínimo?', answer: 'Podés comprar igualmente. Si el carrito no alcanza el mínimo mayorista, la compra continúa utilizando los precios minoristas. Alcanzar el mínimo no es obligatorio para realizar una compra.' },
    { question: '¿Qué significa “Solo minorista”?', answer: 'Ese producto puede comprarse normalmente a precio minorista, pero no cuenta con precio mayorista. Si el carrito incluye un producto solo minorista, no se activa automáticamente la modalidad mayorista para ese pedido.' },
    { question: '¿Ya soy cliente mayorista?', answer: 'Si ya comprás como mayorista, escribinos por WhatsApp para consultar las condiciones aplicables a tu pedido.' },
  ],
} as const satisfies FaqEntry

const orderProductFaq = {
  question: '¿Cómo confirmo una compra por encargo?',
  answer: 'Consultanos por WhatsApp para confirmar precio, disponibilidad y plazo. El encargo requiere tu aceptación expresa y la acreditación del anticipo del 30% a cuenta del precio acordado. Consultar no confirma una compra. Revisá las condiciones completas en Preguntas frecuentes.',
} as const

export const storefrontContent = {
  ...baseStorefrontContent,
  social: {
    instagram: 'https://www.instagram.com/vitruno.ar/',
    facebook: 'https://www.facebook.com/people/Vitruno/61595884155088/',
  },
  faq: [...baseStorefrontContent.faq, wholesaleFaq, orderFaq],
  orderProductNotice: 'Para confirmar tu encargo se solicita un anticipo del 30% del valor total. Antes de abonar, confirmamos precio, disponibilidad y plazo de entrega.',
  orderNotice: 'Consultar no constituye una compra. El encargo se confirma únicamente después de aceptar expresamente las condiciones y acreditarse el anticipo. Antes de abonar confirmamos disponibilidad, precio final y plazo.',
  orderSteps: [
    { title: 'Consultá', text: 'Elegí el producto marcado Por encargo y escribinos por WhatsApp.' },
    { title: 'Confirmamos', text: 'Verificamos modelo o variante, precio final, disponibilidad y plazo; te enviamos las condiciones de la cotización.' },
    { title: 'Confirmá el encargo', text: 'Si aceptás expresamente la cotización, abonás el 30% como anticipo a cuenta del total acordado.' },
    { title: 'Lo gestionamos', text: 'Compramos el artículo al proveedor y te informamos las novedades.' },
    { title: 'Recibí tu compra', text: 'Una vez disponible y verificada, abonás el 70% restante y coordinamos la entrega según lo acordado.' },
  ],
} as const

export function getProductFaq(status: 'in_stock' | 'out_of_stock' | 'on_order') {
  return status === 'on_order' ? [orderProductFaq]
    : [baseStorefrontContent.faq[3], baseStorefrontContent.faq[5], baseStorefrontContent.faq[1]]
}
