# F21 — Final Storefront Polish

Fecha: 2026-11-02. Implementado sobre `dev`, sin operaciones de escritura Git ni dependencias nuevas.

## Implemented

Skeleton compartido con variantes de card, grid y ficha. Home y catálogo presentan la geometría del contenido durante la carga; las queries actualizan resultados sin remontar la transición de ruta. Errores ofrecen retry local; vacío y 404 siguen siendo estados distintos. La ficha integra relacionados y tres FAQ contextuales después del contenido del producto. Copy de encargos centralizado, FAQ global ampliada y Cómo comprar con un flujo específico de cinco pasos, además del flujo habitual de tres.

## Skeleton system

Cards con imagen cuadrada, categoría, título, descripción, precio, disponibilidad y acciones aproximadas. Ficha con breadcrumbs, galería, miniaturas, información comercial y bloques inferiores. Un primitive decorativo `aria-hidden` evita anunciar cada placeholder; los contenedores comunican carga con status y texto para lector de pantalla. La animación se limita a `motion-safe`. El fallback inicial del router elige grid/ficha según pathname, con el ancho y padding del contenido; páginas de ayuda no reciben un grid ficticio.

## Hero strategy

Producto: Lattafa Oud For Glory. Slug real: `lattafa-oud-for-glory`, confirmado leyendo Cajora Public API local (`localhost:3000/api/public/catalog/products?search=Oud&limit=60`). La respuesta contenía ese nombre, slug e imagen; no se dedujo el slug ni se hardcodeó una imagen remota. No se afirma comprobación del contrato en producción.

Home mantiene negocio, categorías y listado de ocho productos. Si el objetivo ya está en el listado se reutiliza; si falta y hay productos, se consulta su ficha una vez, con caché en memoria de cinco minutos. No hay polling ni request por render/card. La carga de esa imagen no bloquea el grid. Fallo o falta de imagen: primer producto disponible con imagen; lista vacía o sin candidato: Hero editorial. Requests abortables y protección frente a respuestas obsoletas.

## Related products

Misma categoría pública por slug, excluyendo ID y slug actuales y deduplicando ambos. Máximo ocho resultados, sin ranking nuevo. Se reutilizan listados recordados; si hay menos de cuatro candidatos y no hay caché de categoría, se consulta una página de nueve productos de esa categoría. Caché efímera de 60 segundos, limitada a 200 productos y 20 categorías; sin almacenamiento persistente ni requests de detalle por card. No se garantiza recuperar todos los productos de categorías paginadas.

ProductCard y acciones comerciales existentes, imágenes secundarias bajo demanda y lazy loading conservados. Carrusel nativo horizontal con scroll snap, foco y desplazamiento por teclado; sin autoplay, librería ni animación obligatoria. Se muestra parte de la siguiente card en mobile. Una respuesta fallida usa candidatos conocidos o esconde el bloque; no bloquea la ficha ni su FAQ.

## FAQ contextual

Tres preguntas nativas expandibles por ficha y enlace a FAQ global con prefetch por intención. Disponible/agotado: envío, pago y ausencia de reserva automática. Por encargo: funcionamiento, anticipo y alternativas si no se consigue. FAQ global: 15 preguntas, reutilizando las respuestas centralizadas.

## On-order commercial UX

Solo `on_order` muestra precio publicado, anticipo del 30% y saldo restante del 70%. Cálculo numérico en centavos ARS: redondear total, redondear anticipo, obtener saldo por diferencia; la suma coincide con el total redondeado. Valores inválidos/no positivos no producen importes ficticios. Consulta no confirma compra: acuerdo expreso y anticipo acreditado después de confirmar disponibilidad, precio y plazo. Sin agregar encargos al carrito ni mostrar stock exacto.

Cómo comprar distingue consulta, confirmación comercial, anticipo, gestión y recepción. Ante imposibilidad de conseguir el producto, copy de devolución completa o alternativa libremente aceptada; cancelaciones y garantías requieren revisión comercial/jurídica, sin prometer excepciones universales.

## WhatsApp

CTA `Consultar y encargar`. Mensaje solicita modelo/variante, disponibilidad, precio final, plazo y condiciones del anticipo del 30%; aclara que consultar no confirma una compra. Incluye URL canónica cuando recibe un slug público válido. No expone IDs ni stock interno y no abre/envía mensajes automáticamente. Backend, pagos, registro de pedidos y carrito v3 conservan su alcance previo.

## Automated tests

64 pruebas pasan: 59 existentes y cinco nuevas de redondeo/valores inválidos, FAQ contextual, selección/fallback del Hero, exclusión/deduplicación de relacionados y consulta por encargo. Se actualizaron únicamente las expectativas de copy por encargo de la suite WhatsApp. Comando desde client: `node --test tests/*.test.cjs`. `npm run lint` y `npm run build`: OK.

