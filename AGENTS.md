# Repository contract

## Project
Storefront público independiente: React + TypeScript + Vite. Consume Cajora Public API como backend comercial y puede integrar otras APIs independientes.

## Required reading policy
Antes de implementar: leer `docs/tasks.md`, únicamente los documentos relevantes y el código afectado. No releer todo `docs/` ni auditar archivos ajenos a la tarea.

| Necesidad | Documento |
| --- | --- |
| Producto / alcance | `docs/prd.md` |
| Arquitectura | `docs/architecture.md` |
| Código / SOLID / Clean Code | `docs/coding-rules.md` |
| UI / UX / branding | `docs/design.md` |
| Trabajo actual | `docs/tasks.md` |
| Estado vigente | `docs/project-state.md` |
| Decisiones tomadas | `docs/decisions.md` |

## Mandatory engineering rules
TypeScript estricto; React funcional; Clean Code, SOLID y Clean Architecture pragmáticos. Preferir composición a abstracciones ceremoniales y lógica pura cuando sea posible. API calls fuera de componentes; infraestructura aislada. Sin `any` salvo justificación explícita, branding definitivo hardcodeado, dependencias innecesarias ni scope creep. Crear carpetas solo con responsabilidad actual.

## Validation
Para cambios frontend, desde `client/`: `npm run lint` y `npm run build`. Ejecutar pruebas específicas cuando existan y correspondan. Mantener tareas y estado vigente consistentes con resultados reales.

## Git safety
Workflow: `dev → qa → master`. Antes de modificar, comprobar `git branch --show-current` y `git status`. Implementar sobre `dev`; si la rama es otra, detener modificaciones y reportar el bloqueo sin cambiarla.

Permitidos: `git status`, `git diff`, `git log`, `git branch --show-current`.
Prohibidos: `git add`, `git commit`, `git push`, `git reset`, `git restore`, `git clean`, `git checkout`, `git switch`. No modificar historial Git.
