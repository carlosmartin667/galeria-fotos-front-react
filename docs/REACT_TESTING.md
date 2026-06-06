# Testing React

La base usa Vitest con Testing Library, MSW y `jsdom`.

## Comandos

```bash
npm test
npm run typecheck
npm run build
npm run audit
```

## Cobertura inicial

- Normalizacion segura de errores API.
- Sanitizacion de texto y objetos sensibles.
- Login/logout del `AuthProvider`.
- Bloqueo de `ProtectedRoute` sin sesion.
- Bloqueo de `RoleRoute` para usuario no admin.
- Render basico de botones en DevTools.
- Config centralizada.
- Roles y rutas.
- Query keys.
- MSW en Node/JSDOM.
- `renderWithProviders`.
- ErrorBoundary.
- Lazy routes principales.
- Register real con validaciones.
- Login por rol y `returnUrl`.
- JWT helpers.
- Permisos.
- Interceptores de `apiClient`.

## Criterio

Los tests iniciales cubren la infraestructura critica. Las proximas features deben sumar tests por comportamiento visible, especialmente formularios, autorizacion y llamadas a backend.

## MSW

MSW esta configurado en `src/test/msw`. El setup de Vitest inicia el server con `server.listen()`, resetea handlers despues de cada test y lo cierra al final. Por ahora no se genera service worker browser.

R2 agrega handlers MSW para login admin, login cliente, login invalido, register exitoso, register con error 400 y 403 controlado.

R3 agrega handlers MSW para home, contacto, portfolio, servicios, FAQ, presupuesto, disponibilidad, promociones y testimonios con datos fake seguros.

R5 agrega handlers MSW para endpoints admin de operaciones, clientes, descargas, presupuestos, agenda, sitio, notificaciones, cupones, carritos abandonados, reportes, ventas y herramientas de fotos/Pexels.

## Helpers

`src/test/renderWithProviders.tsx` permite render publico, usuario autenticado, admin autenticado e initial route con QueryClient y AuthProvider.

## Publico R3

Los tests publicos cubren layout publico, visibilidad de Panel por rol, presupuesto, testimonios, servicios, portfolio y FAQ. Evitan asserts de estilos para mantenerse estables.

## Usuario R4

R4 agrega MSW handlers y tests para layout cliente, eventos, fotos/favoritos, carrito/cupones, pedidos, descargas, historial y notificaciones. Los tests comprueban que no se rendericen storage keys, notas internas ni URLs firmadas completas.

## Admin R5

R5 agrega tests de acceso por rol, navegacion admin, fotos sin storage keys, formularios de evento/cupon/agenda, pedido, descarga, operaciones y sanitizacion de secretos en metadata administrativa.

## Calidad final R6

R6 eleva la suite a 70 tests. Agrega cobertura para rutas publicas sin sesion, bloqueo cliente en Admin, acceso Admin, sanitizacion de Bitacora, sanitizacion de DevTools y navegacion Admin final. El CI corre typecheck antes de build para detectar contratos rotos temprano.

## Alineacion OpenAPI R6.5A

R6.5A agrega tests de contrato para los puntos que habian quedado desalineados:

- Fotos cliente y admin usan `GET /Fotos/evento/{eventoId}` y no `GET /Fotos`.
- Fotos admin usa endpoints reales para storage key, metadata, bulk y `PUT /Fotos/{id}`.
- Reportes de ventas usa `GET /Reportes/ventas/resumen` con `desde` y `hasta`.
- Bitacora y Agenda envian filtros con nombres OpenAPI.
- DevTools expone 21 endpoints y ejecuta `POST /dev-tools/audit/test-entry`.
- MSW no conserva handlers inventados principales para fotos o reportes.

## Alineacion OpenAPI R6.5B

R6.5B eleva la suite a 86 tests. La cobertura nueva valida:

- Notas internas admin, creacion, edicion, eliminacion y ausencia en rutas usuario.
- Checkout Pro sin mostrar token ni URL de pago.
- Comentarios de evento/foto y bloqueo de comentario vacio.
- Paquetes de evento y agregado al carrito.
- Paginados con `Page`, `PageSize` y `All`.
- Sesiones privadas, cambio de estado y fotos privadas sin exponer datos sensibles.
- Perfil publico/admin sin datos privados.
- Handlers MSW exactos para los endpoints OpenAPI R6.5B.
