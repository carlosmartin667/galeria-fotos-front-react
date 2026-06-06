import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '@/app/providers/AuthProvider';
import { AppRouter } from '@/app/router/AppRouter';
import { getApiUrl } from '@/config/env';
import { routes } from '@/config/routes';
import { getMiPerfilAdmin } from '@/services/admin/adminPerfilApi';
import { createNotaInternaAdmin, deleteNotaInternaAdmin, getNotasInternasAdmin, updateNotaInternaAdmin } from '@/services/admin/notasInternasApi';
import { cambiarEstadoSesionPrivadaAdmin, createFotoPrivadaMetadataAdmin, createStorageKeyFotoPrivadaAdmin } from '@/services/admin/sesionesPrivadasAdminApi';
import { authService } from '@/services/auth/authService';
import { getFavoritosEventosPaginado, getFavoritosFotosPaginado } from '@/services/favoritos/favoritosApi';
import { getEventosPaginado } from '@/services/eventos/eventosApi';
import { getFotosEventoPaginado } from '@/services/fotos/fotosApi';
import { crearPreferenciaCheckoutPro } from '@/services/pagos/pagosApi';
import { getPedidosPaginado } from '@/services/pedidos/pedidosApi';
import { getPerfilFotografaAdmin, getPerfilFotografaPublico, getPerfilPublicoAdmin, updatePerfilFotografaAdmin } from '@/services/sitio/sitioApi';
import { server } from '@/test/msw/server';

function renderAt(path: string, auth: 'admin' | 'user' | 'public' = 'user') {
  cleanup();
  vi.spyOn(authService, 'getSession').mockReturnValue(auth === 'public' ? null : {
    token: `test-${auth}-token`,
    user: { email: auth === 'admin' ? 'admin@test.local' : 'cliente@test.local', roles: [auth === 'admin' ? 'Admin' : 'Cliente'] },
  });
  window.history.pushState({}, 'test', path);
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  render(<QueryClientProvider client={queryClient}><AuthProvider><AppRouter /></AuthProvider></QueryClientProvider>);
}

