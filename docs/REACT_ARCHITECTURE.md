# Arquitectura React

Este frontend React consume el mismo backend .NET de GaleriaFotos mediante `VITE_API_URL`, por defecto `http://localhost:5200/api`.

Angular se mantiene como frontend completo. React se desarrolla como migracion/prototipo paralelo, sin copiar codigo Angular literalmente y sin modificar endpoints.

## Estructura

```text
src/
  app/
    providers/
    router/
    layouts/
  shared/
    components/
    utils/
    hooks/
  features/
    public/
    auth/
    user/
    admin/
  services/
    api/
    auth/
  types/
```

## Capas

- `app`: composicion, providers, router y layouts.
- `features`: pantallas y servicios por dominio.
- `services`: clientes de API y autenticacion.
- `shared`: utilidades y componentes reutilizables.
- `types`: contratos compartidos.

## Datos remotos

TanStack Query se usa para lecturas de backend. El cliente Axios centralizado agrega `Authorization: Bearer` cuando existe sesion y normaliza errores.

## Layouts

- `PublicLayout`: navegacion publica y acceso a login/panel.
- `UserLayout`: topbar sin sidebar para el usuario.
- `AdminLayout`: sidebar estilo Tabler, topbar y offcanvas responsive.
