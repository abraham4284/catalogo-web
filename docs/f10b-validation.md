# Validación F10B

Implementado sobre dev, 2026-10-02, a partir del contrato F10B suministrado y la frontera pública existente F10A. No se modificó Cajora ni se verificó su despliegue real.

## Automated

Desde client, comandos ejecutados individualmente:

| Comando | Resultado |
| --- | --- |
| node --test tests/catalog.test.cjs | 17 PASS |
| node --test tests/cart.test.cjs | 16 PASS |
| node --test tests/whatsapp.test.cjs | 6 PASS |
| npm run lint | PASS |
| npm run build | PASS, sin warnings |

39 pruebas. Cart cubre snapshot v3, slugs válidos/inválidos, estados comerciales, ausencia de booleano en datos parseados, rechazo de contrato legacy incompleto, cantidades/IDs seguros, stock no negativo, imágenes nullable, descarte v1/v2/futuras, corrupción, unicidad de IDs/slugs y storage bloqueado/lleno. Store real: agregado, re-agregado, topes, decrement mínimo, reconciliación de slug/nombre/precio/imagen/status/stock con quantity preservada y sin writes idénticos; agotado/encargo con stock 20 siguen sin checkout. Mapper selecciona solo campos v3.

Servicio asíncrono: requests concurrentes a múltiples slugs, estados comerciales/precio actualizado, fallos parciales, identidad distinta, nombre vacío no apto para carrito, abort antes/durante requests y retry exitoso. Key de verificación ignora quantity/precio/orden de filas. Hook y gate revisados estructuralmente y en navegador; sin nuevo framework DOM. WhatsApp conserva sus pruebas y verifica precio actualizado sin stock/status/slug/IDs en mensaje.

Build final: JS 490.99 kB (gzip 152.65 kB), CSS 29.70 kB (gzip 5.92 kB). Sin dependencias nuevas. Diff sin errores de whitespace tras limpieza final.

## Manual

Fixtures HTTP locales temporales; productos/contacto documentales, sin datos Cajora reales. WhatsApp solo inspeccionado mediante href, nunca abierto ni enviado.

- Normal: dos productos, primero con cantidad 2 y stock 5. Loading mostró “Verificando precio y disponibilidad…” sin enlace WhatsApp; verificación completa habilitó checkout.
- Cambiar quantity de 2 a 4 no generó requests adicionales en logs. Refresh rehidrató cantidad 4. API con stock 2 conservó quantity, mostró aviso, bloqueó +/checkout; disminuir hasta 2 habilitó checkout sin revalidar por cantidad.
- OUT_OF_STOCK conservó item/cantidad, mostró No disponible y deshabilitó ambos controles. ON_ORDER con stock 20 mostró Por encargo/aviso, conservó item y bloqueó checkout/controles. Enlace imagen/nombre usa /productos/prueba-1.
- Error parcial: segundo detalle devolvió 404 ambiguo. Su snapshot permaneció, fila indicó fallo, checkout quedó deshabilitado y apareció retry. Primer éxito actualizó nombre/precio; total pasó a $34.000 para 2 unidades de $12.000 y una de $10.000.
- Retry sin recargar verificó el conjunto actual, retiró error y habilitó checkout. Href contenía nombre/precio nuevos y total actualizado; sin campos internos.
- Al eliminar segundo item durante requests demorados, la corrida vieja no publicó su fallo; se verificó el conjunto restante y se habilitó checkout. Al quitar el último item quedó vacío sin requests adicionales.
- Carrito revisado en 320/375/768/1024/1440 px: sin overflow horizontal, h1 único y sin controles interactivos anidados. Captura mobile del encargo bloqueado revisada. Controles con disabled real y loading/error como estados accesibles. Imagen modificada en fixture devolvió error y mantuvo fallback; actualización de URL también cubierta en store tests.

Servicios temporales detenidos, archivos fixture/config retirados, items QA eliminados mediante UI y viewport restaurado. No se ejecutó add/commit/push.

## Revalidation behavior

Una request pública de detalle por item, concurrente mediante Promise.allSettled. Se ejecuta al montar carrito, cambiar conjunto idProduct+slug o retry manual. Sin requests desde cards ni desde dominio/store de Cart. Quantity, reconcile y renders no disparan nuevas consultas. StrictMode de desarrollo puede iniciar una corrida adicional que se cancela; no es polling.

Composición valida identidad y nombre utilizable, selecciona snapshot v3 y reconcilia éxitos después de completar la corrida. Errores no fabrican estado comercial ni eliminan items. AbortController y key comparada con store actual protegen de resultados obsoletos. Estado de verificación es runtime y no se persiste. El enlace grupal requiere success más isCartReadyForInquiry; success HTTP por sí solo no habilita stock insuficiente, agotado ni encargo.

## Known limitations

Stock no reservado: puede cambiar después de verificar. WhatsApp confirma precio/disponibilidad; no existe garantía transaccional, checkout backend, órdenes, locks ni polling. ON_ORDER no entra en agregado/checkout grupal; un item que cambie a encargo permanece para revisión y acceso al detalle. Sin unitType público, cantidades enteras/paso 1.

v1/v2 se descartan sin inventar slug; no migración automática. Fixtures prueban integración local, sin smoke test Cajora/hosting/CORS real. Auditoría de vulnerabilidades F8 sigue pendiente. No prueba con lector de pantalla ni touch real. El hook se verificó estructural/manual; servicio/store se prueban sin DOM.

## Next

F11 visual permanece pendiente; sin añadir rediseño/merchandising en F10B. Antes de afirmar producción lista: configurar/validar backend y hosting reales y cerrar pendientes operativos de F8. Históricos F9/F10A conservados.
