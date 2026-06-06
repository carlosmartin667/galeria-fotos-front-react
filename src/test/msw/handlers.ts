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
const notasInternas = [{ id: 'nota-1', entidadTipo: 'Pedido', entidadId: 'ped-1', texto: 'Revisar entrega privada secret-token', activa: true }];
const comentarios = [{ id: 'com-1', texto: 'Me encanta esta galeria', autorNombre: 'Cliente Test' }];
const paquetesEvento = [{ id: 'paq-1', eventoId: 'ev-1', nombre: 'Pack completo', descripcion: 'Todas las fotos editadas', precio: 5000, activo: true, incluyeTodasLasFotos: true }];
const sesionesPrivadas = [{ id: 'ses-1', clienteId: 'cli-1', clienteNombre: 'Cliente Admin', titulo: 'Book privado', estado: 'Activa', fechaSesionUtc: '2026-07-20T10:00:00Z', precioPaquete: 80000 }];
const fotosPrivadas = [{ id: 'fp-1', sesionPrivadaId: 'ses-1', nombreArchivo: 'privada.jpg', precioUnitario: 2000, storageKey: 'private/photo/key', signedUrl: 'https://signed.test/private?sig=hidden' }];
const perfilPublico = { nombre: 'Fotografa Demo', descripcion: 'Fotografia documental', correoPublico: 'hola@galeria.test', token: 'hidden-token' };

function paginated<T>(items: T[], request: Request) {
  const params = new URL(request.url).searchParams;
  const page = Number(params.get('Page') ?? 1);
  const pageSize = Number(params.get('PageSize') ?? (items.length || 10));
  const all = params.get('All') === 'true';
  return { data: { items: all ? items : items.slice((page - 1) * pageSize, page * pageSize), total: items.length, page, pageSize } };
}

