# Estado vigente

Current phase: F3 completada. Próxima fase: F4.

- Frontend: React + TypeScript + Vite Storefront; shell público compartido con StoreLayout, Header y Footer neutrales y responsive.
- Routing: `/`, `/productos`, `/productos/:idProduct` y `*` dentro del layout; detalle continúa placeholder, Not Found con regreso al inicio.
- Environment: `config/env.ts` centraliza VITE_CATALOG_API_URL (prefijo completo /api/public) con validación lazy Zod; `.env.example` disponible y configuraciones locales ignoradas. El shell funciona sin URL configurada.
- Backend: backend comercial Cajora desplegado separadamente.
- Catalog API: capa frontend encapsulada para negocio, categorías, listado paginado y detalle; validación runtime Zod de inputs/envelopes/DTOs, tipos derivados y errores normalizados con cancelación distinguible. Contrato F2 corregido en F3: totalPages >= 1, sortOrder >= 0.
- Catalog UI: Home consume negocio, categorías y primeros 8 productos; catálogo consulta 24 por página, búsqueda por submit y categorías. ProductCard/Grid responsive con precio es-AR/ARS, disponibilidad pública y navegación a detalle. Estados loading/error/empty con mensajes seguros.
- Catalog filters: search/category/page en URL, parsing seguro de parámetros inválidos; cambio de búsqueda/categoría reinicia página y paginación conserva filtros. Requests abortables con protección de respuestas obsoletas.
- Database: DB_COMERCIO independiente de Cajora SaaS DB.
- Brand: no definida; ningún nombre temporal representa branding final.
- Cart: previsto como estado frontend Zustand respaldado por localStorage; no implementado.
- Checkout: handoff a WhatsApp para MVP; no implementado.
- Customer authentication: fuera de alcance.
- Blog: posibilidad futura, fuera del MVP.
- Architecture: features + Clean Architecture pragmática; shadcn en shared.
- Git: `dev → qa → master`.
- Validation: `npm run lint` y `npm run build` pasan sin warnings; pruebas de contratos, filtros URL y mensajes seguros pasan mediante `node --test tests/catalog.test.cjs`. Sin requests automáticas a producción ni verificación visual contra backend real.
