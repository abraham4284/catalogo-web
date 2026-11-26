# Google Maps en footer y retiro del banner — 2026-11-25

Implementado en dev, árbol inicialmente limpio. Sin operaciones Git de escritura, despliegues ni dependencias nuevas.

## Cambios

StoreFooter incorpora StoreLocationMap antes de su información existente. Usa la URL exacta del iframe aportado por el propietario (comparada carácter a carácter), title descriptivo, lazy, allowFullScreen y strict-origin-when-cross-origin. No agrega CTA ni dirección/horario/teléfono inventados; Google conserva sus controles nativos.

Visitá VITRUNO y Encontranos en San Miguel de Tucumán preceden al mapa. Fondo oscuro y mismo max-w-7xl/márgenes del footer. Altura exterior reservada: 256 px móvil, 288 px desde sm y 320 px desde lg, con bordes redondeados/overflow-hidden y fondo neutro. Un aviso permanente ayuda si el navegador bloquea Google; no se intenta detectar falsamente éxito/fallo desde un iframe cross-origin.

Home deja de importar/renderizar HomeOpeningBanner. Se elimina el componente y homeOpening, cuyos únicos consumidores eran ese componente y Home. Se conserva public/images/home/banner-proxima-apertura.webp como recurso histórico. No se sustituye por otro anuncio. No quedaron textos de próxima apertura en el código visible inspeccionado.

Logo, navegación, nota, preferencias de cookies, crédito Abrahamdev y URL externa se preservan exactamente. StoreLayout y su espaciador, ContactPage, lógica comercial y APIs no cambian. No se agregan observers/listeners/estado para cargar el mapa: lazy nativo.

## Privacidad y seguridad

AnalyticsConsent/consent.ts gestionan medición publicitaria de Meta, no contenido externo Google. No se reutilizó ese consentimiento ni se modificó su comportamiento. No se encontró política local que exigiera un control previo para este embed; se utiliza la inserción lazy pedida, que conecta con Google cuando el navegador decide cargarla. Esto no es una evaluación legal ni una garantía de ausencia de cookies de terceros.

No se encontró CSP local bloqueante ni se modificó seguridad. Google Maps funcionó en el preview sin cambios. Headers del hosting deben comprobarse al desplegar en QA. No se usaron SDK, API key, preconnect/preload ni servicios pagos de Google.

## Validación de código

- npm run lint y npm run build correctos desde client.
- node --test tests/wholesale-info.test.cjs: 26 pruebas pasan. Ajustada regresión Home sin banner y agregada regresión de embed, orden, navegación, crédito y atributos.
- node --test tests/*.test.cjs: 147 pruebas, 146 pasan y una falla previa: whatsapp.test.cjs, «general floating inquiry uses the exact message and configured number safely». El test espera «¡Hola! 👋 Quisiera…» y GENERAL_WHATSAPP_MESSAGE contiene «¡Hola! Quisiera…». El módulo WhatsApp y ese test no fueron modificados; el diff de storefront-content solo retira homeOpening. No se alteró copy comercial ajeno para ocultar la discrepancia.
- git diff --check sin errores de whitespace; Git avisa normalización de finales de línea en archivos sin diff de contenido.

## QA local

Edge headless, preview aislado 5175, respuestas Cajora de fixture. Matriz 320/375/390/768/1024/1440 en Inicio, Catálogo, ficha y Contacto: 24 combinaciones sin overflow horizontal. Un único iframe por footer, encima de navegación/crédito. Alturas interiores medidas: 254/286/318 px (se restan los dos bordes), iguales antes/después de la carga/bloqueo simulado; anchuras estables.

Se bloqueó Google en la matriz de layout para comprobar reserva de espacio y mensaje auxiliar sin depender de red. Luego se retiró ese bloqueo y se cargó la URL real: capturas 375/1440 inspeccionadas muestran el pin Vitruno y, en escritorio, la tarjeta Vitruno con Abrir en Maps. La búsqueda automatizada de texto del nombre no lo encontró en el body del iframe (Google lo representa fuera del texto accesible consultado); la verificación del nombre fue visual, no por ese selector. Sin errores JavaScript del storefront en la ejecución final.

Una rueda vertical de 150 sobre el mapa en viewport móvil desplazó la página de 6453 a 6545 px; no quedó atrapada en esa comprobación. No equivale a probar gestos touch físicos.

Inicio conserva doce artículos únicos, orden ocho/categorías/cuatro y secciones editoriales siguientes. No hay #home-opening ni texto Próximamente. No se solicitó banner-proxima-apertura.webp en ninguna navegación de la matriz. El recurso sigue presente en disco.

Home fría en 375: tres solicitudes Cajora (categorías, productos page=1&limit=12 y negocio); ninguna petición del embed antes de acercarse al footer. El mapa se solicitó al llegar a su zona. Es el comportamiento observado de lazy nativo, cuya distancia de carga depende del navegador; no una garantía universal de cero actividad Google en todas las rutas/condiciones. Contacto puede cargarlo antes por su menor longitud.

Navegación del pie, crédito target=_blank/rel=noopener noreferrer y preferencias operativos. Cookies suspenden barra flotante, vuelve al cerrar preferencias; el espaciador posterior permite que el crédito quede por encima de la barra al final de la página. No se modificó el comportamiento del carrito o las fichas.

## Rendimiento y límites

Sin consultas nuevas a Cajora. Sin solicitud de la imagen retirada. No se midieron nuevos LCP, CLS agregado, INP ni p75 real; la estabilidad del mapa se comprobó mediante sus dimensiones reservadas. Google introduce tráfico de terceros al cargar el iframe.

Build de validación: principal 329.02 kB / gzip 102.78, CSS 61.13 kB / gzip 10.78, 486 módulos. No se tomó un baseline nuevo de peso en esta tarea; no se atribuye mejora de bundle ni de Core Web Vitals. Build final correcto con configuración normal, sin modificar archivos de entorno.

Evidencia local en C:/Users/Abrah/.codex/visualizations/2026/10/01/01a0f4d0-0ee0-7c52-8453-0a514659d862/:
- footer-maps-qa.json: matriz y solicitudes.
- footer-maps-real.json: comprobación de rueda y errores.
- footer-maps-confirm-375.png / footer-maps-confirm-1440.png: Google real, inspeccionado.
- footer-maps-layout-375.png / footer-maps-layout-1440.png: reserva con Google bloqueado.

## Archivos

StoreFooter.tsx y nuevo StoreLocationMap.tsx; HomePage.tsx; eliminado HomeOpeningBanner.tsx; storefront-content.ts; wholesale-info.test.cjs; tasks.md, project-state.md, design.md y este informe. La imagen histórica no se eliminó.

## Pendientes

Smoke desplegado con Cajora QA, headers reales del hosting y dispositivos Android/iOS (gestos, teclado y safe areas). Resolver por separado la discrepancia previa del test WhatsApp. Promoción manual dev → qa → master; producción no fue actualizada.
