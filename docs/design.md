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
