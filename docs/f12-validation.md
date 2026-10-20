# Validación F12 — VITRUNO Brand Integration

Fecha: 2026-10-20. Rama dev. Integración visual sobre F11; QA con fixtures HTTP locales y perfil de navegador aislado.

## Assets inspected

Los seis PNG aportados ya estaban en client/public/ sin seguimiento al comenzar. Se inspeccionaron formato real, dimensiones, peso, alpha y apariencia; SHA-256 comprobado antes/después: originales intactos.

| Archivo | Formato / dimensiones reales | Bytes | Alpha |
| --- | --- | ---: | --- |
| vitruno-logo-horizontal.png | PNG RGBA 1600×560 | 323909 | 255 |
| vitruno-isotipo-512.png | PNG RGBA 512×512 | 67286 | 255 |
| favicon-64x64.png | PNG RGBA 64×64 | 6012 | 255 |
| apple-touch-icon.png | PNG RGBA 180×180 | 16781 | 254–255 |
| icon-192.png | PNG RGBA **180×180** | 16781 | 254–255 |
| icon-512.png | PNG RGBA 512×512 | 67286 | 255 |

No hay transparencia útil: los originales incluyen fondo claro cálido, con textura/variaciones propias del raster. El horizontal tiene márgenes internos amplios alrededor del monograma y lettering. Se conserva completo, object-contain, ratio 1600/560 e intrínsecos; caja de 288 px mobile/320 px desktop, sin crop ni deformación. Footer usa 288 px. El isotipo se limita a Hero desktop, decorativo; no satura las demás superficies.

La calidad original es suficiente para esas cajas; no se crea otra variante optimizada ni se sobrescriben los PNG. No hay maestro vectorial/SVG disponible ni se simula vectorización.

Derivado generado con Pillow local a partir de favicon-64x64.png: favicon.ico, **9231 bytes**, imágenes internas 16×16, 32×32, 48×48 y 64×64 verificadas al reabrir el archivo. Sin dependencia npm.

## Implemented

- Identidad definitiva VITRUNO en Header/Footer mediante BrandLogo compartido mínimo y assets locales. Link de inicio con nombre accesible VITRUNO; sin texto duplicado junto al logo.
- Announcement con eslogan aprobado. Hero F11 conserva estructura y CTAs; nuevo copy multirrubro y isotipo decorativo. El eslogan no se repite en cada sección.
- Marca pública independiente de business.name/logoUrl. El hook y los tres requests de Home permanecen intactos; business sigue validado/obtenido, pero no reemplaza VITRUNO. Fixture con otro nombre/logo confirmó que no aparecen como marca ni se descarga su logo.
- Tokens semánticos existentes actualizados; cards blancas, base marfil y petróleo dominante. Teal en detalles de cards/categorías/badge disponible; dorado discreto en encargo y decoración del Hero. Los tres estados siguen teniendo texto.
- Headings, panel comercial, rich content, botones, búsqueda, carrito y foco reciben los tokens globales. Galería conserva lógica y disposición; selección usa petróleo.
- Footer permite wrapping incluso con zoom CSS 200%; conserva Inicio/Productos/Carrito, sin enlaces ficticios.
- Documentación vigente, README y DEC-010 actualizados. Validaciones históricas F9/F10A/F10B/F11 preservadas.

## Palette / typography

Paleta centralizada en index.css: petróleo #192C3D, marfil #F4F0E8, teal #2D9B90, dorado #E6B85C y blanco auxiliar. No HEX de marca en JSX. Se mantienen los tokens shadcn/Tailwind; no segundo theme/provider ni dark mode nuevo. Las variables dark previas permanecen inactivas, fuera del alcance.

Inter 400/500/600 para body/UI; Manrope 600/700 para headings h1–h6. Links Google Fonts con preconnect a googleapis/gstatic, crossorigin para gstatic, display=swap y fallback ui-sans-serif/system-ui/sans-serif. No archivos de fuentes descargados ni paquete npm.

En Edge se comprobó carga real de Inter 400/500/600 y Manrope 600 para el contenido utilizado. Los subsets no utilizados permanecen unloaded, como corresponde. También se probó un contexto bloqueando ambos hosts de fuentes: fallback legible y sin overflow, incluso con zoom CSS 200% a 320 px. No equivale a zoom nativo de la interfaz del navegador.

## Browser metadata / favicon / manifest

- Title: VITRUNO | Buenas elecciones, todos los días.
- Description aprobada, theme-color #192C3D y OG title/description/type básicos.
- Favicon ICO multiresolución y PNG 64, apple-touch-icon 180, manifest.
- Manifest JSON válido, name/short_name VITRUNO, start_url /, display browser y colores de marca. Iconos con purpose any; sin maskable no comprobado.
- **Desviación respecto del ejemplo nominal:** icon-192.png mide 180×180. Se usa el asset original y se declara sizes 180x180 en vez de publicar una medida falsa o modificarlo. icon-512.png sí mide 512×512.
- Sin canonical, og:url o imagen social con dominio inventado. Sin service worker ni declaración PWA/offline.
- ICO revisado visualmente a 16/32/64 px: monograma reconocible con pérdida esperable de detalle raster a 16. Se revisó sobre fondos claro y oscuro en una lámina; el fondo opaco forma parte del asset. No se verificó el chrome real de pestañas claro/oscuro.
- Los ocho archivos de public se copiaron a dist; PNG de dist idénticos a originales. Referencias del HTML generado verificadas. Favicon/PNG/apple/icons/manifest responden 200 en servidor local. No se editaron archivos generados ni se versiona dist.

