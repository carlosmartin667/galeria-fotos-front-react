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
  config/
  shared/
    components/
    utils/
    hooks/
  features/
    public/
    auth/
      profileApi.ts
      jwt.ts
    user/
    admin/
  services/
    api/
    auth/
    bitacora/
    dev-tools/
    sitio/
    portfolio/
    servicios/
    faq/
    presupuestos/
    agenda/
    promociones/
    testimonios/
    eventos/
    fotos/
    favoritos/
    carrito/
    cupones/
    pedidos/
    descargas/
    historial/
    notificaciones/
    perfil/
    admin/
  types/
  test/
    msw/
```

## Capas

- `app`: composicion, providers, router y layouts.
- `features`: pantallas y servicios por dominio.
- `services`: clientes de API y autenticacion.
- `config`: env, roles y rutas centrales.
- `shared`: utilidades y componentes reutilizables.
- `test`: setup reutilizable, helpers y MSW.
- `types`: contratos compartidos.

## Datos remotos

TanStack Query se usa para lecturas de backend. El cliente Axios centralizado agrega `Authorization: Bearer` cuando existe sesion y normaliza errores.

Las query keys viven en `src/services/api/queryKeys.ts`. Los clientes HTTP por dominio comienzan con `authApi`, `bitacoraApi` y `devToolsApi`, manteniendo `apiClient` como transporte base.

## Layouts

- `PublicLayout`: navegacion publica y acceso a login/panel.
- `UserLayout`: topbar sin sidebar para el usuario.
- `AdminLayout`: sidebar estilo Tabler, topbar y offcanvas responsive.

## Routing

React Router se mantiene en modo declarativo. Las paginas principales se cargan con `React.lazy` y `Suspense`; no se adopta framework mode ni SSR en esta fase.

R6 mantiene el router simple y evita imports pesados en el entrypoint. Las configuraciones de listados/resumen Admin se resuelven dentro de los chunks lazy de Admin, y Bootstrap JS se importa bajo demanda desde los layouts que usan collapse/offcanvas. El chunk inicial queda centrado en React, providers, router y estilos globales.

## Base Tecnica V2

R1 agrega configuracion centralizada, MSW, helpers de test, ErrorBoundary, estados compartidos y lazy loading inicial. No incorpora modulos funcionales grandes.

## Auth R2

R2 fortalece la capa de autenticacion sin cambiar contratos del backend:

- `authApi` concentra `/Auth/login` y `/Auth/register`.
- `authService` interpreta respuestas, persiste sesion minima y descarta tokens expirados.
- `jwt.ts` contiene helpers puros para payload y expiracion.
- `permissions.ts` centraliza permisos iniciales.
- `ProfilePage` usa datos seguros de sesion; queda pendiente integrar un endpoint de perfil usuario si el backend lo expone de forma estable.

## Publico R3

R3 agrega clientes publicos por dominio y paginas lazy dentro de `PublicLayout`. Los formularios publicos viven en `features/public` y usan Zod para validar antes de enviar. El server state se maneja con TanStack Query y query keys centralizadas.

## Usuario R4

R4 agrega rutas cliente bajo `UserLayout` usando React Router declarativo y lazy loading. Cada dominio usa un API client propio y query keys centralizadas. Las mutations invalidan las queries afectadas y evitan optimistic updates en pedido, carrito y descarga.

## Admin R5

R5 mantiene React Router en modo declarativo y agrupa las pantallas administrativas bajo `features/admin/r5`. Los clientes HTTP admin viven en `services/admin` por dominio, reutilizan `apiClient` y conservan contratos del backend .NET. Las pantallas simples comparten componentes de tabla, filtros, metadata sanitizada y encabezados; los flujos sensibles tienen pantallas dedicadas para pedido, descarga, presupuesto, notificacion, agenda, cupones, herramientas de fotos y cliente historial.

## Calidad R6

No se agrega SSR, React Compiler, Zustand ni PWA. La estrategia sigue siendo SPA con Vite y TanStack Query. Las optimizaciones aplicadas son reversibles y de bajo riesgo: lazy loading por pagina/grupo, carga diferida de Bootstrap JS y separacion de configuracion Admin fuera del chunk raiz.