describe('R6.5B OpenAPI functional alignment', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('NotasInternasPanel solo se renderiza en Admin y permite crear/editar/eliminar sin exponer secretos', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    renderAt('/admin/pedidos/ped-1', 'admin');

    expect(await screen.findByText('Notas internas')).toBeInTheDocument();
    expect(await screen.findByText(/Revisar entrega privada/)).toBeInTheDocument();
    expect(screen.queryByText(/secret-token/i)).not.toBeInTheDocument();

    await userEvent.type(screen.getByLabelText('Nueva nota'), 'Nueva nota segura');
    await userEvent.click(screen.getByRole('button', { name: 'Agregar nota' }));
    await userEvent.click(screen.getAllByRole('button', { name: 'Editar' })[0]);
    await userEvent.clear(screen.getByLabelText('Editar nota'));
    await userEvent.type(screen.getByLabelText('Editar nota'), 'Nota actualizada');
    await userEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }));
    await userEvent.click(screen.getAllByRole('button', { name: 'Eliminar' })[0]);

    renderAt(routes.user.historial, 'user');
    expect(await screen.findByText('Pedido creado')).toBeInTheDocument();
    expect(screen.queryByText('Notas internas')).not.toBeInTheDocument();
    expect(screen.queryByText(/admin only/i)).not.toBeInTheDocument();
  });

  it('notasInternasApi usa los endpoints reales', async () => {
    const calls: string[] = [];
    server.use(
      http.get(`${getApiUrl()}/NotasInternas/:entidadTipo/:entidadId`, ({ params }) => {
        calls.push(`GET /api/NotasInternas/${params.entidadTipo}/${params.entidadId}`);
        return HttpResponse.json({ data: [] });
      }),
      http.post(`${getApiUrl()}/NotasInternas/:entidadTipo/:entidadId`, ({ params }) => {
        calls.push(`POST /api/NotasInternas/${params.entidadTipo}/${params.entidadId}`);
        return HttpResponse.json({ data: { id: 'nota-new' } });
      }),
      http.put(`${getApiUrl()}/NotasInternas/:id`, ({ params }) => {
        calls.push(`PUT /api/NotasInternas/${params.id}`);
        return HttpResponse.json({ data: { ok: true } });
      }),
      http.delete(`${getApiUrl()}/NotasInternas/:id`, ({ params }) => {
        calls.push(`DELETE /api/NotasInternas/${params.id}`);
        return HttpResponse.json({ data: { ok: true } });
      }),
    );

    await getNotasInternasAdmin('Pedido', 'ped-1');
    await createNotaInternaAdmin('Pedido', 'ped-1', { texto: 'ok' });
    await updateNotaInternaAdmin('nota-1', { texto: 'ok', activa: true });
    await deleteNotaInternaAdmin('nota-1');

    expect(calls).toEqual([
      'GET /api/NotasInternas/Pedido/ped-1',
      'POST /api/NotasInternas/Pedido/ped-1',
      'PUT /api/NotasInternas/nota-1',
      'DELETE /api/NotasInternas/nota-1',
    ]);
  });

  it('checkout crea preferencia y no muestra token ni URL de pago', async () => {
    renderAt(routes.user.pedidoDetail('ped-1'), 'user');

    await userEvent.click(await screen.findByRole('button', { name: 'Pagar con Mercado Pago' }));

    expect(await screen.findByRole('button', { name: 'Continuar al pago' })).toBeInTheDocument();
    expect(screen.queryByText(/mercadopago/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/token=hidden/i)).not.toBeInTheDocument();

    const preferencia = await crearPreferenciaCheckoutPro({ pedidoId: 'ped-1' });
    expect(JSON.stringify(preferencia)).not.toContain('token=hidden');
  });

  it('comentarios validan texto y se listan en evento y foto', async () => {
    renderAt(routes.user.eventoDetail('ev-1'), 'user');

    expect(await screen.findByText('Pack completo')).toBeInTheDocument();
    expect(await screen.findByText('Me encanta esta galeria')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Comentar' }));
    expect(await screen.findByText('El comentario no puede estar vacio.')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Agregar al carrito' }));

    renderAt(routes.user.fotoDetail('foto-1'), 'user');
    expect(await screen.findByText('Me encanta esta galeria')).toBeInTheDocument();
  });

  it('paginados usan Page PageSize y All en endpoints reales', async () => {
    const calls: string[] = [];
    const capture = (label: string, request: Request) => calls.push(`${label} ${new URL(request.url).search}`);
    server.use(
      http.get(`${getApiUrl()}/Eventos/paginado`, ({ request }) => { capture('eventos', request); return HttpResponse.json({ data: { items: [], total: 0 } }); }),
      http.get(`${getApiUrl()}/Fotos/evento/:eventoId/paginado`, ({ request }) => { capture('fotos', request); return HttpResponse.json({ data: { items: [], total: 0 } }); }),
      http.get(`${getApiUrl()}/Favoritos/eventos/paginado`, ({ request }) => { capture('fav-eventos', request); return HttpResponse.json({ data: { items: [], total: 0 } }); }),
      http.get(`${getApiUrl()}/Favoritos/fotos/paginado`, ({ request }) => { capture('fav-fotos', request); return HttpResponse.json({ data: { items: [], total: 0 } }); }),
      http.get(`${getApiUrl()}/Pedidos/paginado`, ({ request }) => { capture('pedidos', request); return HttpResponse.json({ data: { items: [], total: 0 } }); }),
    );
    const filters = { page: 2, pageSize: 5, all: true };

    await getEventosPaginado(filters);
    await getFotosEventoPaginado('ev-1', filters);
    await getFavoritosEventosPaginado(filters);
    await getFavoritosFotosPaginado(filters);
    await getPedidosPaginado(filters);

    expect(calls).toHaveLength(5);
    for (const call of calls) {
      expect(call).toContain('Page=2');
      expect(call).toContain('PageSize=5');
      expect(call).toContain('All=true');
    }
  });

  it('sesiones privadas cambian estado y fotos privadas no exponen storage', async () => {
    let estadoBody: unknown;
    server.use(
      http.put(`${getApiUrl()}/SesionesPrivadas/:id/estado`, async ({ request }) => {
        estadoBody = await request.json();
        return HttpResponse.json({ data: { ok: true } });
      }),
    );

    await cambiarEstadoSesionPrivadaAdmin('ses-1', 'Entregada', 'ok');
    await createStorageKeyFotoPrivadaAdmin('ses-1', { nombreArchivo: 'privada.jpg' });
    await createFotoPrivadaMetadataAdmin('ses-1', { nombreArchivo: 'privada.jpg', contentType: 'image/jpeg', storageKey: 'private-key' });

    expect(estadoBody).toMatchObject({ estado: 'Entregada', comentario: 'ok' });

    renderAt('/admin/sesiones-privadas/ses-1', 'admin');
    expect(await screen.findByText('Book privado')).toBeInTheDocument();
    expect(await screen.findByText('privada.jpg')).toBeInTheDocument();
    expect(screen.queryByText(/private\/photo\/key/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/sig=hidden/i)).not.toBeInTheDocument();
  });

  it('perfil publico no muestra datos privados y mi perfil admin valida formulario', async () => {
    const perfilPublico = await getPerfilPublicoAdmin();
    const perfilFotografa = await getPerfilFotografaPublico();
    const perfilFotografaAdmin = await getPerfilFotografaAdmin();
    await updatePerfilFotografaAdmin({ nombre: 'Fotografa Demo' });
    expect(JSON.stringify(perfilPublico)).not.toContain('hidden-token');
    expect(JSON.stringify(perfilFotografa)).not.toContain('hidden-token');
    expect(JSON.stringify(perfilFotografaAdmin)).not.toContain('hidden');

    renderAt('/admin/mi-perfil', 'admin');
    await screen.findByDisplayValue('Admin Test');
    await userEvent.clear(screen.getByLabelText('Nombre'));
    await userEvent.click(screen.getByRole('button', { name: 'Guardar perfil' }));

    expect(await screen.findByText('El nombre es obligatorio.')).toBeInTheDocument();
    expect(screen.queryByText(/hidden/i)).not.toBeInTheDocument();

    const miPerfil = await getMiPerfilAdmin();
    expect(JSON.stringify(miPerfil)).not.toContain('hidden');
  });

  it('MSW mantiene paths R6.5B exactos del OpenAPI', () => {
    const handlers = readFileSync(join(process.cwd(), 'src/test/msw/handlers.ts'), 'utf8');
    for (const path of [
      '/NotasInternas/:entidadTipo/:entidadId',
      '/Pagos/checkout-pro/preferencias',
      '/SesionesPrivadas/:id/fotos/storage-key',
      '/Eventos/:eventoId/comentarios',
      '/Fotos/:fotoId/comentarios',
      '/Eventos/:eventoId/paquetes',
      '/Eventos/paginado',
      '/Favoritos/eventos/paginado',
      '/Favoritos/fotos/paginado',
      '/Pedidos/paginado',
      '/Admin/perfil-publico',
      '/Admin/mi-perfil',
      '/Sitio/perfil-fotografa',
      '/Sitio/perfil-fotografa/admin',
    ]) {
      expect(handlers).toContain(path);
    }
  });
});
