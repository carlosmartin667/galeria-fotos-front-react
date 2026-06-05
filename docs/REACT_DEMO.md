# Demo React

## Requisitos

- Backend .NET corriendo en `http://localhost:5200/api`.
- Node.js compatible con Vite.

## Ejecutar

```bash
npm install
npm run dev
```

Abrir la URL indicada por Vite.

## Flujo sugerido

1. Entrar a `/home` para validar layout publico.
2. Entrar a `/login` y autenticar contra `/api/Auth/login`.
3. Si el usuario tiene rol `Admin`, redirige a `/admin/dashboard`.
4. Si el usuario tiene rol `Usuario` o `Cliente`, redirige a `/dashboard`.
5. En Admin revisar `/admin/bitacora` y `/admin/dev-tools`.

## Alcance

Esta demo no reemplaza el frontend Angular. Es una base React escalable para migrar modulos de forma gradual.
