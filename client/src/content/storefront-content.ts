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
    { question: '¿Qué significa “Por encargo”?', answer: 'El producto se consulta directamente desde su ficha. Contactanos para confirmar las condiciones y el plazo del encargo.' },
    { question: '¿El carrito reserva stock?', answer: 'No. Agregar productos al carrito no reserva stock; la disponibilidad se vuelve a verificar antes de continuar por WhatsApp.' },
    { question: '¿El precio y la disponibilidad quedan confirmados al agregar al carrito?', answer: 'No. El carrito vuelve a verificar precio y disponibilidad antes de continuar. La compra se coordina y confirma por WhatsApp.' },
    { question: '¿Realizan envíos a todo el país?', answer: 'Sí. Realizamos envíos a todo el país. Antes de despachar coordinamos con vos el medio de envío, el costo y los datos necesarios para realizar la entrega.' },
    { question: '¿Cuánto demora mi pedido?', answer: 'El tiempo de entrega depende de tu localidad y del medio de envío elegido. Al coordinar la compra te informamos el plazo estimado antes de realizar el despacho.' },
    { question: '¿Qué medios de pago aceptan?', answer: 'Aceptamos transferencias bancarias, transferencias mediante billeteras virtuales y pagos en efectivo. Al finalizar la compra coordinamos por WhatsApp el medio de pago y los datos necesarios.' },
  ],
  footerNote: 'Precio y disponibilidad se confirman antes de coordinar.',
} as const

export const orderFaq = [
  { question: '¿Cómo funciona una compra por encargo?', answer: 'Consultanos desde la ficha. Primero verificamos el modelo o variante, la disponibilidad, el precio final y el plazo. El encargo se confirma cuando aceptás expresamente las condiciones y se acredita el anticipo correspondiente. Consultar no confirma una compra.' },
  { question: '¿Debo abonar un anticipo?', answer: 'Sí. Para confirmar compras por encargo solicitamos un anticipo estándar del 30% del valor final acordado. Es un pago a cuenta que se descuenta del precio total; el 70% restante se abona posteriormente según las condiciones confirmadas. Antes de abonar confirmamos disponibilidad, precio final y plazo.' },
  { question: '¿Cuándo pago el saldo restante?', answer: 'Cuando el producto está disponible y verificamos que corresponde a lo solicitado, te contactamos para coordinar el pago del saldo del 70% y la entrega, de acuerdo con la cotización aceptada.' },
  { question: '¿Cuánto demora un encargo?', answer: 'Depende del artículo y del proveedor. Te informamos una fecha o un plazo de entrega antes de recibir el anticipo. Si surge una demora, te avisamos y coordinamos las alternativas que correspondan según lo acordado.' },
  { question: '¿Qué significa que un producto esté “Por encargo”?', answer: 'No está disponible para entrega inmediata, pero podemos gestionar su compra a través de nuestros proveedores. Antes de confirmar el pedido, te informamos el precio final, la disponibilidad y el plazo de entrega acordado.' },
  { question: '¿Qué pasa si VITRUNO no consigue el producto?', answer: 'Si no podemos cumplir con las condiciones acordadas, podés solicitar la devolución íntegra del anticipo o aceptar libremente una alternativa. Mantenemos el precio total acordado luego de confirmar; no cambiaremos el producto ni el precio sin tu consentimiento.' },
  { question: '¿Puedo cancelar una compra por encargo?', answer: 'Podés solicitar la cancelación contactándonos. Las condiciones de cada operación y los derechos que correspondan se informan antes de confirmar el encargo.' },
  { question: '¿Los productos por encargo tienen garantía?', answer: 'Los productos por encargo mantienen las garantías y derechos aplicables a la operación. Si necesitás gestionar un inconveniente, contactanos.' },
  { question: '¿Los productos por encargo tienen precio publicado?', answer: 'Cuando contamos con un precio final confirmado y vigente, lo mostramos en la ficha. Si el valor necesita una nueva confirmación, te informamos las condiciones antes de aceptar el pedido y recibir cualquier anticipo.' },
] as const

export const storefrontContent = {
  ...baseStorefrontContent,
  faq: [...baseStorefrontContent.faq.filter((_, index) => index !== 1), ...orderFaq],
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
  return status === 'on_order' ? [orderFaq[0], orderFaq[1], orderFaq[5]]
    : [baseStorefrontContent.faq[4], baseStorefrontContent.faq[6], baseStorefrontContent.faq[2]]
}
