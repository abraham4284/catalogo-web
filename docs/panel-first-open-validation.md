# Corrección de primera apertura del Side Cart

Fecha: 2026-10-22. Rama dev. Ajuste posterior a F17; reemplaza su estrategia de lazy + preload para StorePanels. El feedback de agregado no cambia.

## Causa reproducida
La descarga anticipada del módulo no inicializaba el diálogo: `hasOpened` impedía montar StorePanels antes del primer clic. Ese clic disparaba simultáneamente React.lazy/Suspense y el montaje de Dialog.Root ya con open=true. El primer render del diálogo se consideraba abierto desde el inicio, omitiendo data-starting-style y por tanto el deslizamiento. La segunda apertura ya tenía un Root montado y sí transitaba de cerrado a abierto.

En build local de producción, esperando incluso a que terminara el preload antes del clic, se observó primera aparición a 315 ms directamente en x=0 (posición final), sin fotogramas intermedios. Segunda apertura: primer fotograma a 3 ms en x=420, con starting-style y 23 fotogramas intermedios. No eran requests comerciales ni revalidación del carrito.

## Corrección
StoreRoute importa StorePanels de forma síncrona y lo monta desde el primer render. Dialog.Root empieza en open=false y el clic solo cambia ese estado. Se retiran hasOpened, el loader y lazy/Suspense del panel. No hay un import en el camino crítico del clic ni un montaje inicial abierto.

Dialog.Root no genera su propio HTML; el Portal cerrado no monta popup/backdrop. El panel cerrado sigue sin ocupar espacio ni bloquear scroll, capturar foco o iniciar requests. Abrir se mantiene exclusivamente bajo control del usuario. CartPreview y menú siguen usando los mismos datos/acciones; páginas de catálogo, detalle, contacto y ayuda conservan lazy.

## Medición antes/después
Edge headless, viewport 1440×900, muestreo mediante requestAnimationFrame desde el clic programático. Una corrida por condición, sin throttling. Se observa el rectángulo real del panel, incluyendo la propiedad CSS translate. Son mediciones locales del clic a primer fotograma visible, no tiempos de carga de página ni garantías universales.

| Condición | Primera apertura | Segunda apertura | Transición de la primera |
| --- | ---: | ---: | --- |
| Build previo, incluso tras preload | 315 ms | 3 ms | No; aparece directamente en posición final |
| Build corregido | 7 ms | 3 ms | Sí, 23 fotogramas intermedios |
| Vite desarrollo corregido | 15 ms | 9 ms | Sí, 23 fotogramas intermedios |

El deslizamiento mantiene 250 ms y el backdrop 200 ms; no se confunde duración de animación con demora hasta empezar a abrir. Reduced motion sigue desactivando la transición.

## Validación
- node --test tests/*.test.cjs: 42 pasan, 0 fallos.
- npm run lint: OK.
- npm run build: OK, con aviso de chunk principal >500 kB detallado abajo.
- Build con fixtures locales: 320/375/768/1024/1440/1920, sin overflow. Entrada/salida animadas, título del menú estable al cerrar, Escape y retorno de foco, Tab dentro del diálogo, agregado sin autoapertura, edición de diez unidades y acceso al carrito completo/WhatsApp habilitado tras su verificación. Reduced motion sin animación activa. Sin errores JavaScript capturados.
- Primera/segunda apertura instrumentadas antes/después y en Vite local.
- Los builds para fixtures usaron variables temporales de proceso; se recompiló luego con configuración normal, sin editar archivos de entorno.

## Rendimiento y tradeoff
Tamaños Vite, kB decimales, configuración normal:

| Métrica | F17 lazy + preload | Corregido |
| --- | ---: | ---: |
| Principal minificado / gzip | 344.87 / 110.57 | 573.69 / 180.60 |
| Total JS inicial con modulepreload | 546.10 / 174.24 | 582.59 / 183.98 |
| JS inicial + panel precargado | 584.20 / 187.28 | 582.59 / 183.98 |
| CSS | 42.25 / 8.03 | 42.25 / 8.03 |

Se adelantan 36.49 kB minificados / 9.74 gzip al grafo inicial, eliminando la dependencia asíncrona de una interacción crítica. Frente a lo que F17 ya descargaba inmediatamente con su preload, el total es 1.61 kB minificado / 3.30 gzip menor por reagrupar módulos. El principal vuelve a superar 500 kB y Vite emite su advertencia; no se oculta ni se agrega manualChunks para maquillar la cifra. Sin dependencias nuevas. No se midieron Core Web Vitals ni dispositivos de gama baja.

## Evidencia y límites
Directorio: C:/Users/Abrah/.codex/visualizations/2026/10/01/01a0f4d0-0ee0-7c52-8453-0a514659d862/
- panel-first-open.cjs y panel-first-open-before.json / after.json / after-dev.json: muestras de fotogramas.
- f16-polish-qa.cjs / f16-polish-results.json: recorrido responsive reutilizado sobre el build corregido.

QA local con fixtures, sin enviar mensajes reales. No se inspeccionó Cajora en producción ni se atribuye su rendimiento a una implementación desconocida. Red, CPU y carga inicial real pueden cambiar las cifras. La corrección garantiza que la apertura no depende de un chunk diferido ni omite la transición por montar el diálogo abierto.
