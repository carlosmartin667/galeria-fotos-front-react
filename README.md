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
- Vitest y Testing Library para tests.

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
npm run build
npm test
```

## Rutas iniciales

- Publicas: `/`, `/home`, `/login`, `/register`.
- Usuario autenticado: `/dashboard`.
- Admin: `/admin/dashboard`, `/admin/bitacora`, `/admin/dev-tools`.

## Documentacion

- `docs/REACT_ARCHITECTURE.md`
- `docs/REACT_SECURITY.md`
- `docs/REACT_TESTING.md`
- `docs/REACT_DEMO.md`
