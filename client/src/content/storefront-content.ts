export const storefrontContent = {
  announcement: 'Productos con stock y por encargo · Consultas por WhatsApp',
  hero: { decoration: 'Explorá. Consultá. Coordiná.', eyebrow: 'Explorá a tu manera', title: 'Encontrá lo que estás buscando.', description: 'Conocé los productos, revisá sus detalles y conversemos por WhatsApp.', ctaLabel: 'Ver productos', href: '/productos' },
  banners: [
    { id: 'catalogo', eyebrow: 'Nuestro catálogo', title: 'Opciones para descubrir', description: 'Explorá productos disponibles y opciones por encargo.', ctaLabel: 'Explorar productos', href: '/productos' },
    { id: 'encargos', eyebrow: 'Por encargo', title: 'Una consulta, más posibilidades', description: 'Revisá la ficha del producto y consultá las condiciones y el plazo del encargo.', ctaLabel: 'Ver catálogo', href: '/productos' },
  ],
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
