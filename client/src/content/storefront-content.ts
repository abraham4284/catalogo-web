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
    { title: 'Confirmá por WhatsApp', text: 'El carrito verifica precio y disponibilidad antes de habilitar la consulta. La coordinación final se realiza por WhatsApp.' },
  ],
  faq: [
    { question: '¿Cómo realizo una consulta?', answer: 'Podés consultar desde la ficha de un producto o reunir productos disponibles en el carrito y continuar por WhatsApp.' },
    { question: '¿Qué significa “Por encargo”?', answer: 'El producto se consulta directamente desde su ficha. Contactanos para confirmar las condiciones y el plazo del encargo.' },
    { question: '¿El carrito reserva stock?', answer: 'No. El carrito permite preparar una consulta; los productos no quedan reservados al agregarlos.' },
    { question: '¿El precio y la disponibilidad quedan confirmados al agregar al carrito?', answer: 'No. Al entrar al carrito se vuelven a verificar los datos. La confirmación final se realiza por WhatsApp.' },
  ],
  footerNote: 'Precio y disponibilidad se confirman antes de coordinar.',
} as const
