# Reglas de código

## TypeScript
Mantener `strict`. Evitar `any` salvo justificación explícita; usar `unknown` en fronteras no validadas. Contratos HTTP tipados y tipos cercanos a su feature. No usar `src/types` como depósito global.

## React funcional
Componentes funcionales y hooks que encapsulan comportamiento real. Evitar `useEffect` como solución por defecto. Estado local para necesidades locales; Zustand solo para estado compartido/persistido. Sin contexto global innecesario.

## Clean Code
Nombres descriptivos, funciones pequeñas y cohesionadas, lógica pura y reglas sin duplicación. Un archivo no mezcla UI, HTTP, persistencia y dominio. Preferir composición; evitar proliferación de props booleanas. Comentar el porqué cuando no sea evidente, no el código obvio.

## SOLID pragmático
- SRP: una responsabilidad clara por componente, hook o función.
- OCP: composición y contratos estables antes que condicionales crecientes.
- LSP: contratos predecibles y respetados por componentes y funciones.
- ISP: pasar únicamente los datos necesarios; no DTOs enormes para cuatro campos.
- DIP: UI independiente de Axios, localStorage, construcción de URLs WhatsApp y servicios externos; aislar esos detalles en módulos adecuados.

## Abstracciones
Clean Architecture sin ceremonia. No crear por defecto `IProductRepository`, `ProductRepositoryImpl`, factories o `GetProductsUseCaseImpl`. Abstraer cuando aísle una dependencia real, represente dominio, evite duplicación relevante o permita probar una frontera significativa.

Componentes de más de ~200 líneas, hooks de ~150 y funciones de ~40–60 son señales para revisar responsabilidades, no límites ni razones para dividir mecánicamente.

## Dependencias y verificación
Usar herramientas existentes; agregar paquetes únicamente por necesidad concreta y justificada. Ejecutar lint/build y pruebas específicas pertinentes. No ampliar el alcance para resolver problemas ajenos sin diagnóstico.
