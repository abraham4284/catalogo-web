# Storefront frontend

Frontend público independiente de Cajora: Home, catálogo con búsqueda/categorías/paginación, detalle/galería, carrito local y consulta por WhatsApp. MVP técnico F8; integración y hosting reales pendientes de smoke test.

Stack: React 19, TypeScript, Vite, Tailwind CSS 4, shadcn/ui, React Router, Axios, Zod, Zustand y ESLint; npm como gestor.

Comandos desde `client/`:

- `npm ci`: instalar las dependencias del lockfile.
- `npm run dev`: desarrollo local.
- `npm run lint`: validación ESLint.
- `npm run build`: TypeScript y build de producción.
- `npm run preview`: previsualizar el build.
- `node --test tests/catalog.test.cjs tests/cart.test.cjs tests/whatsapp.test.cjs`: pruebas sin red.

Configuración pública de build: copiar `.env.example` a `.env` y definir `VITE_CATALOG_API_URL=<backend>/api/public` y `VITE_WHATSAPP_NUMBER=<número internacional de 8–15 dígitos>`, sin `+`, espacios ni guiones. Las variables `VITE_*` se incorporan al bundle; nunca incluir secretos. La configuración se valida de forma lazy; sin ella la aplicación muestra estados seguros.

Deployment: publicar `dist/` mediante HTTPS y configurar un fallback SPA a `/index.html` para rutas que no correspondan a archivos estáticos. Es obligatorio porque se usa `createBrowserRouter`: abrir o refrescar `/productos/1` debe servir la aplicación. No hay un proveedor de hosting configurado en este repositorio; `npm run preview` no valida la configuración del hosting final. En Cajora, confirmar `PUBLIC_CATALOG_BUSINESS_SLUG` y CORS con `STOREFRONT_URL` del frontend. Consultar el checklist y las limitaciones en [QA report](../docs/qa-report.md).

Contrato operativo: [AGENTS.md](../AGENTS.md). Alcance, arquitectura y estado: [docs](../docs/).
