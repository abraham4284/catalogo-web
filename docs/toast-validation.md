# Toast inferior de agregado — react-hot-toast

Fecha: 2026-10-22. Rama dev. Cambio solicitado después de F17 y de la corrección de primera apertura del panel.

## Implementado
Instalado react-hot-toast 2.6.1 (^2.6.1 en package.json, versión exacta/resolución en package-lock.json). Añade goober como dependencia transitiva; csstype ya existía. Reemplaza el Toast de Base UI; Base UI se conserva para Dialog/menú. La solicitud actual sustituye explícitamente el criterio inicial de F17 de no agregar una librería de toast y mostrarlo en el centro.

Un único FeedbackToaster en StoreRoute configura bottom-center, margen inferior de 16 px/safe area, ancho máximo 384 px y tarjeta clara con borde/sombra, sin Provider por producto. El helper showCartAddedToast de la UI de Cart genera check oscuro, título “Agregado al carrito” y nombre completo en texto React, sin HTML arbitrario. Un ID estable cart-added actualiza la notificación existente al agregar otro producto, en vez de apilar tarjetas.

La notificación dura 3000 ms para permitir leer el nombre; fade de entrada/salida 160/120 ms y removeDelay 200 ms. Reduced motion desactiva animaciones/transiciones mediante CSS. aria-live polite y role=status, sin acciones, foco ni captura de puntero. Conserva las reglas de F17: feedback solo cuando quantity aumenta realmente; botón Agregado disabled durante 1200 ms y retorno sujeto al stock. No se modifica dominio, store v3, schemas, API, revalidación ni checkout. El Side Cart permanece cerrado tras agregar y conserva su inicialización síncrona cerrada.

## Validación ejecutada
Desde client:
- node --test tests/*.test.cjs: 42 pasan, 0 fallos.
- npm run lint: OK.
- npm run build: OK, con advertencia existente de chunk principal >500 kB.
- git diff --check: sin errores de whitespace; avisos LF/CRLF de Windows.

Edge headless con fixtures HTTP locales: Home/catálogo/detalle × 320/375/768/1024/1440/1920, 18 casos de agregado. En cada caso: incremento exacto de una unidad, check y nombre correctos, confirmación polite, posición inferior centrada medida (16 px del borde), sin overflow, sin foco en toast ni captura de puntero, sin diálogo autoabierto, doble clic bloqueado y desaparición automática. Botón vuelve a su etiqueta normal después del estado temporal; ninguna request API durante agregado.

Casos adicionales: agregar dos productos actualiza una sola tarjeta con el último nombre; conflicto real de slug rechazado por el store no produce toast; stock límite conserva una sola unidad y botón deshabilitado después del feedback. Reduced motion con animation-name none; apertura/cierre manual del panel y retorno de foco conservados. Cero errores JavaScript capturados. Capturas 375/1440 revisadas; nombre largo completo sin desbordamiento.

No se añadieron pruebas puras que dupliquen implementación de UI. Las pruebas existentes de dominio/contratos se conservan y los casos nuevos se verificaron contra el store real en navegador.

## Rendimiento
Build con configuración normal, kB decimales:

| Asset | Antes (Base UI Toast, panel síncrono) | Después (react-hot-toast) |
| --- | ---: | ---: |
| Principal min / gzip | 573.69 / 180.60 | 571.64 / 180.75 |
| Total JS inicial con jsx-runtime | 582.59 / 183.98 | 580.54 / 184.13 |
| CSS min / gzip | 42.25 / 8.03 | 42.06 / 8.05 |

JS inicial: -2.05 kB minificado / +0.15 gzip. CSS: -0.19 / +0.02. Se mantiene el aviso de Vite >500 kB, sin cambiar límites ni introducir manualChunks. No se midieron Core Web Vitals. Las páginas de catálogo/detalle/contacto/ayuda siguen lazy.

## Evidencia
C:/Users/Abrah/.codex/visualizations/2026/10/01/01a0f4d0-0ee0-7c52-8453-0a514659d862/:
- hot-toast-qa.cjs, hot-toast-results.json.
- hot-toast-375.png y hot-toast-1440.png.

API/configuración contrastada con código instalado y documentación oficial: [Toaster](https://react-hot-toast.com/docs/toaster), [toast](https://react-hot-toast.com/docs/toast).

## Límites
QA local con fixtures, sin enviar mensajes reales ni modificar backend. No se verificaron Safari/dispositivos físicos ni lector de pantalla real. La tarjeta ocupa temporalmente una zona inferior visible, pero no bloquea controles/puntero y se retira automáticamente. El nombre del producto no se persiste en ningún estado nuevo: solo se usa para la notificación efímera.
