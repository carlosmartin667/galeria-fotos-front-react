# GaleriaFotos Front React

Frontend React moderno para consumir el backend .NET existente de GaleriaFotos.

Este repositorio no toca el backend ni depende del frontend Angular. Angular sigue siendo el frontend completo actual; esta app React es una base paralela para migracion/prototipo incremental.

## Stack

- React, TypeScript y Vite.
- React Router para navegacion.
- TanStack Query para datos remotos.
- React Hook Form y Zod para formularios.
- Axios para API client.
- Bootstrap 5 para UI base.
- Vitest, Testing Library y MSW para tests.

## Configuracion

Copiar `.env.example` si hace falta una configuracion local:

```bash
VITE_API_URL=http://localhost:5200/api
```

No se debe versionar `.env` real ni secretos.

## Scripts

```bash
npm install
npm run dev
npm run typecheck
npm run build
npm test
npm run audit
```

## Rutas principales

- Publicas: `/`, `/home`, `/login`, `/register`.
- Usuario autenticado: `/dashboard`, `/eventos`, `/fotos`, `/carrito`, `/pedidos`, `/descargas`, `/mi-historial`, `/notificaciones`, `/perfil`.
- Admin: `/admin/dashboard`, `/admin/operaciones`, `/admin/eventos`, `/admin/fotos`, `/admin/clientes`, `/admin/pedidos`, `/admin/descargas`, `/admin/presupuestos`, `/admin/agenda`, `/admin/ventas`, `/admin/reportes/ventas`, `/admin/bitacora`, `/admin/dev-tools`.

## Documentacion

- `docs/REACT_ARCHITECTURE.md`
- `docs/REACT_SECURITY.md`
- `docs/REACT_TESTING.md`
- `docs/REACT_DEMO.md`
- `docs/REACT_INTERVIEW_GUIDE.md`

## Base tecnica v2

R1 endurece la base sin agregar modulos grandes:

- Config centralizada en `src/config`.
- Roles y rutas centralizados.
- Query keys estables para TanStack Query.
- MSW para tests Node/JSDOM.
- Helper `renderWithProviders`.
- ErrorBoundary y estados compartidos.
- Lazy loading inicial de paginas.
- CI con `npm audit --audit-level=high`.

## Auth R2

La fase R2 agrega seguridad funcional de autenticacion:

- Register real contra `/api/Auth/register`.
- Login con `returnUrl` seguro y redireccion por rol.
- Deteccion local de expiracion JWT por claim `exp`.
- Roles y permisos centralizados.
- Perfil usuario simple basado en datos seguros de sesion.
- MSW con handlers de login/register para tests.

## Sitio Publico R3

R3 completa el sitio publico inicial en React:

- Home, portfolio, servicios, FAQ, contacto, presupuesto, disponibilidad, promociones y testimonios.
- API clients publicos por dominio.
- Formularios publicos con React Hook Form y Zod.
- TanStack Query para server state.
- MSW con handlers publicos.
- SEO basico por pagina.

## Usuario/Cliente R4

R4 agrega la experiencia privada de cliente:

- Dashboard, eventos, fotos, favoritos, carrito, pedidos, descargas, historial, notificaciones y perfil.
- API clients por dominio de usuario.
- Mutations con invalidacion de TanStack Query para favoritos, carrito, cupones, pedidos, descargas y notificaciones.
- Seguridad visual para no mostrar storage keys, URLs firmadas completas, notas internas ni metadata cruda.

## Admin R5

R5 amplia el area administrativa:

- Rutas protegidas por rol Admin bajo `/admin`.
- Modulos de operaciones, eventos, fotos, clientes, pedidos, descargas, presupuestos, agenda, sesiones privadas, portfolio, servicios, FAQ, notificaciones, plantillas, ventas, cupones, promociones, testimonios, carritos abandonados, reportes y Pexels.
- API clients admin por dominio usando el mismo backend .NET.
- Formularios criticos con React Hook Form y Zod.
- MSW y tests para rutas, acciones sensibles y sanitizacion de metadata admin.

## Calidad final R6

R6 cierra la base para demo y entrevista:

- Chunk inicial optimizado: Bootstrap JS se carga bajo demanda desde layouts y las configs Admin ya no se importan en el router raiz.
- Seguridad visual final en Bitacora, DevTools y metadata Admin.
- Accesibilidad mejorada en foco visible, formularios criticos y tablas Admin.
- CI ejecuta `npm ci`, `npm run typecheck`, `npm run build`, `npm test` y `npm audit --audit-level=high`.
- Cobertura final: 70 tests con Vitest, Testing Library y MSW.
