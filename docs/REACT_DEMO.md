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

## Guion de demo R6

1. Home publica: abrir `/home` y mostrar layout publico, servicios destacados y acceso a login.
2. Presupuesto: abrir `/presupuesto`, mostrar validaciones y envio seguro.
3. Login Usuario: entrar por `/login` con rol Cliente/Usuario.
4. Eventos/fotos: navegar a `/eventos`, detalle de evento, `/fotos` y detalle de foto.
5. Carrito/cupon: abrir `/carrito`, aplicar cupon valido/invalido y mostrar error seguro.
6. Pedido: crear pedido desde carrito y revisar `/pedidos`.
7. Descarga: abrir `/descargas/:id` y explicar que no se imprime la URL firmada.
8. Notificaciones: abrir `/notificaciones` y marcar leida/todas.
9. Login Admin: cerrar sesion e ingresar como Admin.
10. Admin dashboard: abrir `/admin/dashboard` y explicar `RoleRoute(Admin)`.
11. Reportes/ventas: abrir `/admin/reportes/ventas`.
12. Bitacora: abrir `/admin/bitacora` y mostrar metadata sanitizada.
13. DevTools: abrir `/admin/dev-tools` y ejecutar `Sensitive Metadata`.
14. Tests: correr `npm test` y mostrar cantidad final.
15. CI: abrir `.github/workflows/frontend-react-ci.yml`.
16. Seguridad visual: remarcar que no se muestran tokens, storage keys, secretos ni URLs firmadas completas.

## Alcance

Esta demo no reemplaza el frontend Angular. Es una base React escalable para migrar modulos de forma gradual.

## Verificacion

```bash
npm run typecheck
npm run build
npm test
npm run audit
```

R6 elimina el warning de chunk mayor a 500 kB separando Bootstrap JS y evitando configs Admin estaticas en el router raiz.

## Auth R2

Flujo sugerido:

1. Crear cuenta en `/register`.
2. Confirmar que la app redirige a `/login` si el backend no devuelve token.
3. Iniciar sesion en `/login`.
4. Validar redireccion por rol: Admin a `/admin/dashboard`, Cliente/Usuario a `/dashboard`.
5. Probar una URL protegida para verificar `returnUrl`.
6. Revisar `/perfil`, que por ahora muestra datos seguros de sesion hasta integrar un endpoint de perfil usuario estable.

## Publico R3

Rutas disponibles:

- `/portfolio` y `/portfolio/:id`
- `/servicios` y `/servicios/:id`
- `/faq`
- `/contacto`
- `/presupuesto`
- `/disponibilidad`
- `/promociones` y `/promociones/:id`
- `/testimonios`

Los formularios de presupuesto y testimonios muestran errores seguros y no guardan datos sensibles.

## Usuario R4

Rutas privadas cliente:

- `/eventos`, `/eventos/:id`
- `/fotos`, `/fotos/:id`
- `/favoritos`
- `/carrito`
- `/pedidos`, `/pedidos/:id`
- `/descargas`, `/descargas/:id`
- `/mi-historial`
- `/notificaciones`
- `/perfil`

Estas rutas requieren sesion. La gestion administrativa sigue reservada para `/admin/...`.
