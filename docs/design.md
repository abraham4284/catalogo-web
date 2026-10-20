# Diseño

## Marca
VITRUNO es la identidad definitiva (DEC-010). Tienda multirrubro moderna, confiable, profesional, cercana, práctica y accesible; productos útiles, atractivos y seleccionados con criterio. Posicionamiento de calidad accesible y buena selección, sin lujo ni descuentos como identidad.

Eslogan: “Buenas elecciones, todos los días.” Se usa en announcement y metadata; no se repite por toda la página. Tono argentino, de vos, directo y profesional. No se agregan promesas de envío, cuotas, garantías ni promociones no confirmadas.

Paleta aprobada: petróleo #192C3D para texto fuerte/CTA/nav; marfil #F4F0E8 para fondo; blanco #FFFFFF para cards. Teal #2D9B90 y dorado #E6B85C quedan como detalles. Headings Manrope 600–700 y body/nav/forms/buttons Inter 400–600, con fallback sans-serif y Google Fonts display=swap.

Logo horizontal local PNG 1600×560 en Header/Footer; isotipo PNG 512×512 decorativo solo en Hero desktop. Los originales son rasterizados, opacos y con fondo claro; no existe maestro SVG editable. Se mantienen íntegros, sin crop/deformación/vectorización. Sus márgenes internos amplios justifican cajas de 288 px (320 px desktop) con ratio original; el Header conserva dos filas mobile.

## Dirección
Petróleo y marfil dominan, cards blancas, acentos contenidos. Espacio generoso y fotografía de producto protagonista; UI profesional y mobile-first, sin orientar la marca a un rubro específico.

Inspiración conceptual decidida: Bellroy (limpieza/espacio/producto), Tiendanube Idea (estructura ecommerce simple), Apple (jerarquía del detalle/galería), Samsung (navegación/categorización). Frávega y Mercado Libre aportan patrones funcionales, no densidad visual. No copiar literalmente marcas.

F9 agrega [Benito Boutique](https://benitoboutique.com.ar/) como referencia conceptual: protagonismo visual, imagen al hover, acciones rápidas y producto reconocible en carrito. No copiar diseño, marca, tipografía, colores ni estructura literal; no orientar el Storefront a perfumería. Se mantiene agnóstico al rubro.

Cards: resumen con clamp CSS de tres líneas, acciones apiladas con targets de 44 px y slots independientes de los enlaces. Una columna en pantallas estrechas y dos desde 540 px para conservar espacio usable; tres en md y cuatro en xl. Secundaria es mejora progresiva solo para hover/puntero fino, con reduced-motion; portada y acciones siguen disponibles en touch. Detalle separa resumen de contenido detallado y mantiene medida de lectura; specs en dl flexible. Carrito usa imagen 1:1 de 80/96 px, controles claros y avisos textuales, sin exponer cantidades exactas de stock.

## Tokens
Usar tokens semánticos: `background`, `foreground`, `card`, `primary`, `primary-foreground`, `secondary`, `muted`, `accent`, `border`, `ring`. La paleta vive en variables centralizadas de index.css, sin HEX en componentes. accent es una mezcla clara de teal/marfil con foreground petróleo; teal puro se reserva para decoraciones/bordes/indicadores. ring usa petróleo para contraste fuerte. muted-foreground e input son derivados accesibles; brand-gold y brand-teal solo cubren detalles de marca. No se introduce otro sistema de colores.

## Baseline histórico F0
Sans-serif neutral del sistema, sin JetBrains Mono global ni nueva dependencia tipográfica. Tokens neutrales existentes y variables CSS de radios conservados. Mantener preset shadcn (incluido `rounded-none`); no rediseñar primitives. Las variables dark existentes pueden permanecer sin selector ni implementación de modo oscuro.

## Accesibilidad
HTML semántico, teclado, focus visible, labels, alt útil y contraste suficiente. F0 solo verifica rutas mínimas; las pantallas comerciales se desarrollan en fases posteriores.


## Merchandising F11 con identidad F12
Hero tipográfico con identidad VITRUNO local, CTA al catálogo y ancla a Cómo comprar. El isotipo real sustituye la decoración geométrica anterior. El hook conserva business por contrato, pero no usa su nombre/logo como marca pública. Dos banners informativos, categorías de Cajora, tres pasos y FAQ con details/summary; el copy comercial se concentra en src/content/storefront-content.ts.

Header compacto con announcement bar estática y contador de unidades accesible recibido por props. Se mantiene sin sticky para evitar superponer contenido/foco en mobile. Footer con Inicio, Productos y Carrito, sin links legales ficticios. Se usan radios explícitos en superficies comerciales; las primitives y sus presets se conservan.

Cards con borde y radio, un solo enlace para imagen/información, precio destacado y badge triestado con texto. Las acciones son hermanas del enlace. La secundaria se monta al entrar mouse/pen, es decorativa y se retira si falla; touch usa portada/acciones sin depender de hover. Detalle con breadcrumbs, panel comercial con tokens VITRUNO y nota de disponibilidad separada; miniaturas verticales desde lg y horizontales debajo en mobile, con scroll para múltiples imágenes. Rich content mantiene headings/listas/dl y medida de lectura. Carrito usa filas y resumen con superficies coherentes; ningún ajuste visual modifica sus reglas de stock.

Referencias conceptuales: las bases Bellroy/Tiendanube Idea/Apple/Samsung ya documentadas, [Benito Boutique](https://benitoboutique.com.ar/) para protagonismo de producto y [USA Import](https://www.usaimport.com.ar/) para estructura comercial y orientación de consulta. No se copian branding, promociones, condiciones ni textos de esas tiendas. Evidencia histórica: docs/f11-validation.md. Integración vigente, assets, contraste y QA: docs/f12-validation.md.
