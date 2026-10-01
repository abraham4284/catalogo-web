# Estado vigente

Current phase: F0 completada. Próxima fase: F1.

- Frontend: React + TypeScript + Vite Storefront; baseline Router `/` y `*`, Home/Not Found mínimas.
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
