# Diseño — VITRUNO

## Identidad vigente
VITRUNO es multirrubro, moderna, práctica, cercana y profesional. Dirección visual Tech contemporánea aprobada en F13 (DEC-011), con logo propuesta 3: V con degradado propio y wordmark blanco. No implica una tienda solo tecnológica, gaming, luxury o discount.

La identidad petróleo/marfil/teal/dorado de DEC-010 quedó superada. Se conserva como historia en esa decisión y en docs/f12-validation.md; no debe reintroducirse en UI vigente.

## Paleta y tokens
- Fondo principal #FAFAFC: página y secciones amplias.
- Texto/superficie oscura #242038: titulares, navegación y shell oscuro puntual.
- Primary #6547BE: CTAs, links destacados y selección/foco en superficies claras.
- Accent/secondary #EAE6F7: lavanda suave para bloque editorial, chips y estados.
- Card #FFFFFF: producto, formularios y paneles.

Los colores viven en index.css mediante tokens semánticos existentes, sin HEX dispersos ni segundo sistema de theme. Border/input/muted son derivados; muted-foreground #625E72. Ring violeta en superficies claras; Header/Footer sobreescriben ring a claro para contraste. No se trasladan a UI los rosados/matices del degradado raster. No hay dark mode global; las variables dark previas quedan inactivas.

## Tipografía y tono
Manrope 600–700 en headings, Inter 400–600 en body/UI/nav/forms/buttons; links Google Fonts únicos con preconnect, display=swap y fallback sans-serif. La tipografía rasterizada del logo no se reconstruye.

Eslogan: “Buenas elecciones, todos los días.” en Hero y metadata. Announcement informa stock/encargo/WhatsApp sin repetirlo. Tono argentino, de vos, directo y profesional. Sin promesas de envío, cuotas, garantías o promociones no verificadas.

## Assets y shell
PNG originales locales de propuesta 3, con fondo opaco #242038; no SVG ni variante simulada con filtros CSS. Horizontal corregido 1200×630 completo en desktop/Footer; Header mobile usa isotipo 512×512 en caja 64 px por mejor legibilidad que el wordmark pequeño. Ambos conservan aspect ratio, sin crop. Header/Footer oscuros con navegación clara, active state y foco claro. Link de marca accesible VITRUNO; isotipo decorativo del Hero fallback con alt vacío.

Iconos 64/180/192/512 reales; manifest browser con colores vigentes y sizes correctos. Se retiró la referencia al ICO previo ya eliminado por el usuario. OG local 1200×630 con URL https://vitruno.com.ar/og-image.png. Sin service worker ni declaración PWA.

