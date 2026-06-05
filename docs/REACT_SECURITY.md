# Seguridad React

## Backend y endpoints

La app React no cambia endpoints ni contratos del backend .NET. Toda autorizacion real sigue siendo responsabilidad del backend.

## JWT y sesion

La sesion se guarda en `sessionStorage` para sobrevivir al refresh sin persistencia duradera de navegador. Es un compromiso para prototipo SPA; para produccion conviene evaluar cookies `HttpOnly`, `Secure` y `SameSite` emitidas por backend.

El interceptor:

- agrega `Authorization: Bearer` si hay token;
- limpia sesion ante `401`;
- conserva sesion ante `403`.

## Roles

`ProtectedRoute` exige sesion. `RoleRoute` exige roles, por ahora `Admin` para rutas administrativas. Los roles soportados esperados son `Admin`, `Usuario`/`Cliente` e `Invitado`.

## Datos sensibles

No se exponen tokens, passwords, api keys, bearer tokens, `StorageKey`, `MarcaAguaStorageKey`, `signedUrl` ni URLs con query sensible. Las respuestas de Bitacora y DevTools se pasan por sanitizacion antes de renderizarse.

## Errores

`apiError` normaliza errores HTTP conocidos y evita mostrar stacktraces o bodies crudos. Si existe `correlationId` en headers o body, se conserva para diagnostico.