## Automated validation

Desde client:

```text
node --test tests/catalog.test.cjs tests/cart.test.cjs tests/whatsapp.test.cjs
39 passed / 0 failed: catálogo 17, carrito 16, WhatsApp 6
npm run lint: OK
npm run build: OK, sin warnings
git diff --check: OK
```

Sin framework DOM, dependencias nuevas ni tests que comprueben clases visuales. Se usaron Pillow y Playwright del runtime local disponible para inspección/QA, fuera de las dependencias del proyecto.

## Visual / responsive

Edge headless, perfil aislado, Vite 127.0.0.1:5175 y fixture HTTP 127.0.0.1:5176. No se modificó .env, el backend Cajora ni los procesos del usuario. Console Ninja necesitó acceso local fuera del entorno restringido para iniciar Vite; se completó QA sin alterar su configuración.

| Ruta | 320 | 375 | 768 | 1024 | 1440 |
| --- | --- | --- | --- | --- | --- |
| / | OK | OK | OK | OK | OK |
| /productos | OK | OK | OK | OK | OK |
| /productos?categoria=objetos-diarios | OK | OK | OK | OK | OK |
| /productos/producto-disponible | OK | OK | OK | OK | OK |
| /carrito vacío | OK | OK | OK | OK | OK |
| /404 | OK | OK | OK | OK | OK |
| /carrito con 10 unidades | OK | OK | OK | OK | OK |

OK: sin overflow horizontal de página; las 30 combinaciones de las primeras seis rutas tienen un h1, cero controles anidados y ambos logos cargados, visibles y con ratio preservado. Se capturaron Home/detalle/carrito en 375/1440, carrito con items, error de verificación y fallback con zoom. Home desktop/mobile revisadas visualmente; favicon revisado mediante lámina de tamaños.

Interacciones comprobadas: búsqueda, categoría activa por slug, página 2 conservando categoría, galería con Enter/aria-pressed, agregar, contador 10, FAQ con Enter y ancla Cómo comprar. Secundaria inicialmente ausente y montada después del hover. Portada/galería/selected no cambian de semántica.

Carrito: gate bloqueado durante loading, error, cantidad stale, agotado y encargo; retry habilita enlace tras éxito. No se abrió WhatsApp ni se enviaron mensajes. El primer recorrido detectó overflow del Footer con zoom extremo; se corrigió wrapping y el recorrido final pasó completo, sin pageerrors.

## Accessibility

Logo con alt VITRUNO; isotipo decorativo con alt vacío/aria-hidden. Estados con texto además de color. Un enlace informativo por card y acciones separadas. Se conservan labels, breadcrumbs, detalles nativos, min targets existentes y semántica del rich content.

Skip link alcanza main-content; navegación por pathname enfoca main. FAQ/galería funcionan por teclado. Foco de input medido: outline solid 2 px petróleo. Los estilos de reduced-motion existentes no se alteran.

Contraste calculado con luminancia relativa sRGB (pares opacos y mezclas definidas en tokens):

| Par | Ratio |
| --- | ---: |
| Marfil / petróleo (CTA y announcement) | 12.58:1 |
| Petróleo / blanco | 14.30:1 |
| Muted foreground / marfil | 5.71:1 |
| Muted foreground / superficie muted | 5.30:1 |
| Petróleo / accent claro | 10.80:1 |
| Input border / marfil | 3.34:1 |

Teal puro/blanco da 3.39:1 y petróleo/teal puro 4.22:1: **no se usan para texto normal**. accent utiliza teal 15% sobre marfil; teal puro solo detalles decorativos y bordes/indicadores adicionales. El foco usa petróleo, con 12.58:1 sobre marfil y 14.30:1 sobre blanco. No es una auditoría WCAG completa ni prueba con lector de pantalla real.

## Performance

| Asset | F11 min/gzip | F12 min/gzip |
| --- | --- | --- |
| JS principal | 498.90 / 155.36 kB | 498.78 / 155.40 kB |
| ProductDetailPage | 0.70 / 0.39 kB | 0.70 / 0.39 kB |
| CatalogPage | 1.47 / 0.72 kB | 1.47 / 0.72 kB |
| CSS | 35.52 / 6.79 kB | 36.09 / 6.96 kB |

JS principal -0.12 kB; CSS +0.57 kB. Sin aumento importante de JS ni nuevos paquetes. El principal sigue cerca de 500 kB. Logo horizontal 323909 bytes se reutiliza con la misma URL en shell; isotipo 67286 bytes solo Hero. Se conservan PNG originales, sin variantes innecesarias. Fuentes externas implican requests propios; se comprobó fallback. Sin Lighthouse ni Core Web Vitals de producción.

## Known limitations

- Assets raster con fondo opaco y márgenes internos: no son SVG editables.
- icon-192.png es 180×180; manifest declara esa medida real.
- Touch físico, lector de pantalla real, browser chrome/favicons reales y zoom nativo no verificados.
- Siguen pendientes smoke Cajora/hosting real, CORS/fallback SPA del hosting y auditoría de vulnerabilidades F8. Branding no resuelve esos pendientes ni declara producción lista.

## Next

Validar la identidad en dispositivos y navegadores reales; completar los pendientes operativos al desplegar. Si se suministra un maestro transparente/vectorial o un icono nativo 192×192, sustituir assets de forma explícita y volver a validar dimensiones/calidad.
