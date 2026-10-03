# Validación F10A

Implementación sobre dev, 2026-10-02. Fuente de implementación: contrato completo del documento F10A suministrado. La referencia Cajora master 58b2283972f07936f4668b7285a77ad585d1158f no pudo recuperarse mediante navegador web; no se afirma inspección independiente del backend ni smoke test real.

## Automated

Desde client, suites ejecutadas individualmente:

| Comando | Resultado |
| --- | --- |
| node --test tests/catalog.test.cjs | 17 PASS |
| node --test tests/cart.test.cjs | 14 PASS |
| node --test tests/whatsapp.test.cjs | 6 PASS |
| npm run lint | PASS |
| npm run build | PASS, sin warnings |

37 pruebas. Cobertura: slugs de ruta/DTO/categoría sin normalización (incluido slug numérico), campos comerciales obligatorios/enums/nota nullable, rechazo de sustitución por contrato booleano antiguo, validación antes de HTTP, detalle por slug, categorySlug sin parámetro antiguo, errores 404 y cancelación de detalle, filtros URL, límites rich content, galería y errores seguros. Adaptador y acciones reales Zustand prueban in_stock permitido y out_of_stock/on_order rechazados incluso con stock 20; persistencia v2 y casos previos conservados. WhatsApp cubre los tres labels/mensajes, precio, ausencia de stock/IDs y URL codificada/configuración inválida.

Build: JS 488.68 kB (gzip 152.01 kB), CSS 29.70 kB (gzip 5.92 kB). Sin dependencias nuevas. Protección de respuestas obsoletas/cambio de slug revisada en efectos y key de montaje; no suite DOM nueva.

## Manual

Navegador con fixtures HTTP locales temporales; contacto documental solo inspeccionado, nunca abierto ni enviado. No datos de Cajora real. Rutas /, /productos, /productos?categoria=categoria-prueba, /productos/encargo-prueba y /carrito a 320/375/768/1024/1440 px: 25 combinaciones sin overflow horizontal, con h1 único y sin controles anidados. Captura mobile revisada de detalle/nota/consulta por encargo.

- Home/Catálogo presentan Disponible, No disponible y Por encargo con CTA individual correspondiente; solo disponible muestra Agregar. ON_ORDER conserva estado comercial con stock físico 20 y no ofrece agregado.
- Detalle por slug muestra nota literalmente, incluido texto con etiquetas, sin nodos HTML derivados. Categoría enlaza usando su slug.
- Página 9 con search/categoria redirige con replace a página 2 manteniendo ambos filtros. Nueva búsqueda conserva categoria y reinicia página; Todos conserva búsqueda y retira categoría. Categoria inválida queda ignorada y Todos activo.
- Ruta con slug uppercase no consulta API; slug válido desconocido recibe 404 y muestra “Producto no disponible” / “No pudimos acceder a este producto en este momento.” sin texto backend.
- Producto disponible agregado desde Home llega a carrito; nombre/imagen no enlazan al detalle, controles y checkout conservados. Item de prueba eliminado al terminar.
- Logs del fixture confirman categorySlug, detalles solo al visitar detalle y ausencia de requests de detalle desde carrito/cards. Dobles requests de desarrollo corresponden a StrictMode. Sin idProductCategory en query ni request para slug inválido.

Servicios temporales detenidos, fixture retirado y viewport restaurado. No se modificó Git mediante add/commit/push.

## Known limitations

Fixtures devuelven datos controlados para verificar consumo y navegación, sin reproducir búsquedas reales del backend. Smoke test Cajora/hosting/CORS real y auditoría de vulnerabilidades pendiente de F8 permanecen abiertos. No se afirma producción lista. Touch real/lector de pantalla no probados en dispositivo.

Stock es último snapshot conocido, sin reserva ni garantía en tiempo real. unitType no es público: cantidades enteras y paso 1. Carrito mantiene v2, sin slug/availabilityStatus/saleMode persistidos, sin revalidación ni incorporación de ON_ORDER.

## F10B handoff

Retirar app/compositions/product-cart-compatibility.ts cuando se migre contrato/persistencia de carrito. Hoy traduce exclusivamente availabilityStatus === in_stock al available interno v2 y preserva id/name/price/image/stock. Restaurar enlaces de detalle solo cuando el contrato del carrito tenga slugs del backend; no fabricarlos ni usar IDs como fallback. Revalidación, cambios de versión y soporte de encargos quedan pendientes de alcance F10B.
