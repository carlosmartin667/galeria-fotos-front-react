# Seguridad React

## Backend y endpoints

La app React no cambia endpoints ni contratos del backend .NET. Toda autorizacion real sigue siendo responsabilidad del backend.

La configuracion de API vive en `src/config/env.ts`. Si `VITE_API_URL` no existe, se usa `http://localhost:5200/api` como fallback local seguro. No se registran secretos ni se imprimen variables sensibles.

## JWT y sesion

La sesion se guarda en `sessionStorage` para sobrevivir al refresh sin persistencia duradera de navegador. Es un compromiso para prototipo SPA; para produccion conviene evaluar cookies `HttpOnly`, `Secure` y `SameSite` emitidas por backend.

R2 valida localmente el claim `exp` del JWT cuando existe. Si el token expiro, la sesion se limpia al iniciar la app. Esta validacion solo mejora UX; la seguridad real sigue dependiendo del backend.

El interceptor:

- agrega `Authorization: Bearer` si hay token;
- limpia sesion ante `401`;
- conserva sesion ante `403`.

## Roles

`ProtectedRoute` exige sesion. `RoleRoute` exige roles, por ahora `Admin` para rutas administrativas. Los roles soportados esperados son `Admin`, `Usuario`/`Cliente` e `Invitado`.

Los roles estan centralizados en `src/config/roles.ts` y se comparan de forma case-insensitive.

Los permisos iniciales viven en `src/config/permissions.ts`: admin, area usuario, descargas privadas, auditoria y DevTools. No es RBAC complejo; es una capa declarativa para evitar reglas dispersas.

## ReturnUrl

`returnUrl` solo acepta rutas internas que empiezan con `/`, rechaza URLs externas, `//`, `/login` y `/register` para evitar loops o open redirects.

## Datos sensibles

No se exponen tokens, passwords, api keys, bearer tokens, `StorageKey`, `MarcaAguaStorageKey`, `signedUrl` ni URLs con query sensible. Las respuestas de Bitacora y DevTools se pasan por sanitizacion antes de renderizarse.

## Errores

`apiError` normaliza errores HTTP conocidos y evita mostrar stacktraces o bodies crudos. Si existe `correlationId` en headers o body, se conserva para diagnostico.

`ErrorBoundary` captura errores de render y muestra un fallback seguro sin stacktrace ni payloads.

## Frontend vs Backend

El frontend oculta controles y mejora experiencia, pero no concede permisos reales. Todo acceso a datos sensibles, descargas, storage keys, URLs firmadas y acciones admin debe seguir validado por el backend.

## Sitio Publico

Las paginas publicas sanitizan datos antes de renderizar cuando puede haber metadata. No se muestran emails de testimonios, tokens, storage keys, URLs firmadas ni metadata cruda. Las imagenes usadas por contenido publico se tratan como URLs publicas del backend; no se usan URLs firmadas como Open Graph.

## Usuario/Cliente

Las rutas cliente nunca muestran `StorageKey`, `MarcaAguaStorageKey`, URLs firmadas completas, notas internas ni metadata cruda. Las descargas pueden abrir una URL firmada si el backend la devuelve, pero no se imprime completa en pantalla ni se persiste localmente. El carrito no se guarda en `localStorage`; siempre se consulta al backend.

## Admin R5

Las rutas admin siguen protegidas por `ProtectedRoute` + `RoleRoute(Admin)`. Las acciones sensibles usan mutations explicitas con invalidacion de queries y no hacen optimistic updates. Los componentes de metadata admin omiten claves sensibles completas como tokens, secretos, `storageKey`, `MarcaAguaStorageKey` y `signedUrl`, ademas de redacted de texto para URLs con queries sensibles.

## Revisión final R6

Se revisaron referencias a `storageKey`, `marcaAguaStorageKey`, `signedUrl`, tokens, secretos, passwords, `console.log`, `console.error`, `JSON.stringify` y `dangerouslySetInnerHTML`. No se renderiza HTML crudo de plantillas/notificaciones y Bitacora/DevTools usan metadata sanitizada. Los links de descarga pueden apuntar a una URL firmada devuelta por backend, pero la URL completa no se imprime en pantalla ni se guarda localmente.
