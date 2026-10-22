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

Iconos 64/180/192/512 reales; manifest browser con colores vigentes y sizes correctos. Se retiró la referencia al ICO previo ya eliminado por el usuario. OG local 1200×630 con URL https://vitruno.onrender.com/og-image.png. Sin service worker ni declaración PWA.

## Dirección editorial
Referencia principal: [Bellroy](https://bellroy.com/), consultada en F13 para jerarquía, alternancia de grandes visuales y productos, espacio y ritmo de secciones. Se adopta el principio de composición, sin copiar fotografías, branding, textos, componentes, promociones o navegación compleja.

Home: hero sin caja envolvente → categorías backend por slug → productos existentes → un bloque editorial lavanda → Cómo comprar → FAQ → Footer. El Hero desktop prioriza el primer producto con imagen del listado ya obtenido y, si ninguno tiene imagen, conserva el primer producto; no se lo presenta como destacado, nuevo ni más vendido. No se hace fetching adicional. Loading usa skeleton neutral; un producto sin imagen usa ProductImage/Sin imagen y conserva su enlace. Error o lista vacía usan isotipo editorial decorativo. En mobile el hero visual se oculta para priorizar copy/categorías/productos.

No se mantienen los dos banners repetitivos previos: un único bloque editorial después del producto expresa selección con criterio/stock y encargo. Copy estático en storefront-content.ts; sin fotos externas ni claims de curaduría experta o productos testeados.

## Superficies comerciales
Cards sin borde exterior de panel ni sombra: imagen protagonista, jerarquía textual y acciones hermanas del enlace informativo único. Disponibilidad textual en violeta/lavanda/neutral; sin verde/amarillo/rojo nuevos. Secundaria on-demand mouse/pen, touch independiente y reduced-motion conservados. Grid: una columna estrecha, dos desde 540, tres md y cuatro xl.

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
