# UX Contacto: local físico y enlaces de acción — 2026-11-25

Implementado en dev con árbol inicialmente limpio. No hubo operaciones Git de escritura, dependencias nuevas ni despliegues.

## Cambio y archivos

- ContactPage.tsx: conserva Contacto y formulario; reemplaza el bloque de atención online por Encontranos con filas Ubicación, Horarios de atención, WhatsApp y redes oficiales. Dos columnas desde lg y una antes. Iconos Phosphor de módulos específicos ya instalados.
- storefront-content.ts: physicalStore centraliza Congreso 1504, San Miguel de Tucumán, Tucumán, Lunes a sábados, 09:00 a 20:00 h y URL pública de Maps. No agrega teléfono, email comercial ni información de feriados.
- wholesale-info.test.cjs: adaptación de regresión de Contacto y nueva comprobación de una única acción envolvente con tracking una vez. Documentación tasks/project-state/design y este informe.

WhatsAppContactForm, getWhatsAppGeneralInquiryHref, StoreLocationMap, StoreFooter, SEO, analytics y lógica comercial no cambian. La Home, grilla, mapas embebidos, filtros, carrito y fichas quedan fuera del diff.

## Verificación de Google Maps

URL final: https://www.google.com/maps?cid=6814538745617586702

Verificada en Edge real: redirigió a /maps/place/Vitruno/ con identidad 0x94225b7833ffa62f:0x5e921ae258ac1a0e, título Vitruno - Google Maps y dirección Congreso de Tucumán 1504, T4002IMN San Miguel de Tucumán, Tucumán. Coincide con la ficha del embed. Se publica el texto Congreso 1504 exacto aportado por el propietario; no se importaron teléfono, estado abierto/cerrado u otros datos del resultado de Google. No hizo falta recurrir a una búsqueda genérica. El iframe del footer permanece intacto.

Referencia técnica consultada: https://developers.google.com/maps/documentation/urls/get-started. No se implementaron APIs ni geolocalización.

## Validación automatizada

npm run lint y npm run build correctos desde client. node --test tests/wholesale-info.test.cjs: 27 pruebas pasan. node --test tests/*.test.cjs: 148 pruebas, 147 pasan y falla únicamente el caso previo whatsapp.test.cjs «general floating inquiry uses the exact message and configured number safely»: espera emoji 👋 y el mensaje vigente no lo contiene. No se cambió mensaje ni test heredado fuera de alcance.

Se comprueban dirección/ciudad/horarios, URL pública (sin embed), enlaces sociales existentes, formulario/copy previo, ausencia de iframe en ContactPage y correo/teléfono inventados. La fila WhatsApp usa el helper con el número de configuración del entorno; al faltar ese número no genera enlace y presenta aviso. La nueva regresión ejecuta ContactPage, verifica icono/texto bajo un mismo anchor y que onClick agregue un único evento contact_page. El formulario conserva su callback previo.

## Navegador local

Edge headless con preview aislado 5175, fixtures para negocio/Cajora y número de WhatsApp de prueba. Matriz 320/375/390/768/1024/1440:

- Una columna hasta 768, dos en 1024/1440, sin superposición ni overflow horizontal. Información antes del formulario en móvil. Capturas 375/1440 inspeccionadas.
- Filas Ubicación y WhatsApp únicas, alturas medidas entre 110 y 161 px y anchos entre 246 y 654 px; blancos táctiles superiores a 44×44. Target _blank, rel noopener noreferrer, foco visible.
- En 375, click en SVG de ubicación y click en Congreso 1504 abren exactamente el mismo CID. Icono y texto de WhatsApp abren exactamente la misma URL wa.me con número del entorno y saludo general vigente. Para estos clicks se interceptaron destinos externos con respuestas de QA, sin contactar a nadie. Maps se validó por separado contra Google real como arriba.
- Enter sobre ubicación abre el mismo destino; foco programático/Tab y outline visibles.
- Submit vacío: nombre y mensaje inválidos, foco en nombre. Email mal formado: error de email. Nombre/mensaje válidos y email vacío: una apertura window.open con _blank y noopener,noreferrer, mensaje preparado correcto; no se envía automáticamente ningún mensaje. No se encontró nombre de prueba en localStorage.
- Zoom CSS 200% en 375 sin overflow. No sustituye zoom/teclado/gestos físicos.
- Un único iframe en documento, dentro del footer, lazy; ninguno en main. En la matriz de layout se bloqueó el embed para no repetir tráfico de Google. El mapa en producción no se modificó ni duplicó.
- Contacto solo solicitó el negocio público existente; no agrega consultas de productos/Cajora. No hay scripts, geolocalización ni SDK nuevos. Sin errores JavaScript del storefront observados.

No se midieron nuevos Core Web Vitals/p75. No se añadieron estados de disponibilidad/horarios dinámicos ni persistencia de formulario. Preferencias publicitarias de Meta intactas; un enlace externo no se asoció a ese consentimiento.

## Evidencias

Directorio C:/Users/Abrah/.codex/visualizations/2026/10/01/01a0f4d0-0ee0-7c52-8453-0a514659d862/:
- contact-maps-cid.json y contact-maps-cid.png: ficha real verificada.
- contact-local-qa.json: medidas, destinos y casos funcionales.
- contact-local-375.png, contact-local-1440.png, contact-local-zoom.png: capturas inspeccionadas.

## Smoke en QA antes de promoción

Abrir /contacto en móvil/escritorio; confirmar dirección y horarios, tocar icono/texto de Maps y WhatsApp, comprobar ficha/chat correctos, probar campos vacíos/email opcional y mensaje preparado. Verificar redes, preferencias, footer y único iframe lazy. Comprobar eventos contact_page con consentimiento/configuración de QA y sin duplicación por acción. Revisar aplicaciones reales Android/iOS, teclado, lector de pantalla y safe areas. Resolver por separado el test heredado de WhatsApp. Promoción dev → qa → master manual; producción no actualizada.
