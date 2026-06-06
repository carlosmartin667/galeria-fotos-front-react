import { http, HttpResponse } from 'msw';
import { getApiUrl } from '@/config/env';

function base64Url(value: unknown) {
  return btoa(JSON.stringify(value)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function createFakeJwt(payload: Record<string, unknown> = {}) {
  const now = Math.floor(Date.now() / 1000);
  return [
    base64Url({ alg: 'none', typ: 'JWT' }),
    base64Url({
      sub: 'test-user-id',
      email: 'cliente@test.local',
      role: 'Cliente',
      exp: now + 3600,
      ...payload,
    }),
    'test-signature',
  ].join('.');
}

const servicios = [
  { id: 'serv-1', nombre: 'Eventos sociales', descripcion: 'Cobertura completa de eventos.', precioDesde: 120000, destacado: true },
  { id: 'serv-2', nombre: 'Sesiones privadas', descripcion: 'Retratos y books personalizados.', precioDesde: 80000 },
];

const portfolio = [
  { id: 'port-1', titulo: 'Boda en salon', descripcion: 'Cobertura emocional.', categoria: 'Bodas', destacado: true },
  { id: 'port-2', titulo: 'Sesion urbana', descripcion: 'Retratos modernos.', categoria: 'Retratos' },
];

const promociones = [
  { id: 'promo-1', titulo: 'Promo temporada', descripcion: 'Descuento para reservas anticipadas.', tipo: 'Descuento', destacada: true },
];

const testimonios = [
  { id: 'test-1', nombreCliente: 'Ana Perez', emailCliente: 'ana@test.local', texto: 'Excelente experiencia y entrega impecable.', calificacion: 5, destacado: true },
];
const eventos = [{ id: 'ev-1', nombre: 'Evento escolar', descripcion: 'Galeria del evento', fechaEventoUtc: '2026-07-10', estado: 'Publicado' }];
const fotos = [{ id: 'foto-1', eventoId: 'ev-1', titulo: 'Foto principal', nombreArchivo: 'foto.jpg', previewUrl: '/safe-preview.jpg', precioUnitario: 1000, storageKey: 'private-key' }];
const pedidos = [{ id: 'ped-1', numero: 'P-001', estado: 'Pendiente', subtotal: 1000, descuento: 100, total: 900, cuponCodigo: 'DTO10', items: [{ id: 'pi-1', nombre: 'Foto principal', subtotal: 900 }] }];
const descargas = [{ id: 'des-1', nombreArchivo: 'foto.jpg', estado: 'Disponible', signedUrl: 'https://signed.test/download?sig=secret' }];
const notificaciones = [{ id: 'not-1', titulo: 'Pedido actualizado', mensaje: 'Tu pedido cambio de estado.', leida: false }];
const clientesAdmin = [{ id: 'cli-1', nombre: 'Cliente Admin', email: 'cliente@test.local', estado: 'Activo' }];
const presupuestosAdmin = [{ id: 'pres-1', nombre: 'Ana Perez', email: 'ana@test.local', estado: 'Pendiente', token: 'secret-token' }];
const agendaAdmin = [{ id: 'age-1', titulo: 'Sesion urbana', tipo: 'Sesion', fechaInicioUtc: '2026-07-12T10:00:00Z', fechaFinUtc: '2026-07-12T11:00:00Z', estado: 'Confirmado' }];
const cuponesAdmin = [{ id: 'cup-1', codigo: 'DTO10', tipoDescuento: 'Porcentaje', valorDescuento: 10, activo: true }];
const plantillasAdmin = [{ id: 'tpl-1', nombre: 'Pedido confirmado', asunto: 'Pedido', cuerpoHtml: '<script>hidden</script><b>Hola</b>', activo: true }];
const carritosAdmin = [{ id: 'cart-ab-1', email: 'cliente@test.local', estado: 'Abandonado', total: 1000 }];

export const handlers = [
  http.post(`${getApiUrl()}/Auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email?: string };

    if (body.email === 'admin@test.local') {
      return HttpResponse.json({
        data: {
          token: createFakeJwt({ email: body.email, role: 'Admin', name: 'Admin Test' }),
          email: body.email,
          roles: ['Admin'],
          nombre: 'Admin Test',
        },
      });
    }

    if (body.email === 'cliente@test.local') {
      return HttpResponse.json({
        data: {
          token: createFakeJwt({ email: body.email, role: 'Cliente', name: 'Cliente Test' }),
          email: body.email,
          roles: ['Cliente'],
          nombre: 'Cliente Test',
        },
      });
    }

    return HttpResponse.json(
      {
        message: 'Credenciales invalidas.',
        token: 'secret-token-that-must-not-leak',
      },
      { status: 401, headers: { 'x-correlation-id': 'auth-invalid' } },
    );
  }),

  http.post(`${getApiUrl()}/Auth/register`, async ({ request }) => {
    const body = (await request.json()) as { nombre?: string; email?: string; password?: string };

    if (!body.nombre || body.email === 'existe@test.local') {
      return HttpResponse.json(
        {
          message: 'No pudimos crear la cuenta.',
          password: 'hidden-password',
        },
        { status: 400, headers: { 'x-correlation-id': 'register-invalid' } },
      );
    }

    return HttpResponse.json({
      data: {
        email: body.email,
        nombre: body.nombre,
      },
    });
  }),

  http.get(`${getApiUrl()}/dev-tools/errors/forbidden`, () =>
    HttpResponse.json({ message: 'Acceso denegado.' }, { status: 403 }),
  ),

  http.get(`${getApiUrl()}/Sitio/home`, () =>
    HttpResponse.json({ data: { titulo: 'GaleriaFotos', subtitulo: 'Fotografia profesional', serviciosDestacados: servicios, portfolioDestacado: portfolio, promocionesDestacadas: promociones, testimoniosDestacados: testimonios } }),
  ),
  http.get(`${getApiUrl()}/Sitio/contacto`, () =>
    HttpResponse.json({ data: { email: 'hola@galeria.test', telefono: '+54 11 0000-0000', instagram: '@galeriafotos' } }),
  ),
  http.get(`${getApiUrl()}/Portfolio`, () => HttpResponse.json({ data: portfolio })),
  http.get(`${getApiUrl()}/Portfolio/:id`, ({ params }) => HttpResponse.json({ data: portfolio.find((item) => item.id === params.id) ?? null })),
  http.get(`${getApiUrl()}/Servicios`, () => HttpResponse.json({ data: servicios })),
  http.get(`${getApiUrl()}/Servicios/:id`, ({ params }) => HttpResponse.json({ data: servicios.find((item) => item.id === params.id) ?? null })),
  http.get(`${getApiUrl()}/Faq`, () => HttpResponse.json({ data: [
    { id: 'faq-1', pregunta: 'Como contrato?', respuesta: 'Solicita un presupuesto.', categoria: 'Contratacion' },
    { id: 'faq-2', pregunta: 'Cuando entregan?', respuesta: 'La entrega depende del servicio.', categoria: 'Entrega' },
  ] })),
  http.post(`${getApiUrl()}/Presupuestos/solicitudes`, async ({ request }) => {
    const body = (await request.json()) as { email?: string };
    if (body.email === 'error@test.local') {
      return HttpResponse.json({ message: 'Solicitud invalida.', token: 'hidden' }, { status: 400 });
    }
    return HttpResponse.json({ data: { id: 'pres-1' } });
  }),
  http.get(`${getApiUrl()}/Agenda/disponibilidad`, () => HttpResponse.json({ data: [{ fecha: '2026-07-10', disponible: false }] })),
  http.get(`${getApiUrl()}/Promociones`, () => HttpResponse.json({ data: promociones })),
  http.get(`${getApiUrl()}/Promociones/:id`, ({ params }) => HttpResponse.json({ data: promociones.find((item) => item.id === params.id) ?? null })),
  http.get(`${getApiUrl()}/Testimonios`, () => HttpResponse.json({ data: testimonios })),
  http.get(`${getApiUrl()}/Testimonios/destacados`, () => HttpResponse.json({ data: testimonios })),
  http.post(`${getApiUrl()}/Testimonios`, () => HttpResponse.json({ data: { id: 'test-new' } })),
  http.get(`${getApiUrl()}/Eventos`, () => HttpResponse.json({ data: eventos })),
  http.get(`${getApiUrl()}/Eventos/:id`, ({ params }) => HttpResponse.json({ data: eventos.find((e) => e.id === params.id) ?? null })),
  http.get(`${getApiUrl()}/Fotos`, () => HttpResponse.json({ data: fotos })),
  http.get(`${getApiUrl()}/Fotos/evento/:eventoId`, () => HttpResponse.json({ data: fotos })),
  http.get(`${getApiUrl()}/Fotos/:id`, ({ params }) => HttpResponse.json({ data: fotos.find((f) => f.id === params.id) ?? null })),
  http.get(`${getApiUrl()}/Favoritos/eventos`, () => HttpResponse.json({ data: [{ id: 'fav-ev-1', eventoId: 'ev-1', evento: eventos[0] }] })),
  http.get(`${getApiUrl()}/Favoritos/fotos`, () => HttpResponse.json({ data: [{ id: 'fav-foto-1', fotoId: 'foto-1', foto: fotos[0] }] })),
  http.post(`${getApiUrl()}/Favoritos/fotos/:fotoId`, () => HttpResponse.json({ data: { ok: true } })),
  http.delete(`${getApiUrl()}/Favoritos/fotos/:fotoId`, () => HttpResponse.json({ data: { ok: true } })),
  http.get(`${getApiUrl()}/Carrito`, () => HttpResponse.json({ data: { items: [{ id: 'cart-1', nombre: 'Foto principal', subtotal: 1000 }], subtotal: 1000, descuento: 0, total: 1000 } })),
  http.post(`${getApiUrl()}/Carrito/items/foto-evento/:fotoId`, () => HttpResponse.json({ data: { ok: true } })),
  http.post(`${getApiUrl()}/Carrito/cupon`, async ({ request }) => { const b = await request.json() as { codigo?: string }; return b.codigo === 'MALO' ? HttpResponse.json({ message: 'Cupon invalido.', token: 'hidden' }, { status: 400 }) : HttpResponse.json({ data: { ok: true } }); }),
  http.delete(`${getApiUrl()}/Carrito/cupon`, () => HttpResponse.json({ data: { ok: true } })),
  http.post(`${getApiUrl()}/Carrito/crear-pedido`, () => HttpResponse.json({ data: { id: 'ped-1' } })),
  http.get(`${getApiUrl()}/Pedidos`, () => HttpResponse.json({ data: pedidos })),
  http.get(`${getApiUrl()}/Pedidos/:id`, ({ params }) => HttpResponse.json({ data: pedidos.find((p) => p.id === params.id) ?? null })),
  http.get(`${getApiUrl()}/Descargas/mis-descargas`, () => HttpResponse.json({ data: descargas })),
  http.get(`${getApiUrl()}/Descargas/:id`, ({ params }) => HttpResponse.json({ data: descargas.find((d) => d.id === params.id) ?? null })),
  http.post(`${getApiUrl()}/Descargas/:id/regenerar`, () => HttpResponse.json({ data: { ok: true } })),
  http.get(`${getApiUrl()}/Clientes/mi-historial`, () => HttpResponse.json({ data: [{ id: 'h-1', tipo: 'Pedido', titulo: 'Pedido creado', descripcion: 'Pedido P-001', storageKey: 'hidden-key', notasInternas: 'admin only' }] })),
  http.get(`${getApiUrl()}/Notificaciones/mis-notificaciones`, () => HttpResponse.json({ data: notificaciones })),
  http.patch(`${getApiUrl()}/Notificaciones/:id/leer`, () => HttpResponse.json({ data: { ok: true } })),
  http.patch(`${getApiUrl()}/Notificaciones/marcar-todas-leidas`, () => HttpResponse.json({ data: { ok: true } })),

  http.get(`${getApiUrl()}/Admin/dashboard`, () =>
    HttpResponse.json({ data: { ventasHoy: 12000, pedidosPendientes: 2, token: 'hidden' } }),
  ),
  http.get(`${getApiUrl()}/Admin/operaciones/resumen`, () =>
    HttpResponse.json({ data: { pendientes: 3, alertas: 1, secret: 'hidden-secret' } }),
  ),
  http.get(`${getApiUrl()}/Admin/operaciones/pendientes`, () =>
    HttpResponse.json({ data: [{ id: 'op-1', titulo: 'Revisar pedido', estado: 'Pendiente' }] }),
  ),
  http.get(`${getApiUrl()}/Ventas/resumen`, () =>
    HttpResponse.json({ data: { total: 9000, pedidos: 1, promedio: 9000 } }),
  ),
  http.get(`${getApiUrl()}/Reportes/ventas`, () =>
    HttpResponse.json({ data: { totalVentas: 9000, cantidadPedidos: 1, desde: '2026-07-01', hasta: '2026-07-31' } }),
  ),

  http.get(`${getApiUrl()}/Clientes`, () => HttpResponse.json({ data: clientesAdmin })),
  http.get(`${getApiUrl()}/Clientes/:id`, ({ params }) =>
    HttpResponse.json({ data: clientesAdmin.find((c) => c.id === params.id) ?? clientesAdmin[0] }),
  ),
  http.get(`${getApiUrl()}/Clientes/:id/historial`, () =>
    HttpResponse.json({ data: [{ id: 'hist-admin-1', titulo: 'Pedido creado', estado: 'Registrado', storageKey: 'private/storage/key' }] }),
  ),

  http.get(`${getApiUrl()}/Descargas/admin`, () => HttpResponse.json({ data: descargas })),
  http.get(`${getApiUrl()}/Pedidos/:id/historial-estados`, () =>
    HttpResponse.json({ data: [{ id: 'hp-1', estado: 'Pendiente' }, { id: 'hp-2', estado: 'Completado' }] }),
  ),
  http.put(`${getApiUrl()}/Pedidos/:id/estado`, () => HttpResponse.json({ data: { ok: true } })),

  http.get(`${getApiUrl()}/Presupuestos/solicitudes/:id`, ({ params }) =>
    HttpResponse.json({ data: presupuestosAdmin.find((p) => p.id === params.id) ?? presupuestosAdmin[0] }),
  ),
  http.get(`${getApiUrl()}/Presupuestos/solicitudes`, () => HttpResponse.json({ data: presupuestosAdmin })),
  http.put(`${getApiUrl()}/Presupuestos/solicitudes/:id/estado`, () => HttpResponse.json({ data: { ok: true } })),

  http.get(`${getApiUrl()}/Agenda`, () => HttpResponse.json({ data: agendaAdmin })),
  http.post(`${getApiUrl()}/Agenda`, () => HttpResponse.json({ data: { id: 'age-new' } })),
  http.put(`${getApiUrl()}/Agenda/:id`, () => HttpResponse.json({ data: { ok: true } })),
  http.delete(`${getApiUrl()}/Agenda/:id`, () => HttpResponse.json({ data: { ok: true } })),
  http.get(`${getApiUrl()}/SesionesPrivadas`, () =>
    HttpResponse.json({ data: [{ id: 'ses-1', titulo: 'Book privado', estado: 'Activa' }] }),
  ),

  http.get(`${getApiUrl()}/Portfolio/admin`, () => HttpResponse.json({ data: portfolio })),
  http.get(`${getApiUrl()}/Servicios/admin`, () => HttpResponse.json({ data: servicios })),
  http.get(`${getApiUrl()}/Faq/admin`, () =>
    HttpResponse.json({ data: [{ id: 'faq-admin-1', pregunta: 'Entrega', respuesta: '30 dias', activo: true }] }),
  ),
  http.get(`${getApiUrl()}/Promociones/admin`, () => HttpResponse.json({ data: promociones })),
  http.patch(`${getApiUrl()}/Promociones/:id/activar`, () => HttpResponse.json({ data: { ok: true } })),
  http.get(`${getApiUrl()}/Testimonios/admin`, () => HttpResponse.json({ data: testimonios })),
  http.patch(`${getApiUrl()}/Testimonios/:id/publicar`, () => HttpResponse.json({ data: { ok: true } })),
  http.patch(`${getApiUrl()}/Testimonios/:id/ocultar`, () => HttpResponse.json({ data: { ok: true } })),

  http.get(`${getApiUrl()}/Notificaciones/admin/:id`, ({ params }) =>
    HttpResponse.json({ data: notificaciones.find((n) => n.id === params.id) ?? notificaciones[0] }),
  ),
  http.get(`${getApiUrl()}/Notificaciones/admin`, () => HttpResponse.json({ data: notificaciones })),
  http.post(`${getApiUrl()}/Notificaciones/admin/:id/reenviar`, () => HttpResponse.json({ data: { ok: true } })),
  http.patch(`${getApiUrl()}/Notificaciones/admin/:id/cancelar`, () => HttpResponse.json({ data: { ok: true } })),
  http.get(`${getApiUrl()}/Notificaciones/plantillas`, () => HttpResponse.json({ data: plantillasAdmin })),
  http.put(`${getApiUrl()}/Notificaciones/plantillas/:id`, () => HttpResponse.json({ data: { ok: true } })),
  http.patch(`${getApiUrl()}/Notificaciones/plantillas/:id/activar`, () => HttpResponse.json({ data: { ok: true } })),

  http.get(`${getApiUrl()}/Cupones/admin`, () => HttpResponse.json({ data: cuponesAdmin })),
  http.post(`${getApiUrl()}/Cupones`, () => HttpResponse.json({ data: { id: 'cup-new' } })),
  http.put(`${getApiUrl()}/Cupones/:id`, () => HttpResponse.json({ data: { ok: true } })),
  http.patch(`${getApiUrl()}/Cupones/:id/activar`, () => HttpResponse.json({ data: { ok: true } })),
  http.patch(`${getApiUrl()}/Cupones/:id/desactivar`, () => HttpResponse.json({ data: { ok: true } })),
  http.get(`${getApiUrl()}/Carritos/abandonados`, () => HttpResponse.json({ data: carritosAdmin })),
  http.get(`${getApiUrl()}/Carritos/abandonados/resumen`, () => HttpResponse.json({ data: { cantidad: 1, total: 1000 } })),
  http.post(`${getApiUrl()}/Carritos/abandonados/detectar`, () => HttpResponse.json({ data: { ok: true } })),
  http.post(`${getApiUrl()}/Carritos/abandonados/:id/notificar`, () => HttpResponse.json({ data: { ok: true } })),

  http.post(`${getApiUrl()}/Fotos/metadata/bulk`, () => HttpResponse.json({ data: { procesadas: 1 } })),
  http.post(`${getApiUrl()}/Fotos/storage-keys/bulk`, () => HttpResponse.json({ data: { creadas: 1, storageKey: 'private-key' } })),
  http.put(`${getApiUrl()}/Fotos/:id/metadata`, () => HttpResponse.json({ data: { ok: true } })),
  http.post(`${getApiUrl()}/Admin/demo/pexels/importar-fotos`, () => HttpResponse.json({ data: { importadas: 3 } })),

  http.get(`${getApiUrl()}/dev-tools/ping`, () =>
    HttpResponse.json({
      ok: true,
      source: 'msw',
    }),
  ),
];
