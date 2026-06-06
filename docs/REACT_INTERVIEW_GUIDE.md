# Guia de entrevista React

## Speech de 60 segundos

Este frontend React es una migracion paralela y segura del frontend Angular existente. Consume el mismo backend .NET sin cambiar endpoints ni contratos. La base usa React 19, Vite, React Router, TanStack Query, React Hook Form, Zod, Vitest, Testing Library y MSW. La app cubre sitio publico, auth, usuario/cliente y admin, con guards por rol, manejo de 401/403, sanitizacion visual de metadata sensible, tests automatizados y CI. R6 cierra performance y calidad: lazy loading por rutas, Bootstrap JS bajo demanda, typecheck en CI, 70 tests y documentacion de demo/entrevista.

## Arquitectura

- `src/app`: providers, router, guards y layouts.
- `src/features`: pantallas por dominio.
- `src/services`: API clients por dominio sobre `apiClient`.
- `src/config`: env, rutas, roles y permisos.
- `src/shared`: componentes, hooks y utilidades reutilizables.
- `src/test`: MSW y helpers.
- `src/types`: DTOs y contratos TypeScript.

## Comparacion breve con Angular

Angular aporta estructura fuerte por defecto. En React se compenso con carpetas por dominio, query keys centralizadas, API clients por modulo, guards explicitos y tests de comportamiento. No se copian estilos obligatoriamente; se replica robustez funcional y de seguridad.

## Por que React + Vite

React permite migracion incremental y componentes livianos. Vite da desarrollo rapido, build simple y code splitting nativo por imports dinamicos.

## Por que TanStack Query

El backend es la fuente de verdad. TanStack Query separa server state de UI state, maneja cache, loading/error states, invalidaciones y evita duplicar estado remoto en contextos globales.

## Por que MSW

MSW permite probar flujos de UI contra endpoints simulados realistas, incluyendo errores 401/403/500 y payloads sensibles, sin tocar backend ni depender de datos externos.

## SessionStorage y tradeoff

Se usa `sessionStorage` como compromiso SPA: sobrevive al refresh y se borra al cerrar la pestana. Para produccion, una opcion mas fuerte seria cookie `HttpOnly`, `Secure` y `SameSite` emitida por backend.

## Por que no SSR todavia

La app consume un backend autenticado y el objetivo actual es migracion SPA. SSR agregaria complejidad de auth, despliegue y cache sin ser necesario para cerrar paridad funcional.

## Por que no React Compiler todavia

React Compiler queda como evaluacion futura. En esta fase se prioriza estabilidad, build/tests verdes y cambios de bajo riesgo.

## Por que no Zustand

No hay client state complejo. Auth vive en Context y server state en TanStack Query. Agregar Zustand ahora seria una dependencia sin necesidad clara.

## Auth y roles

`AuthProvider` centraliza login, register, logout y sesion. `ProtectedRoute` exige sesion y `RoleRoute(Admin)` protege `/admin`. El interceptor agrega Bearer, limpia sesion ante 401 y conserva sesion ante 403.

## Seguridad visual

La UI no imprime tokens, passwords, storage keys, `MarcaAguaStorageKey`, URLs firmadas completas ni secretos. Bitacora, DevTools y metadata Admin usan sanitizacion antes de renderizar. El frontend oculta datos, pero la autorizacion real sigue en backend.

## Errores con DevTools

`/admin/dev-tools` ejecuta endpoints de diagnostico para validar errores, payloads raros y metadata sensible. Es una forma rapida de demostrar normalizacion de errores, sanitizacion y correlationId.

## Que mostrar en demo

1. Home publica.
2. Presupuesto con validacion.
3. Login cliente.
4. Eventos, fotos, carrito, cupon y pedido.
5. Descargas sin imprimir URL firmada.
6. Login Admin.
7. Reportes, Bitacora y DevTools.
8. Tests, CI y audit.

## Punto fuerte R6.5A

La app no solo tiene pantallas y tests: tambien fue contrastada contra el OpenAPI real. Se eliminaron endpoints inventados como `GET /Fotos` y reportes sin `/resumen`, se corrigieron metodos HTTP de acciones admin y se amplio DevTools a los 21 endpoints publicados. Es un buen punto para entrevista porque muestra criterio de arquitectura: separar API clients por dominio, proteger contratos con tests y no dejar que MSW o la UI oculten diferencias con el backend real.

## Punto fuerte R6.5B

R6.5B muestra madurez de producto: notas internas solo Admin, comentarios moderables, paquetes de evento, checkout seguro, sesiones privadas, paginados reales y perfil publico/admin. Lo importante para explicar es que React no inventa backend: cada flujo nace de OpenAPI, los services encapsulan contratos, MSW reproduce rutas reales y los tests prueban tanto UX como seguridad visual.

Tradeoffs defendibles: el webhook de Mercado Pago queda backend-only; React no calcula descuentos finales; fotos privadas y notas internas no se muestran fuera de Admin; React Compiler, SSR, PWA y Zustand siguen fuera porque no resuelven un problema actual.
