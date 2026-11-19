# Reset de scroll al aplicar categoría — 2026-11-19

Implementación en dev. Se conservaron los cambios locales de la tarea anterior (ocho productos y dos columnas). No hubo operaciones Git de escritura.

## Diagnóstico

CatalogPage reaccionaba únicamente al cambio de page y desplazaba a resultados. Un cambio de categoría en la misma página no tenía política de scroll; Inicio y Catálogo podían conservar posiciones profundas. Reproducción en Edge/375 sobre el build anterior: Inicio pasó de 1221 a 1313 px al filtrar; Catálogo conservó 1360 px.

## Corrección acotada

Solo CatalogPage cambia en producción. Un único efecto coordina navegación mediante key/useNavigationType y filtros canónicos:

- PUSH al entrar al catálogo o cambiar categorySlug: window.scrollTo({top:0,left:0,behavior:'instant'}).
- Cambio de página sin cambio de categoría: scrollIntoView del comienzo de resultados, como antes.
- POP: no hace scroll; la restauración del navegador conserva historial y regreso desde ficha.
- REPLACE conserva corrección de páginas inválidas al inicio de resultados.

Un único requestAnimationFrame cancelable ejecuta la acción después del foco de ruta. El snapshot de filtros se confirma al ejecutarlo; cancelaciones y replay de efectos de Strict Mode no pierden el reset. No depende de respuestas HTTP ni agrega listeners, temporizadores o estado comercial. Al cambiar categoría y reiniciar page simultáneamente, tiene prioridad el documento y no se programa un segundo scroll de paginación.

No se modifican enlaces/helpers, parámetros, búsquedas, borrador del chip, API, datos, carrito, WhatsApp, SEO, analytics, galería, breadcrumbs ni useProductEntryScroll. La entrada nueva al catálogo sin categoría también comienza arriba; carga directa y POP no fuerzan desplazamiento.

## Validación automatizada

node --test tests/*.test.cjs: 144 pruebas correctas; npm run lint y npm run build correctos desde client. git diff --check sin errores de whitespace. Las pruebas existentes de paginación se adaptaron al contexto de React Router y se añadieron cuatro regresiones: cambio/limpieza de categoría con page reset, PUSH frente a POP, cancelación rápida y Strict Mode. Se mantienen búsqueda + categoría, redirect, orden del backend y pruebas de entrada a fichas.

## Navegador local

Edge headless, build preview aislado 5175, fixtures de Cajora. Matriz 320/375/390/768/1440 en Inicio y Catálogo, desplazando hasta filas posteriores. Diez navegaciones por Filtrar dieron scrollY=0 después de aplicar Perfumería; orígenes entre 1221 y 1587 px.

En cada ancho se comprobó cambio a Auriculares, Todas las categorías y filtros convencionales. Desde search=term, categoria=perfumeria, page=2, cambiar categoría preservó search, quitó page y dejó scroll cero durante loading y después de respuesta retrasada 900 ms. Quitar categoría convencional conservó búsqueda y scroll cero.

Abrir/cerrar Filtrar, abrir Buscar, escribir un borrador y cerrar no alteraron scroll ni filtros. Entrada a ficha dejó scroll cero. Back a catálogo restauró 683 px frente a 660 px antes de abrir la ficha (variación de layout; sin reset al documento). Paginación dejó el contenedor de resultados a 0 px del viewport; Back/Forward conservaron posición posterior de página 2, sin competir con el efecto. No se observaron errores JavaScript.

Evidencia: C:/Users/Abrah/.codex/visualizations/2026/10/01/01a0f4d0-0ee0-7c52-8453-0a514659d862/category-scroll-before.json y category-scroll-after.json.

Sin dependencias ni solicitudes nuevas. Los cambios no recorren cards ni se ejecutan por cada scroll. No se midieron nuevas métricas de rendimiento o p75 para esta corrección puntual. Se ejecutó build final con la configuración normal del proyecto.

## Archivos de esta corrección

- client/src/pages/catalog/CatalogPage.tsx
- client/tests/catalog-pagination-scroll.test.cjs
- docs/tasks.md, docs/project-state.md, docs/design.md y este informe.

Los otros archivos modificados pertenecen a la tarea anterior y se preservaron.

## Pendientes

Smoke desplegado en QA y pruebas físicas Android/iOS, touch y teclado reales. Los eventos de enlaces/botones y viewport de Edge no sustituyen esas pruebas. Promoción dev → qa → master manual; no se actualizó producción.
