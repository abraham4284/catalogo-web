# Barra estable y buscador cápsula — 2026-11-18

Implementado en dev. Sin operaciones Git de escritura, dependencias nuevas ni cambios en API, precios, stock, carrito, SEO, analytics o useProductEntryScroll.

## Diagnóstico y solución

En preview local con Edge y fixtures de Cajora se tomaron 48 posiciones debajo de la primera fila, en Inicio y Catálogo, anchos 375/1440. Antes, 15 posiciones recibían data-obscured=true desde FloatingWhatsAppContact al coincidir con controles normales; solo 33 mostraban la barra. Después: 48 visibles y ninguna ocultación por colisión.

CatalogQuickActions observa el li del primer article, que ocupa la altura completa de su fila CSS Grid. Un IntersectionObserver con margen superior de 24 px determina la visibilidad, sin escuchar dirección ni medir todos los botones. No depende del fin de la grilla. Las páginas montan el componente solamente con productos reales; loading, error y vacío no crean un umbral ficticio. Home mantiene categorías intercaladas. StoreLayout reserva 5.5rem más safe area después del footer en las dos rutas. WhatsApp conserva su coordinador existente y cede ante barra o diálogo; paneles, cookies y toasts suspenden ambas acciones.

## Buscador y pruebas de navegador

Edge headless sobre build preview aislado en 5175, sin alterar servidores del usuario. Fixtures de 48 productos y cuatro categorías; no representa QA desplegado ni una prueba del matching del backend.

- Inicio y Catálogo en 320, 375, 390, 540, 768, 1024 y 1440 px: oculto al entrar y volver arriba; visible al bajar/subir entre productos y al llegar al footer. Sin overflow horizontal.
- Cápsula con foco inicial en input y retorno al botón Buscar en los 14 casos ruta/ancho. Sin consultas por abrir, escribir o cerrar.
- Categoría Perfumería: nombre real, texto conservado al quitar chip, ninguna consulta al quitarlo, cierre descarta borrador. Submit con chip conserva categoria; sin chip genera búsqueda global. page vuelve a 1, limpieza y Filtrar operativos. Categoría no resuelta usa etiqueta segura sin publicar slug como nombre.
- Entrada computada de 200 ms con opacidad/translate. Al cerrar con Escape, popup sigue montado con data-ending-style y duración de 150 ms antes de desmontarse. Reduced motion establece transition-property:none y elimina desplazamiento.
- Cookies, toast de producto agregado, side cart y menú suspenden la barra. Recupera visibilidad después. Viewport de 375×360 y zoom CSS 200% sin overflow. No se observan errores JavaScript.
- Ficha abierta desde listado: sin barra y scroll inicial cero. Las tres pruebas existentes del hook de entrada siguen pasando; no se modificó el hook ni galería.
- Capturas de 375 y 1440 inspeccionadas: cápsula inferior compacta, fondo oscuro semitransparente y foco visible.

## Validación automatizada

Desde client: node --test tests/*.test.cjs (136 pasan), npm run lint y npm run build correctos. Regresiones actualizadas para umbral estable y nuevas para semántica del formulario/categorías reales y no resueltas. git diff --check sin errores.

## Comparación local

Misma configuración de build para comparación: API de fixture en 5175, WhatsApp de prueba, Pixel desactivado. No se cambiaron archivos de entorno.

| Medición | Antes | Después |
| --- | --- | --- |
| JS principal | 323.05 kB / gzip 101.22 | 327.72 kB / gzip 102.22 |
| CSS | 52.80 kB / gzip 9.83 | 54.27 kB / gzip 10.02 |
| Solicitudes iniciales Inicio | 3 | 3 |
| Solicitudes iniciales Catálogo | 3 | 3 |
| CLS Inicio 375×667 | 0.003575 | 0.003575 |
| CLS Catálogo 375×667 | 0.024483 | variable, ver abajo |

Solicitudes: categorías, negocio y productos (limit=12 en Home, limit=24 en Catálogo). Sin solicitudes nuevas en reposo ni por pulsación. Se ejecutó además build final con la configuración normal del proyecto.

CLS es una medición local con fuentes/carga asíncrona, no p75 ni métrica de producción. Primera corrida posterior de Catálogo: 0.206915; repetición instrumentada: 0.024754; otra repetición: 0.002275. Cinco cargas instrumentadas adicionales dieron 0.024483, 0.024483, 0.002004, 0.024754 y 0.002275. Las fuentes identificadas en esas repeticiones fueron texto de anuncio/controles de header, aviso y cabecera del catálogo. El pico inicial no se reprodujo con instrumentación; no se atribuye una mejora ni se garantiza ausencia de regresión de CLS a partir de estos datos. Conviene comprobarlo en QA con fuentes y tiempos de red reales.

## Archivos y alcance

CatalogQuickActions, nuevo QuickCatalogSearch, catalog-quick-visibility, FloatingWhatsAppContact, HomePage, CatalogPage y StoreLayout. Pruebas en catalog.test.cjs y wholesale-info.test.cjs; documentos tasks, project-state, design y este informe. CatalogSearch normal, contratos, lógica comercial y persistencia intactos.

## Pendientes reales

Promoción manual a QA y smoke con Cajora del entorno. Pruebas físicas Android/iOS/Safari, teclado virtual real, notch/safe areas y lector de pantalla no se sustituyen con Edge/viewport emulado. Revisar variabilidad de CLS en ese entorno. No se promovió a qa/master.
