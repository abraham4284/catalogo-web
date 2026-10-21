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
PNG originales locales de propuesta 3, con fondo opaco #242038; no SVG ni variante simulada con filtros CSS. Horizontal 1600×560 completo en desktop/Footer; Header mobile usa isotipo 512×512 en caja 64 px por mejor legibilidad que el wordmark pequeño. Ambos conservan aspect ratio, sin crop. Header/Footer oscuros con navegación clara, active state y foco claro. Link de marca accesible VITRUNO; isotipo decorativo del Hero fallback con alt vacío.

Iconos 64/180/192/512 reales; manifest browser con colores vigentes y sizes correctos. Se retiró la referencia al ICO previo ya eliminado por el usuario. OG local 1200×630 con URL https://vitruno.onrender.com/og-image.png. Sin service worker ni declaración PWA.

## Dirección editorial
Referencia principal: [Bellroy](https://bellroy.com/), consultada en F13 para jerarquía, alternancia de grandes visuales y productos, espacio y ritmo de secciones. Se adopta el principio de composición, sin copiar fotografías, branding, textos, componentes, promociones o navegación compleja.

Home: hero sin caja envolvente → categorías backend por slug → productos existentes → un bloque editorial lavanda → Cómo comprar → FAQ → Footer. El Hero desktop usa la portada del primer producto del listado ya obtenido; no se lo presenta como destacado, nuevo ni más vendido. No se hace fetching adicional. Sin imagen, loading/error o lista vacía, usa isotipo decorativo en superficie compatible. En mobile el hero visual se oculta para priorizar copy/categorías/productos.

No se mantienen los dos banners repetitivos previos: un único bloque editorial después del producto expresa selección con criterio/stock y encargo. Copy estático en storefront-content.ts; sin fotos externas ni claims de curaduría experta o productos testeados.

## Superficies comerciales
Cards sin borde exterior de panel ni sombra: imagen protagonista, jerarquía textual y acciones hermanas del enlace informativo único. Disponibilidad textual en violeta/lavanda/neutral; sin verde/amarillo/rojo nuevos. Secundaria on-demand mouse/pen, touch independiente y reduced-motion conservados. Grid: una columna estrecha, dos desde 540, tres md y cuatro xl.

Catálogo conserva search, categoría activa, count y paginación URL. Detalle elimina caja envolvente del panel comercial para dar aire a imagen/precio; conserva breadcrumbs, nota, acciones y rich content h2/h3/p/list/dl. Galería vertical desktop y horizontal mobile, sin cambios de selección/orden/dedupe. Carrito usa filas abiertas/divisores y resumen lavanda discreto, con errores/loading/stale/retry siempre visibles.

## Accesibilidad y referencias históricas
HTML semántico, teclado, foco visible, labels, alt útil y estados con texto. Contrastes, responsive y limitaciones documentados en docs/f13-validation.md. Se preservan referencias conceptuales previas Bellroy/Tiendanube Idea/Apple/Samsung, Frávega/Mercado Libre, Benito Boutique y USA Import; no se copian sus identidades. F11/F12 permanecen como evidencia histórica; presets/primitives shadcn conservados, sin dependencias nuevas.