## Browser / responsive QA

Edge headless y fixtures HTTP locales con latencia simulada. Matriz principal: 30 casos en 320, 375, 768, 1024, 1440 y 1920 px: Home, catálogo/búsqueda y ficha en los tres estados comerciales. Sin overflow horizontal del documento. Skeletons visibles con API lenta, retry, vacío y 404 diferenciados; FAQ global y Cómo comprar comprobados. Search conserva el contenedor de transición. Capturas de ficha skeleton mobile y encargo mobile/desktop inspeccionadas.

Recorrido adicional ejecutado en desarrollo y preview de build local: Hero fuera del listado inicial, caché entre navegaciones SPA, fallback por 404/sin imagen, Home vacía/error, caché de relacionados entre fichas, scroll horizontal/ArrowLeft, fallo aislado de relacionados y carga de categoría/paginación. No se abrió WhatsApp real. Son fixtures y verificaciones focalizadas; no equivalen a repetir toda la matriz histórica del carrito.

## Accessibility

FAQ por teclado, carrusel enfocable/desplazable y reduced motion comprobados. Skeletons decorativos con anuncio de carga agregado. Se conservan componentes accesibles de galería, acciones y shell. Sin pruebas con lector de pantalla o dispositivos físicos; touch se apoya en scroll nativo, sin afirmar prueba física.

## SEO regression

Metadata de ficha, canonical y Product JSON-LD presentes en QA; 404 sin skeleton indefinido. `on_order` mantiene la omisión de availability definida en F19. No se añadieron FAQPage, BackOrder, rutas, sitemap ni requests para SEO. CSR y verificaciones externas de Search Console/Rich Results siguen pendientes.

## Analytics regression

SDK Meta interceptado con ID de prueba: ViewContent de ficha, Contact por consulta y AddToCart desde relacionados comprobados sin duplicados en el recorrido. Agregar no abre Side Cart. No se añadió Purchase, depósito ni evento de compra confirmada. Consentimiento/eventos existentes y checkout conservados; recepción real y ajustes remotos en Events Manager pendientes.

## Performance

Referencia histórica documentada F20: JS inicial 588.61 kB / gzip 186.85; CSS 42.81 / 8.20. No se realizó un nuevo build del checkout anterior para esta comparación.

Build F21: principal 490.29 / gzip 154.17, runtime 102.27 / 34.06 y contenido compartido inicial 6.23 / 2.20. Total JS inicial: 598.79 / 190.43, diferencia orientativa +10.18 / +3.58 kB. CSS: 43.76 / 8.45 (+0.95 / +0.25). Chunk de ficha: 4.13 / 1.68 frente a 2.33 / 1.09 documentados en F20.

El principal menor a 500 kB se debe a la agrupación automática de Vite: no es una reducción del JS inicial agregado. Build final sin aviso de chunk >500 kB; sin cambiar configuración, umbral ni manualChunks. Sin nuevas dependencias ni cambios de lockfile. No se midieron Core Web Vitals/CLS; geometrías aproximadas reducen el salto visual, sin garantizar CLS cero.

## Legal/commercial pending

- Revisión del responsable comercial/jurídico de términos de encargo, cancelación, devolución y garantías antes de tomarlos como política definitiva.
- Confirmar operación real de anticipo, acreditación, saldo, plazos y alternativas por WhatsApp.
- Publicar e instrumentar los mecanismos legales que correspondan; no se agregó un botón/formulario ficticio de arrepentimiento ni se afirma cumplimiento jurídico.
- Políticas públicas de privacidad/cookies y verificaciones externas pendientes de F19/F20.

## Known limitations

Sin checkout web, pagos, reservas, nuevos endpoints, órdenes, automatización de saldo ni señal de venta confirmada. La caché es por pestaña y puede conservar información comercial durante su TTL; la confirmación final sigue siendo manual. No se validó despliegue productivo, Lighthouse/CWV ni dispositivos físicos. La ficha por encargo puede ser más alta que el skeleton genérico por su información adicional. Sin bloqueos de implementación conocidos.

## Evidence

Artefactos locales bajo `C:/Users/Abrah/.codex/visualizations/2026/10/01/01a0f4d0-0ee0-7c52-8453-0a514659d862/`: `f21-qa.cjs`, `f21-results.json`, `f21-extra.cjs`, `f21-detail-skeleton-375.png`, `f21-order-375.png` y `f21-order-1440.png`. Scripts y capturas de QA fuera del repositorio.