## Dirección editorial
Referencia principal: [Bellroy](https://bellroy.com/), consultada en F13 para jerarquía, alternancia de grandes visuales y productos, espacio y ritmo de secciones. Se adopta el principio de composición, sin copiar fotografías, branding, textos, componentes, promociones o navegación compleja.

Home: hero sin caja envolvente → categorías backend por slug → productos existentes → un bloque editorial lavanda → Cómo comprar → FAQ → Footer. El Hero desktop prioriza el primer producto con imagen del listado ya obtenido y, si ninguno tiene imagen, conserva el primer producto; no se lo presenta como destacado, nuevo ni más vendido. No se hace fetching adicional. Loading usa skeleton neutral; un producto sin imagen usa ProductImage/Sin imagen y conserva su enlace. Error o lista vacía usan isotipo editorial decorativo. En mobile el hero visual se oculta para priorizar copy/categorías/productos.

No se mantienen los dos banners repetitivos previos: un único bloque editorial después del producto expresa selección con criterio/stock y encargo. Copy estático en storefront-content.ts; sin fotos externas ni claims de curaduría experta o productos testeados.

## Superficies comerciales
Cards sin borde exterior de panel ni sombra: imagen protagonista, jerarquía textual y acciones hermanas del enlace informativo único. Disponible/Por encargo permanecen bajo precios en violeta/lavanda; AGOTADO se muestra únicamente sobre imagen con fondo oscuro de marca. Sin verde/amarillo/rojo nuevos. Secundaria on-demand mouse/pen, touch independiente y reduced-motion conservados. Grid: una columna estrecha, dos desde 540, tres md y cuatro xl.

Catálogo conserva search, categoría activa, count y paginación URL. Detalle elimina caja envolvente del panel comercial para dar aire a imagen/precio; conserva breadcrumbs, nota, acciones y rich content h2/h3/p/list/dl. Galería vertical desktop y horizontal mobile, sin cambios de selección/orden/dedupe. Carrito usa filas abiertas/divisores y resumen lavanda discreto, con errores/loading/stale/retry siempre visibles.

## Accesibilidad y referencias históricas
HTML semántico, teclado, foco visible, labels, alt útil y estados con texto. Contrastes y dirección F13 en docs/f13-validation.md; polish y estabilidad F14 en docs/f14-validation.md. Se preservan referencias conceptuales previas Bellroy/Tiendanube Idea/Apple/Samsung, Frávega/Mercado Libre, Benito Boutique y USA Import; no se copian sus identidades. F11/F12 permanecen como evidencia histórica; presets/primitives shadcn conservados, sin dependencias nuevas.


## F14 — Polish de presentación
- Desktop: horizontal corregido a izquierda, navegación a derecha; caja 208 px y 224 px desde lg, con dimensiones intrínsecas reales. Sin crop ni edición del PNG.
- Mobile: isotipo 64 px centrado y navegación centrada debajo, con 8 px de separación.
- Footer mobile: identidad, copy y navegación centrados; desde sm se conserva identidad/copy izquierda y navegación derecha. Logo 208/224 px y padding vertical contenido.
- Hero loading: skeleton neutral, aria-hidden y motion-safe; nunca isotipo como indicador de carga. Visual lateral oculto bajo md en todos los estados. Frame compartido aspect 4/5 con max-height 448 px y leyenda de dos líneas reservada en 40 px para evitar saltos entre estados.


## F15 — Terminología comercial
El carrito usa “Finalizar compra por WhatsApp” en todos sus estados; los productos individuales mantienen su semántica de consulta. El paso final explica coordinación de pago, entrega y datos necesarios en WhatsApp. FAQ nativa ampliada con las condiciones comerciales aprobadas en F15 (envíos nacionales, plazos coordinados y transferencia bancaria/billeteras virtuales/efectivo). Sin formulario personal previo, checkout web ni nuevas promesas de plazo/costo.

## F16 — Navegación, carrito rápido y ayuda
Header muestra cinco rutas desde xl; debajo ofrece Menú modal, manteniendo el carrito con cantidad en pantallas pequeñas y cantidad/total desde lg. Footer incluye las cinco rutas y /carrito. El isotipo compacto se conserva hasta xl para evitar comprimir enlaces en tablet. Unidades representan cantidad total, no cantidad de filas.

Side Cart derecho de 92vw y máximo 420 px, encabezado fijo y contenido con scroll propio, overlay y cierre accesible. Reutiliza imágenes/fallback, nombres, subtotales, cantidades y avisos existentes. El CTA “Ver carrito completo” lleva a /carrito: allí se verifican precio/disponibilidad y se finaliza por WhatsApp. Apertura exclusivamente por clic en Carrito del Header. Agregar productos, recuperar datos o navegar mantiene el panel cerrado.

El shell ocupa todo el ancho con scroll natural del documento. Se retiran la pill flotante, el carril lateral reservado y la banda inferior: el panel cerrado no ocupa espacio. El Header ofrece el único acceso al preview. Totales/subtotales se mantienen dentro del panel y del carrito completo.

Contacto usa labels visibles, nombre/mensaje requeridos, email opcional, errores vinculados y foco en el primer campo inválido. Explica que abre WhatsApp y no guarda el formulario en el sitio. Cómo comprar y FAQ muestran el contenido centralizado ya aprobado; preguntas nativas details/summary y pasos semánticos. La Home conserva ambas secciones.

### Acceso del Header y movimiento
Carrito adopta una cápsula con borde claro, bolsa de Phosphor (dependencia existente) y contador violeta superpuesto. Desde lg muestra “Mi pedido” y el importe; debajo conserva “Carrito” y la cantidad, sin total. Mantiene nombre accesible con unidades, aria-expanded/controls y foco visible. Es un botón que abre un diálogo, no un enlace de navegación directa.

El SidePanel compartido desliza desde la derecha en 250 ms ease-out, con fade del backdrop de 200 ms. Base UI controla montaje/desmontaje mediante data-starting-style/data-ending-style; no se agregan timers ni focus traps propios. prefers-reduced-motion desactiva las transiciones. El estado UI conserva el último contenido para que el menú no cambie a carrito durante la salida.

## F17 — Feedback de agregado
Las superficies de producto ya no muestran cantidad acumulada “En carrito: N”. El agregado local exitoso confirma “✓ Agregado” durante 1200 ms y deshabilita temporalmente ese botón; luego vuelve a su etiqueta habitual respetando disponibilidad/stock. No hay estado de red “Agregando”. Header, Side Cart y CartPage comunican/administan cantidades.

Toast inferior centrado con react-hot-toast: tarjeta clara con borde y sombra suaves, check oscuro, título “Agregado al carrito” y nombre completo del producto debajo, siguiendo la referencia aprobada. Duración 3000 ms para leer el nombre; fade de entrada/salida 160/120 ms. Sin foco ni captura de puntero, role=status y aria-live=polite. Safe area inferior y ancho máximo 384 px con margen móvil de 16 px. Reduced motion desactiva animación. Agregar mantiene Side Cart cerrado. El diálogo está inicializado cerrado desde el primer render y abre sin lazy/Suspense.

## F18 — Entrada del contenido de ruta
Solo el contenido del Outlet entra con opacity 0→1 y translateY 5→0 en 180 ms ease-out. El wrapper usa pathname como key: cambios de search/categoria/page en /productos conservan la instancia y no reinician la transición global. No hay salida animada ni espera artificial. Header/AnnouncementBar/Footer permanecen fuera del wrapper; tampoco se animan Side Cart, menú o toast como parte del cambio de ruta. El foco se conserva en main al cambiar pathname y reduced motion elimina la animación. Sin smooth scroll global ni loaders de navegación nuevos.

## F19 — Identidad en buscadores y enlaces compartidos
Título, descripción y Open Graph/Twitter por ruta conservan tono VITRUNO. Home usa copy vigente, sin categorías o promesas nuevas. La ficha usa nombre/descripción e imagen reales, con fallback OG de marca 1200×630. No cambia layout, animaciones ni estados visuales de carga/error; SEO no agrega skeletons ni loaders.

## F20 — Consentimiento de medición
Banner inferior no modal, con título, explicación y botones Aceptar medición/Rechazar medición de igual jerarquía. Safe area y wrapping; sin animación, foco automático ni focus trap. Preferencias de cookies en Footer reabre esa elección. No se inventa enlace legal. El banner está por debajo de panel/toast en z-index; no condiciona contenido SEO ni navegación. La revocación de SDK ya inicializado recarga una vez por seguridad.

## F21 — Carga, relacionados y encargos
Skeletons neutros bg-muted con pulse solo motion-safe, esquinas y geometría de imágenes/cards vigentes. Detalle aproxima breadcrumbs, imagen cuadrada, thumbnails, panel de texto/precio/acciones y contenido inferior; móvil apila, desktop conserva dos columnas. Status ocultos, sin texto de carga como UI principal. No se promete CLS cero con nombres/descripciones variables.

Relacionados después de rich content y antes de FAQ: lista horizontal scroll-snap, sin autoplay ni librería, cuatro visibles en xl, tres desde md y ancho de 75% por card en móvil para mostrar continuidad. Scroll nativo, foco y orden DOM naturales; sin smooth-scroll. FAQ con details/summary: tres preguntas generales para stock/agotado y, desde F21B, una resumida para on_order, más link a todas las preguntas.

Hero editorial intencional Lattafa Oud For Glory por slug publicado, sin claims de destacado/más vendido. Fallback disponible con imagen y luego isotipo; marco F14 conservado. Desde F21B, la ficha conserva el precio principal y un aviso discreto sobre el anticipo del 30%, sin desglose de importes. La cotización y el importe exacto se acuerdan por WhatsApp antes de pagar. Botón Consultar y encargar abre consulta, sin pago ni reserva web. FAQ global y cinco pasos del flujo de encargos centralizados; revisión jurídica pendiente.


## F21B — Encargos y contacto global
FAQ global: seis preguntas generales más una entrada «Compras por encargo», con resumen y cuatro subacordeones nativos cerrados inicialmente. La ficha por encargo muestra una sola pregunta resumida y el enlace a condiciones completas; los otros estados conservan sus tres preguntas. Sin controles dentro de summary ni animación nueva.

WhatsApp global: círculo de 56 px, verde #128C4E con icono blanco Phosphor, sombra discreta y foco visible. Verde limitado a esta identificación de canal; disponibilidad y marca conservan sus tokens. Ubicación inferior derecha, margen de 16 px móvil/24 px escritorio y safe areas. Sin pulso ni texto permanente. Se oculta con paneles, banner/preferencias de cookies, toast (incluida su salida) y cuando coincide con controles de página al desplazarse. Sin contacto automático ni cambio de mensajes comerciales.

## F10.3 — Jerarquía comercial de precios
ProductPrices reutilizable: mayorista válido dominante, con label cercano al importe, y minorista secundario en línea, visible y sin tachado. Cards usan label «Mayorista» y ficha «Precio mayorista»; ficha aumenta la escala principal. Si no hay mayorista, el minorista ocupa la posición principal. Null/inválido comunica «Solo minorista» de forma neutral, sin cero inventado. Política loading/error/disabled conserva presentación minorista. El aviso global se limita al catálogo, con mínimo recibido de Cajora y enlace discreto a FAQ; Home y ficha no repiten la mecánica mayorista.

Carrito y preview muestran precio unitario mayorista cuando corresponde y total efectivo. Resumen/preview anuncian cambios con aria-live polite: faltante calculado a mayorista, o confirmación de acceso y ahorro. Si falta mayorista en cualquier línea, se explica el motivo y no se sugiere que sumar dinero lo resolverá. Visual Polish agrega barra de progreso accesible desde el candidato mayorista: explicación completa en resumen y compacta en Side Cart. Cliente mayorista existente se remite a WhatsApp para reconocimiento del operador. Encargo, Hero, galería, FAQ y marca conservan su diseño vigente.

Ajuste previo F10.3: la descripción se limitó a dos líneas. Visual Polish la retira de las cards y la conserva íntegra en la ficha. Bloque de precios con altura mínima compartida de 96 px al mostrar ambos niveles, también para mayorista ausente, para mantener alineación. El mínimo continúa en el aviso global dinámico, nunca «Desde» en el importe de producto.

## F10.3 Visual Polish — Mayorista y progreso
Cards: sin descripción, categoría en una línea y nombre en dos con altura mínima compartida; el enlace conserva su nombre accesible completo. Flex y altura mínima del bloque de acciones alinean precios/disponibilidad y el final de los CTAs por fila, incluso cuando encargo tiene una sola acción. Sin reglas por SKU. Precios mantienen mayorista protagonista o minorista protagonista con «Solo minorista».

Ficha: conserva precios y Solo minorista donde corresponde, sin párrafo adicional que repita esa modalidad ni el mínimo global. Aviso global del catálogo permanece dinámico.

CartPricingStatus centraliza la barra (track bg-muted/fill bg-primary), estado y faltante/ahorro. Resumen completo muestra candidato frente al mínimo; Side Cart usa variante compacta. role progressbar y valores 0–100; transición de ancho 200 ms solo motion-safe. Sin barra con disabled, vacío, alguna línea solo minorista o importes/mínimo inválidos. Se mantienen aria-live de los contenedores y todos los gates del checkout.

## F10.3 Cart UX Clarity — Total actual y acceso mayorista
Resumen y Side Cart presentan unidades, estado de compra y total efectivo antes del incentivo. RETAIL usa «Total actual». Luego se separa el bloque mayorista con borde superior/espacio: en vista completa «Acceso mayorista», label «Progreso mayorista», candidato/mínimo, barra y faltante. Copy secundario completo: «El progreso se calcula usando los precios mayoristas de los productos de tu carrito.» Side Cart usa «Calculado con precios mayoristas.»

WHOLESALE prioriza «✓ Precio mayorista desbloqueado», total mayorista y ahorro, seguidos de barra completa; omite el cociente y la explicación de cálculo. Missing wholesale mantiene total actual y aviso solo minorista sin progreso/faltante. Disabled muestra experiencia retail sin incentivo. Un solo contenedor aria-live polite por resumen/preview; barra conserva valores y describe el importe como valor mayorista. El total pertenece a CartSummary/CartPreview; CartPricingStatus presenta el beneficio y comparte únicamente el label visual mediante CartPricingLabel.

## Wholesale information architecture / FAQ — Ajuste F10.3
Home prioriza descubrimiento y elimina WholesaleNotice del listado. ProductDetail conserva precios, disponibilidad, descripción y acciones; no incluye el aviso global ni un segundo párrafo de Solo minorista. Catálogo concentra un único aviso: «Mayorista desde {minimum} en valor mayorista · Podés combinar categorías.» con link accesible «¿Cómo funciona?» al grupo mayorista mediante /preguntas-frecuentes#compras-minoristas-y-mayoristas. Sin modal ni monto fijo.

FAQ centralizada agrega «Compras minoristas y mayoristas», grupo hermano de «Compras por encargo», con seis subpreguntas nativas cerradas inicialmente. Explica precios, acceso, base del mínimo, compra debajo del mínimo, Solo minorista y reconocimiento posterior del cliente mayorista. Sin jerga interna ni importes hardcodeados. La FAQ de ficha sigue compacta; no incorpora las seis preguntas. HomeBuyingGuide conserva su reutilización del listado de FAQ colapsado, sin agregar otro banner o duplicar el origen del copy.

## Availability copy / FAQ wholesale deep link auto-open
Disponibilidad comercial visible: Disponible / Agotado / Por encargo. Agotado representa únicamente out_of_stock; estilos y CTA Consultar disponibilidad conservados. No se infiere desde stock físico ni se prometen reposiciones.

Grupo mayorista con ID explícito estable compras-minoristas-y-mayoristas. El enlace del catálogo lleva al hash, abre solo el padre y lo muestra con scroll auto/start y scroll-margin-top CSS de 24 px. Subpreguntas permanecen cerradas inicialmente. FAQ normal/desconocida no autoabre nada; detalles nativos siguen permitiendo cierre manual. Sin foco añadido, smooth scroll, modal o librería. La apertura se coordina localmente con el siguiente frame, después del foco/restauración de ruta existentes.

## Visual polish — out_of_stock image badge
ProductCardImage recibe availabilityStatus tipado y muestra AGOTADO solo para out_of_stock: cápsula compacta arriba a la derecha, margen 12 px, bg-foreground (#242038), texto blanco text-primary-foreground, text-xs/font-semibold. z-10 lo mantiene sobre la secundaria; pointer-events-none conserva el enlace. Texto visible sin aria-hidden, sin nuevo control interactivo ni filtros/oscurecimiento de la foto; también visible sin imagen.

ProductCard omite el badge inferior únicamente para agotados y reserva min-h-7 en ese espacio para mantener precios/acciones alineados, sin texto invisible. Disponible/Por encargo continúan debajo de precios. Ficha y carrito conservan Agotado textual, helpers y CTA intactos. El estado no se deduce del stock físico. Hover/touch/reduced-motion existentes no cambian.

## Buscador — Productos y categorías
CatalogSearch mantiene label visible Buscar productos o categorías, asociado a catalog-search, y placeholder Ej. auriculares, perfumes, cargadores... como orientación. Conserva submit explícito, Buscar/Limpiar búsqueda, trim y máximo 150 caracteres. No agrega debounce ni categorías/sinónimos locales. Cajora resuelve coincidencias por producto/categoría y orden de relevancia; la UI muestra los resultados en el orden recibido y combina search AND categorySlug. Empty state y heading de resultados actuales se conservan.