function controlledError(id: unknown) {
  if (id === 'unauthorized') return HttpResponse.json({ message: 'No autorizado.' }, { status: 401 });
  if (id === 'forbidden') return HttpResponse.json({ message: 'Prohibido.' }, { status: 403 });
  if (id === 'not-found') return HttpResponse.json({ message: 'No encontrado.' }, { status: 404 });
  if (id === 'conflict') return HttpResponse.json({ message: 'Conflicto.' }, { status: 409 });
  if (id === 'server-error') return HttpResponse.json({ message: 'Error controlado.', secret: 'hidden' }, { status: 500 });
  return null;
}

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
  http.get(`${getApiUrl()}/dev-tools/current-user`, () =>
    HttpResponse.json({ data: { email: 'admin@test.local', roles: ['Admin'], token: 'hidden' } }),
  ),
  http.get(`${getApiUrl()}/dev-tools/correlation-id`, () =>
    HttpResponse.json({ data: { correlationId: 'corr-test' } }, { headers: { 'x-correlation-id': 'corr-test' } }),
  ),
  http.get(`${getApiUrl()}/dev-tools/errors/bad-request`, () =>
    HttpResponse.json({ message: 'Solicitud invalida.', token: 'hidden' }, { status: 400 }),
  ),
  http.get(`${getApiUrl()}/dev-tools/errors/unauthorized`, () =>
    HttpResponse.json({ message: 'No autorizado.' }, { status: 401 }),
  ),
  http.get(`${getApiUrl()}/dev-tools/errors/not-found`, () =>
    HttpResponse.json({ message: 'No encontrado.' }, { status: 404 }),
  ),
  http.get(`${getApiUrl()}/dev-tools/errors/conflict`, () =>
    HttpResponse.json({ message: 'Conflicto.' }, { status: 409 }),
  ),
  http.get(`${getApiUrl()}/dev-tools/errors/external-dependency`, () =>
    HttpResponse.json({ message: 'Dependencia externa no disponible.' }, { status: 503 }),
  ),
  http.get(`${getApiUrl()}/dev-tools/errors/internal-controlled`, () =>
    HttpResponse.json({ message: 'Error interno controlado.', secret: 'hidden' }, { status: 500 }),
  ),
  http.get(`${getApiUrl()}/dev-tools/errors/throw`, () =>
    HttpResponse.json({ message: 'Error throw controlado.' }, { status: 500 }),
  ),
  http.post(`${getApiUrl()}/dev-tools/audit/test-entry`, () =>
    HttpResponse.json({ data: { ok: true } }),
  ),
  http.get(`${getApiUrl()}/dev-tools/rate-limit/probe`, () =>
    HttpResponse.json({ data: { ok: true } }),
  ),
  http.get(`${getApiUrl()}/dev-tools/payloads/null-data`, () =>
    HttpResponse.json({ data: null }),
  ),
  http.get(`${getApiUrl()}/dev-tools/payloads/missing-fields`, () =>
    HttpResponse.json({ data: { id: 'missing-fields' } }),
  ),
  http.get(`${getApiUrl()}/dev-tools/payloads/wrong-shape`, () =>
    HttpResponse.json({ data: { items: { unexpected: true } } }),
  ),
  http.get(`${getApiUrl()}/dev-tools/payloads/null-items`, () =>
    HttpResponse.json({ data: { items: null } }),
  ),
  http.get(`${getApiUrl()}/dev-tools/payloads/invalid-date`, () =>
    HttpResponse.json({ data: { fechaUtc: 'not-a-date' } }),
  ),
  http.get(`${getApiUrl()}/dev-tools/payloads/sensitive-metadata`, () =>
    HttpResponse.json({ data: { token: 'hidden', storageKey: 'private-key', signedUrl: 'https://signed.test/a?sig=secret', ok: true } }),
  ),
  http.get(`${getApiUrl()}/dev-tools/payloads/empty-list`, () =>
    HttpResponse.json({ data: [] }),
  ),
  http.get(`${getApiUrl()}/dev-tools/payloads/large-list`, () =>
    HttpResponse.json({ data: Array.from({ length: 3 }, (_, index) => ({ id: `item-${index}` })) }),
  ),

  http.get(`${getApiUrl()}/Sitio/home`, () =>
    HttpResponse.json({ data: { titulo: 'GaleriaFotos', subtitulo: 'Fotografia profesional', serviciosDestacados: servicios, portfolioDestacado: portfolio, promocionesDestacadas: promociones, testimoniosDestacados: testimonios } }),
  ),
  http.get(`${getApiUrl()}/Admin/perfil-publico`, () =>
    HttpResponse.json({ data: perfilPublico }),
  ),
  http.get(`${getApiUrl()}/Sitio/perfil-fotografa`, () =>
    HttpResponse.json({ data: { ...perfilPublico, titulo: 'Fotografia profesional', textoBienvenida: 'Historias reales, entrega segura.' } }),
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
  http.get(`${getApiUrl()}/Eventos/paginado`, ({ request }) => HttpResponse.json(paginated(eventos, request))),
  http.get(`${getApiUrl()}/Eventos`, () => HttpResponse.json({ data: eventos })),
  http.get(`${getApiUrl()}/Eventos/:id`, ({ params }) => HttpResponse.json({ data: eventos.find((e) => e.id === params.id) ?? null })),
  http.get(`${getApiUrl()}/Eventos/:eventoId/paquetes`, ({ params }) => {
    const error = controlledError(params.eventoId);
    return error ?? HttpResponse.json({ data: paquetesEvento.filter((paquete) => paquete.eventoId === params.eventoId) });
  }),
  http.post(`${getApiUrl()}/Eventos/:eventoId/paquetes`, async ({ params, request }) => {
    const error = controlledError(params.eventoId);
    if (error) return error;
    const body = await request.json() as { nombre?: string };
    if (!body.nombre) return HttpResponse.json({ message: 'Nombre requerido.' }, { status: 400 });
    return HttpResponse.json({ data: { id: 'paq-new', ...body, eventoId: params.eventoId } });
  }),
  http.put(`${getApiUrl()}/Eventos/paquetes/:paqueteId`, async ({ params, request }) => {
    const error = controlledError(params.paqueteId);
    if (error) return error;
    const body = await request.json() as { nombre?: string };
    return body.nombre ? HttpResponse.json({ data: { ok: true } }) : HttpResponse.json({ message: 'Nombre requerido.' }, { status: 400 });
  }),
  http.delete(`${getApiUrl()}/Eventos/paquetes/:paqueteId`, ({ params }) => controlledError(params.paqueteId) ?? HttpResponse.json({ data: { ok: true } })),
  http.get(`${getApiUrl()}/Eventos/:eventoId/comentarios`, ({ params }) => controlledError(params.eventoId) ?? HttpResponse.json({ data: comentarios })),
  http.post(`${getApiUrl()}/Eventos/:eventoId/comentarios`, async ({ params, request }) => {
    const error = controlledError(params.eventoId);
    if (error) return error;
    const body = await request.json() as { texto?: string };
    return body.texto?.trim() ? HttpResponse.json({ data: { id: 'com-new', texto: body.texto } }) : HttpResponse.json({ message: 'Comentario requerido.' }, { status: 400 });
  }),
  http.put(`${getApiUrl()}/Eventos/comentarios/:comentarioId`, async ({ params, request }) => {
    const error = controlledError(params.comentarioId);
    if (error) return error;
    const body = await request.json() as { texto?: string };
    return body.texto?.trim() ? HttpResponse.json({ data: { ok: true } }) : HttpResponse.json({ message: 'Comentario requerido.' }, { status: 400 });
  }),
  http.delete(`${getApiUrl()}/Eventos/comentarios/:comentarioId`, ({ params }) => controlledError(params.comentarioId) ?? HttpResponse.json({ data: { ok: true } })),
  http.get(`${getApiUrl()}/Fotos/evento/:eventoId`, () => HttpResponse.json({ data: fotos })),
  http.get(`${getApiUrl()}/Fotos/evento/:eventoId/paginado`, ({ request }) => HttpResponse.json(paginated(fotos, request))),
  http.get(`${getApiUrl()}/Fotos/:id`, ({ params }) => HttpResponse.json({ data: fotos.find((f) => f.id === params.id) ?? null })),
  http.get(`${getApiUrl()}/Fotos/:fotoId/comentarios`, ({ params }) => controlledError(params.fotoId) ?? HttpResponse.json({ data: comentarios })),
  http.post(`${getApiUrl()}/Fotos/:fotoId/comentarios`, async ({ params, request }) => {
    const error = controlledError(params.fotoId);
    if (error) return error;
    const body = await request.json() as { texto?: string };
    return body.texto?.trim() ? HttpResponse.json({ data: { id: 'com-foto-new', texto: body.texto } }) : HttpResponse.json({ message: 'Comentario requerido.' }, { status: 400 });
  }),
  http.put(`${getApiUrl()}/Fotos/comentarios/:comentarioId`, async ({ params, request }) => {
    const error = controlledError(params.comentarioId);
    if (error) return error;
    const body = await request.json() as { texto?: string };
    return body.texto?.trim() ? HttpResponse.json({ data: { ok: true } }) : HttpResponse.json({ message: 'Comentario requerido.' }, { status: 400 });
  }),
  http.delete(`${getApiUrl()}/Fotos/comentarios/:comentarioId`, ({ params }) => controlledError(params.comentarioId) ?? HttpResponse.json({ data: { ok: true } })),
  http.get(`${getApiUrl()}/Favoritos/eventos`, () => HttpResponse.json({ data: [{ id: 'fav-ev-1', eventoId: 'ev-1', evento: eventos[0] }] })),
  http.get(`${getApiUrl()}/Favoritos/eventos/paginado`, ({ request }) => HttpResponse.json(paginated([{ id: 'fav-ev-1', eventoId: 'ev-1', evento: eventos[0] }], request))),
  http.get(`${getApiUrl()}/Favoritos/fotos`, () => HttpResponse.json({ data: [{ id: 'fav-foto-1', fotoId: 'foto-1', foto: fotos[0] }] })),
  http.get(`${getApiUrl()}/Favoritos/fotos/paginado`, ({ request }) => HttpResponse.json(paginated([{ id: 'fav-foto-1', fotoId: 'foto-1', foto: fotos[0] }], request))),
  http.post(`${getApiUrl()}/Favoritos/fotos/:fotoId`, () => HttpResponse.json({ data: { ok: true } })),
  http.delete(`${getApiUrl()}/Favoritos/fotos/:fotoId`, () => HttpResponse.json({ data: { ok: true } })),
  http.get(`${getApiUrl()}/Carrito`, () => HttpResponse.json({ data: { items: [{ id: 'cart-1', nombre: 'Foto principal', subtotal: 1000 }], subtotal: 1000, descuento: 0, total: 1000 } })),
  http.post(`${getApiUrl()}/Carrito/items/foto-evento/:fotoId`, () => HttpResponse.json({ data: { ok: true } })),
  http.post(`${getApiUrl()}/Carrito/items/paquete-evento/:paqueteId`, ({ params }) => controlledError(params.paqueteId) ?? HttpResponse.json({ data: { ok: true } })),
  http.post(`${getApiUrl()}/Carrito/items/foto-privada/:fotoPrivadaId`, ({ params }) => controlledError(params.fotoPrivadaId) ?? HttpResponse.json({ data: { ok: true } })),
  http.post(`${getApiUrl()}/Carrito/cupon`, async ({ request }) => { const b = await request.json() as { codigo?: string }; return b.codigo === 'MALO' ? HttpResponse.json({ message: 'Cupon invalido.', token: 'hidden' }, { status: 400 }) : HttpResponse.json({ data: { ok: true } }); }),
  http.delete(`${getApiUrl()}/Carrito/cupon`, () => HttpResponse.json({ data: { ok: true } })),
  http.post(`${getApiUrl()}/Carrito/crear-pedido`, () => HttpResponse.json({ data: { id: 'ped-1' } })),
  http.post(`${getApiUrl()}/Pagos/checkout-pro/preferencias`, async ({ request }) => {
    const body = await request.json() as { pedidoId?: string };
    const error = controlledError(body.pedidoId);
    if (error) return error;
    return body.pedidoId ? HttpResponse.json({ data: { preferenceId: 'pref-1', initPoint: 'https://www.mercadopago.com.ar/checkout?token=hidden' } }) : HttpResponse.json({ message: 'Pedido requerido.' }, { status: 400 });
  }),
  http.get(`${getApiUrl()}/Pedidos`, () => HttpResponse.json({ data: pedidos })),
  http.get(`${getApiUrl()}/Pedidos/paginado`, ({ request }) => HttpResponse.json(paginated(pedidos, request))),
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
  http.get(`${getApiUrl()}/Admin/mi-perfil`, () =>
    HttpResponse.json({ data: { nombre: 'Admin Test', descripcion: 'Perfil privado admin', correoPublico: 'hola@galeria.test', token: 'hidden' } }),
  ),
  http.put(`${getApiUrl()}/Admin/mi-perfil`, async ({ request }) => {
    const body = await request.json() as { nombre?: string };
    return body.nombre ? HttpResponse.json({ data: { ok: true } }) : HttpResponse.json({ message: 'Nombre requerido.' }, { status: 400 });
  }),
  http.get(`${getApiUrl()}/Sitio/perfil-fotografa/admin`, () =>
    HttpResponse.json({ data: { ...perfilPublico, biografia: 'Bio editable admin', token: 'hidden' } }),
  ),
  http.put(`${getApiUrl()}/Sitio/perfil-fotografa`, async ({ request }) => {
    const body = await request.json() as { nombre?: string };
    return body.nombre ? HttpResponse.json({ data: { ok: true } }) : HttpResponse.json({ message: 'Nombre requerido.' }, { status: 400 });
  }),
  http.get(`${getApiUrl()}/Admin/operaciones/resumen`, () =>
    HttpResponse.json({ data: { pendientes: 3, alertas: 1, secret: 'hidden-secret' } }),
  ),
  http.get(`${getApiUrl()}/Admin/operaciones/pendientes`, () =>
    HttpResponse.json({ data: [{ id: 'op-1', titulo: 'Revisar pedido', estado: 'Pendiente' }] }),
  ),
  http.get(`${getApiUrl()}/Admin/ventas/resumen`, () =>
    HttpResponse.json({ data: { total: 9000, pedidos: 1, promedio: 9000 } }),
  ),
  http.get(`${getApiUrl()}/Reportes/ventas/resumen`, () =>
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
  http.get(`${getApiUrl()}/NotasInternas/:entidadTipo/:entidadId`, ({ params }) => controlledError(params.entidadId) ?? HttpResponse.json({ data: notasInternas.filter((nota) => nota.entidadTipo === params.entidadTipo || nota.entidadId === params.entidadId) })),
  http.post(`${getApiUrl()}/NotasInternas/:entidadTipo/:entidadId`, async ({ params, request }) => {
    const error = controlledError(params.entidadId);
    if (error) return error;
    const body = await request.json() as { texto?: string };
    return body.texto?.trim() ? HttpResponse.json({ data: { id: 'nota-new', texto: body.texto } }) : HttpResponse.json({ message: 'Texto requerido.' }, { status: 400 });
  }),
  http.put(`${getApiUrl()}/NotasInternas/:id`, async ({ params, request }) => {
    const error = controlledError(params.id);
    if (error) return error;
    const body = await request.json() as { texto?: string };
    return body.texto?.trim() ? HttpResponse.json({ data: { ok: true } }) : HttpResponse.json({ message: 'Texto requerido.' }, { status: 400 });
  }),
  http.delete(`${getApiUrl()}/NotasInternas/:id`, ({ params }) => controlledError(params.id) ?? HttpResponse.json({ data: { ok: true } })),
  http.get(`${getApiUrl()}/SesionesPrivadas`, () =>
    HttpResponse.json({ data: sesionesPrivadas }),
  ),
  http.post(`${getApiUrl()}/SesionesPrivadas`, async ({ request }) => {
    const body = await request.json() as { clienteId?: string; titulo?: string; fechaSesionUtc?: string };
    return body.clienteId && body.titulo && body.fechaSesionUtc ? HttpResponse.json({ data: { id: 'ses-new', ...body } }) : HttpResponse.json({ message: 'Datos invalidos.' }, { status: 400 });
  }),
  http.get(`${getApiUrl()}/SesionesPrivadas/:id`, ({ params }) => controlledError(params.id) ?? HttpResponse.json({ data: sesionesPrivadas.find((sesion) => sesion.id === params.id) ?? null })),
  http.put(`${getApiUrl()}/SesionesPrivadas/:id`, ({ params }) => controlledError(params.id) ?? HttpResponse.json({ data: { ok: true } })),
  http.delete(`${getApiUrl()}/SesionesPrivadas/:id`, ({ params }) => controlledError(params.id) ?? HttpResponse.json({ data: { ok: true } })),
  http.put(`${getApiUrl()}/SesionesPrivadas/:id/estado`, async ({ params, request }) => {
    const error = controlledError(params.id);
    if (error) return error;
    const body = await request.json() as { estado?: string };
    return body.estado ? HttpResponse.json({ data: { ok: true } }) : HttpResponse.json({ message: 'Estado requerido.' }, { status: 400 });
  }),
  http.get(`${getApiUrl()}/SesionesPrivadas/:id/fotos`, ({ params }) => controlledError(params.id) ?? HttpResponse.json({ data: fotosPrivadas })),
  http.post(`${getApiUrl()}/SesionesPrivadas/:id/fotos/storage-key`, async ({ params, request }) => {
    const error = controlledError(params.id);
    if (error) return error;
    const body = await request.json() as { nombreArchivo?: string };
    return body.nombreArchivo ? HttpResponse.json({ data: { storageKey: 'private/photo/key' } }) : HttpResponse.json({ message: 'Archivo requerido.' }, { status: 400 });
  }),
  http.post(`${getApiUrl()}/SesionesPrivadas/:id/fotos/metadata`, async ({ params, request }) => {
    const error = controlledError(params.id);
    if (error) return error;
    const body = await request.json() as { nombreArchivo?: string; contentType?: string; storageKey?: string };
    return body.nombreArchivo && body.contentType && body.storageKey ? HttpResponse.json({ data: { id: 'fp-new' } }) : HttpResponse.json({ message: 'Metadata invalida.' }, { status: 400 });
  }),
  http.put(`${getApiUrl()}/SesionesPrivadas/fotos/:fotoPrivadaId`, ({ params }) => controlledError(params.fotoPrivadaId) ?? HttpResponse.json({ data: { ok: true } })),
  http.delete(`${getApiUrl()}/SesionesPrivadas/fotos/:fotoPrivadaId`, ({ params }) => controlledError(params.fotoPrivadaId) ?? HttpResponse.json({ data: { ok: true } })),

  http.get(`${getApiUrl()}/Portfolio/admin`, () => HttpResponse.json({ data: portfolio })),
  http.get(`${getApiUrl()}/Servicios/admin`, () => HttpResponse.json({ data: servicios })),
  http.get(`${getApiUrl()}/Faq/admin`, () =>
    HttpResponse.json({ data: [{ id: 'faq-admin-1', pregunta: 'Entrega', respuesta: '30 dias', activo: true }] }),
  ),
  http.get(`${getApiUrl()}/Promociones/admin`, () => HttpResponse.json({ data: promociones })),
  http.post(`${getApiUrl()}/Promociones/:id/activar`, () => HttpResponse.json({ data: { ok: true } })),
  http.post(`${getApiUrl()}/Promociones/:id/desactivar`, () => HttpResponse.json({ data: { ok: true } })),
  http.get(`${getApiUrl()}/Testimonios/admin`, () => HttpResponse.json({ data: testimonios })),
  http.post(`${getApiUrl()}/Testimonios/:id/publicar`, () => HttpResponse.json({ data: { ok: true } })),
  http.post(`${getApiUrl()}/Testimonios/:id/ocultar`, () => HttpResponse.json({ data: { ok: true } })),

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
  http.post(`${getApiUrl()}/Cupones/:id/activar`, () => HttpResponse.json({ data: { ok: true } })),
  http.post(`${getApiUrl()}/Cupones/:id/desactivar`, () => HttpResponse.json({ data: { ok: true } })),
  http.get(`${getApiUrl()}/Carritos/abandonados`, () => HttpResponse.json({ data: carritosAdmin })),
  http.get(`${getApiUrl()}/Carritos/abandonados/resumen`, () => HttpResponse.json({ data: { cantidad: 1, total: 1000 } })),
  http.post(`${getApiUrl()}/Carritos/abandonados/detectar`, () => HttpResponse.json({ data: { ok: true } })),
  http.post(`${getApiUrl()}/Carritos/abandonados/:id/notificar`, () => HttpResponse.json({ data: { ok: true } })),

  http.post(`${getApiUrl()}/Fotos/metadata/bulk`, () => HttpResponse.json({ data: { procesadas: 1 } })),
  http.post(`${getApiUrl()}/Fotos/storage-key`, () => HttpResponse.json({ data: { storageKey: 'private-key' } })),
  http.post(`${getApiUrl()}/Fotos/storage-keys/bulk`, () => HttpResponse.json({ data: { creadas: 1, storageKey: 'private-key' } })),
  http.put(`${getApiUrl()}/Fotos/:id`, () => HttpResponse.json({ data: { ok: true } })),
  http.post(`${getApiUrl()}/Admin/demo/pexels/importar-fotos`, () => HttpResponse.json({ data: { importadas: 3 } })),

  http.get(`${getApiUrl()}/dev-tools/ping`, () =>
    HttpResponse.json({
      ok: true,
      source: 'msw',
    }),
  ),
];
