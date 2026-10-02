# Validación F9

Implementación sobre dev, 2026-10-01. Fuente de verdad: contrato público del documento F9; no se inspeccionó ni modificó Cajora.

## Automated
Desde client, ejecutadas individualmente y también en conjunto las suites existentes:

| Comando | Resultado |
| --- | --- |
| node --test tests/catalog.test.cjs | 15 PASS |
| node --test tests/cart.test.cjs | 13 PASS |
| node --test tests/whatsapp.test.cjs | 6 PASS |
| npm run lint | PASS |
| npm run build | PASS, sin warnings |

34 pruebas en total. Cubren stock/contratos separados, rich content válido/inválido/versionado, disponibilidad, acciones reales de Zustand, snapshots/imágenes v2, topes, reconciliación sin incremento/escrituras idénticas, cantidades inconsistentes, stock cero, v1/corrupción/storage denegado/lleno, mensajes y URLs de consulta individual/configuración ausente. Se conservaron tests de filtros/galería/errores/cancelación/checkout. Sin dependencias nuevas ni framework DOM.

Build final: JS 488.06 kB (gzip 151.18 kB), CSS 29.70 kB (gzip 5.92 kB). No N+1: solo datos de listado en cards, sin fetching desde carrito. Logs del fixture local mostraron únicamente negocio/categorías/listado y detalle /5 visitado explícitamente; dobles requests de desarrollo corresponden a StrictMode/cancelación.

## Manual
Navegador disponible, fixtures HTTP locales temporales con imágenes SVG de prueba y contacto documental nunca abierto. No son datos ni assets de Cajora real. Inspeccionadas /, /productos, /productos/5 y /carrito en 320/375/768/1024/1440 px: 20 combinaciones sin overflow horizontal, con h1 único y sin controles anidados. Se revisaron screenshots de catálogo, detalle/rich content y carrito mobile.

Comprobado:
- Descripción corta y acciones comerciales coherentes en Home/Catálogo; producto agotado sin agregado y con consulta de disponibilidad.
- Imagen secundaria cargada y visible al apuntar con puntero fino (opacidad transiciona); imagen secundaria rota retirada, portada cargada conservada. Portada sin secundaria/fallback neutral también inspeccionados. CSS limita hover a capacidades reales y elimina transición con reduced-motion.
- Consulta individual y checkout: href codificado, nueva pestaña y protección rel; no apertura ni envío.
- Agregar desde Home llega al límite conocido; botón queda deshabilitado. Carrito usa imagen persistida y + bloqueado al máximo.
- Fixture D pasó de stock 4 a 2: al volver a catálogo se reconcilió; quantity quedó en 4, apareció aviso y se bloqueó CTA principal. Al decrementar a 2 volvió el enlace normal. Refresh conservó cantidad/imagen. Stock cero y una unidad restante cubiertos en tests puros/store.
- Rich content muestra h2/h3, listas y specs dl. String con etiquetas script se presenta literalmente; no existe main script. Descripción introducción y contenido detallado separado bajo la zona principal.

## Límites y operación
Touch real, lector de pantalla y emulación de prefers-reduced-motion no probados en dispositivo; reglas revisadas por código. No smoke test con API/hosting real, CORS ni reserva de stock. Se mantienen los pendientes operativos de F8; su QA histórico no se reescribió. Sin banners ni otros cambios fuera de F9. El stock es último snapshot conocido, no garantía en tiempo real.

Herramientas locales temporales detenidas y archivo fixture retirado al terminar. Items creados para QA retirados del carrito de prueba. Git no se modificó mediante add/commit/push; mensaje entregado para commit manual.
