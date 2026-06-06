import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { getApiUrl } from '@/config/env';
import { createFotoMetadataAdmin, createStorageKeyAdmin, createStorageKeysBulkAdmin, updateFotoMetadataAdmin } from '@/services/admin/fotosAdminApi';
import { getReporteVentasAdmin } from '@/services/admin/reportesVentasApi';
import { getAgendaAdmin } from '@/services/admin/agendaAdminApi';
import { getBitacora } from '@/services/bitacora/bitacoraApi';
import { callDevTool, devToolEndpoints } from '@/services/dev-tools/devToolsApi';
import { getFotosEvento } from '@/services/fotos/fotosApi';
import { server } from '@/test/msw/server';

describe('R6.5A OpenAPI alignment', () => {
  it('fotosApi usa fotos por evento y no GET /Fotos', async () => {
    let eventoId = '';
    server.use(
      http.get(`${getApiUrl()}/Fotos/evento/:eventoId`, ({ params }) => {
        eventoId = String(params.eventoId);
        return HttpResponse.json({ data: [{ id: 'foto-1', nombreArchivo: 'x.jpg' }] });
      }),
    );

    const result = await getFotosEvento('ev-1');

    expect(eventoId).toBe('ev-1');
    expect(result).toHaveLength(1);
  });

  it('fotosAdminApi usa endpoints reales de storage y metadata', async () => {
    const calls: string[] = [];
    server.use(
      http.post(`${getApiUrl()}/Fotos/storage-key`, async ({ request }) => {
        calls.push(`POST ${new URL(request.url).pathname}`);
        const body = await request.json() as { eventoId?: string; nombreArchivo?: string };
        expect(body).toMatchObject({ eventoId: 'ev-1', nombreArchivo: 'x.jpg' });
        return HttpResponse.json({ data: { storageKey: 'private-key' } });
      }),
      http.post(`${getApiUrl()}/Fotos/metadata`, async ({ request }) => {
        calls.push(`POST ${new URL(request.url).pathname}`);
        const body = await request.json() as { eventoId?: string; nombreArchivo?: string; contentType?: string; storageKey?: string };
        expect(body).toMatchObject({ eventoId: 'ev-1', nombreArchivo: 'x.jpg', contentType: 'image/jpeg', storageKey: 'private-key' });
        return HttpResponse.json({ data: { id: 'foto-1' } });
      }),
      http.post(`${getApiUrl()}/Fotos/storage-keys/bulk`, () => {
        calls.push('POST /api/Fotos/storage-keys/bulk');
        return HttpResponse.json({ data: { ok: true } });
      }),
      http.put(`${getApiUrl()}/Fotos/:id`, ({ params }) => {
        calls.push(`PUT /api/Fotos/${params.id}`);
        return HttpResponse.json({ data: { ok: true } });
      }),
    );

    await createStorageKeyAdmin({ eventoId: 'ev-1', nombreArchivo: 'x.jpg' });
    await createFotoMetadataAdmin({ eventoId: 'ev-1', nombreArchivo: 'x.jpg', contentType: 'image/jpeg', storageKey: 'private-key' });
    await createStorageKeysBulkAdmin({ eventoId: 'ev-1', nombresArchivo: ['x.jpg'] });
    await updateFotoMetadataAdmin('foto-1', { nombreArchivo: 'x.jpg' });

    expect(calls).toEqual([
      'POST /api/Fotos/storage-key',
      'POST /api/Fotos/metadata',
      'POST /api/Fotos/storage-keys/bulk',
      'PUT /api/Fotos/foto-1',
    ]);
  });

  it('reportesVentasApi usa /Reportes/ventas/resumen con desde/hasta', async () => {
    let search = '';
    server.use(
      http.get(`${getApiUrl()}/Reportes/ventas/resumen`, ({ request }) => {
        search = new URL(request.url).search;
        return HttpResponse.json({ data: { total: 1 } });
      }),
    );

    await getReporteVentasAdmin({ desde: '2026-07-01', hasta: '2026-07-31' });

    expect(search).toContain('desde=2026-07-01');
    expect(search).toContain('hasta=2026-07-31');
  });

  it('bitacoraApi envia filtros completos con nombres OpenAPI', async () => {
    let params = new URLSearchParams();
    server.use(
      http.get(`${getApiUrl()}/Bitacora`, ({ request }) => {
        params = new URL(request.url).searchParams;
        return HttpResponse.json({ data: [] });
      }),
    );

    await getBitacora({
      desde: '2026-07-01',
      hasta: '2026-07-31',
      usuarioId: 'user-1',
      usuarioEmail: 'admin@test.local',
      accion: 'READ',
      entidadTipo: 'Pedido',
      entidadId: 'ped-1',
      severidad: 'Info',
      correlationId: 'corr-1',
      page: 2,
      pageSize: 50,
    });

    expect(Object.fromEntries(params)).toMatchObject({
      Desde: '2026-07-01',
      Hasta: '2026-07-31',
      UsuarioId: 'user-1',
      UsuarioEmail: 'admin@test.local',
      Accion: 'READ',
      EntidadTipo: 'Pedido',
      EntidadId: 'ped-1',
      Severidad: 'Info',
      CorrelationId: 'corr-1',
      Page: '2',
      PageSize: '50',
    });
  });

  it('agendaAdminApi envia filtros con nombres OpenAPI', async () => {
    let params = new URLSearchParams();
    server.use(
      http.get(`${getApiUrl()}/Agenda`, ({ request }) => {
        params = new URL(request.url).searchParams;
        return HttpResponse.json({ data: [] });
      }),
    );

    await getAgendaAdmin({ desde: '2026-07-01', hasta: '2026-07-31', tipo: 'Sesion', estado: 'Activa', activo: true });

    expect(Object.fromEntries(params)).toMatchObject({
      Desde: '2026-07-01',
      Hasta: '2026-07-31',
      Tipo: 'Sesion',
      Estado: 'Activa',
      Activo: 'true',
    });
  });

  it('devToolsApi expone los 21 endpoints del OpenAPI y usa POST para audit/test-entry', async () => {
    let method = '';
    server.use(
      http.post(`${getApiUrl()}/dev-tools/audit/test-entry`, ({ request }) => {
        method = request.method;
        return HttpResponse.json({ data: { ok: true } });
      }),
    );

    await callDevTool('/dev-tools/audit/test-entry');

    expect(devToolEndpoints).toHaveLength(21);
    expect(method).toBe('POST');
    expect(devToolEndpoints.map((endpoint) => endpoint.path)).toContain('/dev-tools/payloads/large-list');
  });

  it('MSW no mantiene handlers principales inventados para fotos/reportes', () => {
    const handlers = readFileSync(join(process.cwd(), 'src/test/msw/handlers.ts'), 'utf8');

    expect(handlers).not.toContain('/Fotos`,');
    expect(handlers).not.toContain('/Reportes/ventas`,');
    expect(handlers).not.toContain('/Ventas/resumen');
    expect(handlers).not.toContain('/Fotos/:id/metadata');
  });
});
