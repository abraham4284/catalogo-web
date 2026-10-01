# Estado vigente

Current phase: F5 completada. Próxima fase: F6.

- Frontend: React + TypeScript + Vite Storefront; shell público compartido con StoreLayout, Header y Footer neutrales y responsive.
- Routing: `/`, `/productos`, `/productos/:idProduct`, `/carrito` y `*` dentro del layout; detalle consume API real, Not Found con regreso al inicio. IDs de producto inválidos no montan fetching ni hacen requests. Header enlaza al carrito sin store ni contador.
- Environment: `config/env.ts` centraliza VITE_CATALOG_API_URL (prefijo completo /api/public) con validación lazy Zod; `.env.example` disponible y configuraciones locales ignoradas. El shell funciona sin URL configurada.
- Backend: backend comercial Cajora desplegado separadamente.
- Catalog API: capa frontend encapsulada para negocio, categorías, listado paginado y detalle; validación runtime Zod de inputs/envelopes/DTOs, tipos derivados y errores normalizados con cancelación distinguible. Contrato F2 corregido en F3: totalPages >= 1, sortOrder >= 0.
- Catalog UI: Home consume negocio, categorías y primeros 8 productos; catálogo consulta 24 por página, búsqueda por submit y categorías. ProductCard/Grid responsive con precio es-AR/ARS, disponibilidad pública y navegación a detalle. Estados loading/error/empty con mensajes seguros.
- Product detail: datos públicos, descripción opcional como texto, enlaces a catálogo/categoría y galería responsive. Portada primero, adicionales ordenadas/deduplicadas, miniaturas accesibles y fallback ante imágenes ausentes/rotas (también en cards). Fetching abortable; cambio de ID reinicia el contenido. HTTP 404 presenta producto no disponible, otros errores usan mensajes seguros.
- Catalog filters: search/category/page en URL, parsing seguro de parámetros inválidos; cambio de búsqueda/categoría reinicia página y paginación conserva filtros. Página superior a totalPages redirige a la última válida con replace, conservando filtros. Requests abortables con protección de respuestas obsoletas.
- Database: DB_COMERCIO independiente de Cajora SaaS DB.
- Brand: no definida; ningún nombre temporal representa branding final.
- Cart: implementado con Zustand + localStorage, clave catalogo-web-cart, versión 1; solo snapshot idProduct/name/price/quantity. Re-agregar actualiza nombre/precio y aumenta cantidad sin duplicar filas. Agregado desde detalle por slot actions compuesto en la página, deshabilitado si available=false. /carrito permite cantidades, eliminar/vaciar, estado vacío y totales derivados. Rehidratación validada con Zod; datos corruptos/incompatibles implican carrito vacío; almacenamiento bloqueado mantiene funcionalidad en memoria.
- Cart snapshot: precio/disponibilidad no garantizados ni revalidados automáticamente; sin reservas, órdenes ni sincronización backend. WhatsApp todavía no implementado.
- Checkout: handoff a WhatsApp para MVP; no implementado.
- Customer authentication: fuera de alcance.
- Blog: posibilidad futura, fuera del MVP.
- Architecture: features + Clean Architecture pragmática; shadcn en shared.
- Git: `dev → qa → master`.
- Validation: `npm run lint` y `npm run build` pasan sin warnings; 11 pruebas catálogo y 7 carrito pasan con `node --test tests/catalog.test.cjs tests/cart.test.cjs`. Pruebas de persistencia usan almacenamiento en memoria y el store Zustand real, sin React DOM. Sin requests automáticas a producción ni verificación visual contra backend real.
