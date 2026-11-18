# QA del rediseño comercial de Home — 2026-11-18

Rama dev, HEAD cc02be4. Al iniciar, los cinco WebP eran archivos locales sin seguimiento dentro de client/public/images/home. Se usaron con sus nombres originales y se comprobó que build copia los mismos archivos byte por byte a client/dist/images/home.

HomePage compone hero, categorías, banner de apertura y producto destacado junto a ProductGrid. El copy y las rutas de las imágenes están en storefront-content.ts. La selección del producto agrega priceSale al tipo y conserva su candidato y el fallback disponible con imagen. Si el candidato existe sin imagen y tampoco hay fallback con imagen, la tarjeta muestra Sin imagen. Si no hay producto válido, se omite la tarjeta. Se conserva el patrón de solicitudes de useCatalogHome.

Las tarjetas resuelven nombre o slug de Cajora tras normalizar acentos, mayúsculas, espacios y guiones. En Cajora local se observaron perfumeria y belleza-y-cuidado-personal. El catálogo local no devuelve una categoría general de Tecnología, así que se verificó el enlace tecnológico a accesorios-de-computacion con el nombre de esa categoría. Si tampoco existe esa alternativa, se omite esa tarjeta. Los demás slugs quedan accesibles mediante enlaces únicos.

## Validación ejecutada

- Desde client, node --test tests/*.test.cjs, 127 aprobadas. Se agregaron dos regresiones para resolución de categorías y producto destacado.
- Desde client, npm run lint y npm run build, ambos correctos.
- Edge headless con fixtures de API pública en 320, 375, 390, 768, 1024, 1280 y 1440 px. Se comprobó carga y decodificación de los cinco WebP, navegación de las tarjetas, categoría faltante, ausencia de desborde, zoom CSS al 200%, foco y navegación por teclado a Cómo comprar, canonical, carrito lateral y superposición con WhatsApp.
- Se verificaron catálogo vacío, carga, error y reintento. El producto destacado se probó con disponible, agotado, por encargo y sin imagen. Cuando aparece en el listado se observaron cero peticiones de ficha para elegirlo. Cuando falta, se verificó la petición existente y el fallback ante 404.
- Se revisaron visualmente capturas a 375, 768 y 1440 px. Los pares sólidos de texto y fondo medidos dieron 6,57:1 para blanco sobre violeta, 5,37:1 para violeta sobre lavanda, 12,82:1 para oscuro sobre lavanda y 5,10:1 para texto secundario sobre lavanda. Las zonas fotográficas se inspeccionaron visualmente.
- Smoke adicional en Edge a 1440 px con GET reales a Cajora en localhost:3000 mediante un reenvío de prueba. Operaron las tres tarjetas, el producto destacado y la carga del listado al entrar en Accesorios de computación.

Evidencia local de la sesión en home-redesign-qa.cjs, home-redesign-results.json y las capturas home-redesign-375.png, home-redesign-768.png, home-redesign-1440.png y home-redesign-cajora-local.png. Queda pendiente el smoke desplegado en QA. La sesión no registró métricas LCP ni pruebas en dispositivos físicos.
