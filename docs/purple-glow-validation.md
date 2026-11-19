# Zoom-in y purple glow — 2026-11-19

Rama dev, árbol inicialmente limpio. Sin operaciones Git de escritura. Producción cambia únicamente CatalogQuickActions.tsx; se agregan tests/catalog-quick-actions.test.cjs y documentación tasks/project-state/design/este informe.

## Implementación

- Barra: transition de opacity y scale, 200 ms ease-out, escala inicial 0.95 y opacidad cero. La clase cambia solo al variar visibilidad efectiva; renders/scroll dentro de la zona no reinician la transición. Oculta mantiene visibility:hidden y pointer-events:none; sus botones no reciben foco.
- Buscar: escala 0.94 → 1, opacidad y translateY 8 → 0 en 220 ms. Backdrop foreground/50 conserva fade de 200 ms. Halo estático de primary al 38%, blur de sombra 32 px y expansión 6 px, sin animar box-shadow, sin filtros de pantalla ni capas decorativas adicionales. Conserva glass/borde violeta de input.
- Salida: 150 ms con escala 0.96 y opacidad cero; Base UI conserva DOM y retira el portal al completar. Submit guarda el destino canónico en ref y navega únicamente desde onOpenChangeComplete(false), consumiéndolo una vez. Evita que loading de resultados desmonte la cápsula antes de terminar. Cerrar sin enviar no navega. Filtrar mantiene su sombra habitual y duración 200 ms.
- Reduced motion: transición none, escala uno y sin desplazamiento. Halo estático permanece.

No se agregan listeners, dependencias, estados de negocio o solicitudes. No cambian hooks/umbral de segunda fila, coordinación WhatsApp/paneles, parámetros, formulario, chip, categoría, paginación, scroll de catálogo/ficha, Home 8+4, grillas, precios o stock.

## Validación

Desde client: 146 pruebas correctas con node --test tests/*.test.cjs, npm run lint y npm run build. Dos regresiones nuevas ejecutan el componente real con fronteras controladas: navegación solo tras completar salida, destino consumido una vez, cierre sin navegación y categoría global/page=1 preservados. No se basan en cadenas CSS.

Edge headless con preview aislado 5175 y fixtures de Cajora. Matriz 320/375/390/768/1024/1440, Inicio y Catálogo:

- Barra oculta no recibe foco ni eventos de puntero. Al alcanzar segunda fila, escala/opacidad intermedias reales entre 0.95 y 1; duración computada 0.2s.
- Se registran transitionrun de la barra y se comparan antes/después de bajar 200+200 y subir 150 px: ningún reinicio, ni ocultación dentro de la zona.
- Cápsula: escala intermedia 0.94–1, duración computada 0.22s, sombra violeta real. Input enfocado. Escritura sin consultas. Sin overflow horizontal en los doce casos.
- Cierres por X, Escape y clic fuera: DOM aún presente a los 35 ms con data-ending-style y duración 0.15s; finalmente se desmonta. Foco regresa a Buscar y la barra es operativa. Abrir Filtrar después no conserva halo del buscador.
- Categoría Perfumería: quitar chip conserva texto y no consulta; cancelar descarta borrador. Enviar con categoría conserva query. A los 35 ms tras submit, URL aún intacta y popup en salida; después navega al destino correcto.
- Quitar chip y Enter genera búsqueda global y scroll cero por cambio de categoría; limpiar y page reset operativos. Reduced motion con scale=1 y transition-property:none tanto en barra como popup.
- Suite de prioridades: cookies, toast, side cart, menú, viewport reducido y zoom CSS 200% correctos. Sin errores JavaScript observados.

Capturas de 375/1440 inspeccionadas: cápsula clara con halo violeta difuso, foco distinguible y productos atenuados detrás. Evidencia en C:/Users/Abrah/.codex/visualizations/2026/10/01/01a0f4d0-0ee0-7c52-8453-0a514659d862/:
purple-glow-375.png, purple-glow-1440.png y purple-glow-qa.json.

## Impacto medido local

Builds comparables: API fixture 5175, número de WhatsApp de prueba, Pixel desactivado; sin modificar archivos de entorno. Build final con configuración normal.

| Métrica | Antes | Después |
| --- | --- | --- |
| JS principal | 328.14 kB / gzip 102.28 | 328.60 kB / gzip 102.40 |
| CSS | 59.22 kB / gzip 10.56 | 60.69 kB / gzip 10.75 |
| Solicitudes Inicio | 3 | 3 |
| Solicitudes Catálogo | 3 | 3 |
| CLS Inicio 375×667 | 0.003577 | 0.002917 |
| CLS Catálogo 375×667 | 0.002275 | 0.024494 |

Solicitudes idénticas de categorías, negocio y productos (limit 12/24). No hay consultas por abrir/escribir/quitar chip. Mismos 486 módulos, sin librerías añadidas. Una corrida de CLS por ruta/versión, sensible a fuentes y datos asíncronos como en fases anteriores: no demuestra mejora/regresión ni equivale a p75 o métricas de producción. Las transiciones no cambian dimensiones del layout. No se midieron INP ni rendimiento de dispositivos físicos.

## Pendientes

Smoke desplegado en QA y revisión visual del propietario. Teclado virtual real Android/iOS, Safari, notch/safe areas y lector de pantalla quedan pendientes; viewport de Edge es evidencia parcial. Promoción manual dev → qa → master, sin actualizar producción.
