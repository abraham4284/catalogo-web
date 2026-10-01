# Estado vigente

Current phase: F1 completada. Próxima fase: F2.

- Frontend: React + TypeScript + Vite Storefront; shell público compartido con StoreLayout, Header y Footer neutrales y responsive.
- Routing: `/`, `/productos`, `/productos/:idProduct` y `*` dentro del layout; Home, catálogo y detalle mínimos, Not Found con regreso al inicio.
- Environment: `config/env.ts` centraliza VITE_CATALOG_API_URL con validación lazy Zod; `.env.example` disponible y configuraciones locales ignoradas. El shell funciona sin URL configurada.
- Backend: backend comercial Cajora desplegado separadamente.
- Catalog API: disponible mediante Cajora Public API según contrato provisto; sin integración frontend todavía.
- Database: DB_COMERCIO independiente de Cajora SaaS DB.
- Brand: no definida; ningún nombre temporal representa branding final.
- Cart: previsto como estado frontend Zustand respaldado por localStorage; no implementado.
- Checkout: handoff a WhatsApp para MVP; no implementado.
- Customer authentication: fuera de alcance.
- Blog: posibilidad futura, fuera del MVP.
- Architecture: features + Clean Architecture pragmática; shadcn en shared.
- Git: `dev → qa → master`.
- Validation: `npm run lint` y `npm run build` pasan sin warnings.
