# Testing React

La base usa Vitest con Testing Library y `jsdom`.

## Comandos

```bash
npm test
npm run build
```

## Cobertura inicial

- Normalizacion segura de errores API.
- Sanitizacion de texto y objetos sensibles.
- Login/logout del `AuthProvider`.
- Bloqueo de `ProtectedRoute` sin sesion.
- Bloqueo de `RoleRoute` para usuario no admin.
- Render basico de botones en DevTools.

## Criterio

Los tests iniciales cubren la infraestructura critica. Las proximas features deben sumar tests por comportamiento visible, especialmente formularios, autorizacion y llamadas a backend.
