# Diseño

## Marca
Sin nombre, logo, paleta ni tipografía definitivos. Los nombres temporales no son marca final.

## Dirección
Base blanca, negra y grises neutros; espacio generoso y fotografía de producto protagonista. UI profesional y mobile-first, incluso antes del branding.

Inspiración conceptual decidida: Bellroy (limpieza/espacio/producto), Tiendanube Idea (estructura ecommerce simple), Apple (jerarquía del detalle/galería), Samsung (navegación/categorización). Frávega y Mercado Libre aportan patrones funcionales, no densidad visual. No copiar literalmente marcas.

F9 agrega [Benito Boutique](https://benitoboutique.com.ar/) como referencia conceptual: protagonismo visual, imagen al hover, acciones rápidas y producto reconocible en carrito. No copiar diseño, marca, tipografía, colores ni estructura literal; no orientar el Storefront a perfumería. Se mantiene agnóstico al rubro.

Cards: resumen con clamp CSS de tres líneas, acciones apiladas con targets de 44 px y slots independientes de los enlaces. Una columna en pantallas estrechas y dos desde 540 px para conservar espacio usable; tres en md y cuatro en xl. Secundaria es mejora progresiva solo para hover/puntero fino, con reduced-motion; portada y acciones siguen disponibles en touch. Detalle separa resumen de contenido detallado y mantiene medida de lectura; specs en dl flexible. Carrito usa imagen 1:1 de 80/96 px, controles claros y avisos textuales, sin exponer cantidades exactas de stock.

## Tokens
Usar tokens semánticos: `background`, `foreground`, `card`, `primary`, `primary-foreground`, `secondary`, `muted`, `accent`, `border`, `ring`. Evitar colores de marca hardcodeados. Branding futuro mediante logo, tipografía, tokens, imagery y ajustes de radios/estilos, sin reescribir componentes.

## F0
Sans-serif neutral del sistema, sin JetBrains Mono global ni nueva dependencia tipográfica. Tokens neutrales existentes y variables CSS de radios conservados. Mantener preset shadcn (incluido `rounded-none`); no rediseñar primitives. Las variables dark existentes pueden permanecer sin selector ni implementación de modo oscuro.

## Accesibilidad
HTML semántico, teclado, focus visible, labels, alt útil y contraste suficiente. F0 solo verifica rutas mínimas; las pantallas comerciales se desarrollan en fases posteriores.


## F11 — Merchandising neutral
Hero tipográfico con nombre/logo del negocio obtenido por el fetching existente, CTA al catálogo y ancla a Cómo comprar. La ilustración geométrica es CSS decorativo, sin assets externos, autoplay ni rubro implícito. Dos banners informativos, categorías de Cajora, tres pasos y FAQ con details/summary; el copy comercial se concentra en src/content/storefront-content.ts.

Header compacto con announcement bar estática y contador de unidades accesible recibido por props. Se mantiene sin sticky para evitar superponer contenido/foco en mobile. Footer con Inicio, Productos y Carrito, sin links legales ficticios. Se usan radios explícitos en superficies comerciales; las primitives y sus presets se conservan.

Cards con borde y radio, un solo enlace para imagen/información, precio destacado y badge triestado con texto. Las acciones son hermanas del enlace. La secundaria se monta al entrar mouse/pen, es decorativa y se retira si falla; touch usa portada/acciones sin depender de hover. Detalle con breadcrumbs, panel comercial neutral y nota de disponibilidad separada; miniaturas verticales desde lg y horizontales debajo en mobile, con scroll para múltiples imágenes. Rich content mantiene headings/listas/dl y medida de lectura. Carrito usa filas y resumen con superficies coherentes; ningún ajuste visual modifica sus reglas de stock.

Referencias conceptuales: las bases Bellroy/Tiendanube Idea/Apple/Samsung ya documentadas, [Benito Boutique](https://benitoboutique.com.ar/) para protagonismo de producto y [USA Import](https://www.usaimport.com.ar/) para estructura comercial y orientación de consulta. No se copian branding, promociones, condiciones ni textos de esas tiendas. Evidencia responsive y límites: docs/f11-validation.md.
