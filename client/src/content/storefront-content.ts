export const storefrontContent = {
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
