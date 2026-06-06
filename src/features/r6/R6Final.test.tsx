import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '@/app/providers/AuthProvider';
import { AppRouter } from '@/app/router/AppRouter';
import { getApiUrl } from '@/config/env';
import { routes } from '@/config/routes';
import { authService } from '@/services/auth/authService';
import { server } from '@/test/msw/server';

function renderAt(path: string, roles: string[] | null = null) {
  cleanup();
  vi.spyOn(authService, 'getSession').mockReturnValue(
    roles
      ? {
          token: 'test-token',
          user: { email: roles.includes('Admin') ? 'admin@test.local' : 'cliente@test.local', roles },
        }
      : null,
  );
  window.history.pushState({}, 'r6', path);
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </QueryClientProvider>,
  );
}

describe('R6 calidad final', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('mantiene rutas publicas accesibles sin sesion y sin links admin', async () => {
    renderAt(routes.public.home);

    expect(await screen.findByRole('heading', { name: /GaleriaFotos/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Admin' })).not.toBeInTheDocument();
  });

  it('usuario cliente no entra a admin y admin entra a dashboard', async () => {
    renderAt(routes.admin.dashboard, ['Cliente']);
    expect(await screen.findByRole('heading', { name: /acceso denegado/i })).toBeInTheDocument();

    renderAt(routes.admin.dashboard, ['Admin']);
    expect(await screen.findByRole('heading', { name: /Admin Dashboard/i })).toBeInTheDocument();
  });

  it('bitacora sanitiza tokens, storage keys y signed URLs', async () => {
    server.use(
      http.get(`${getApiUrl()}/Bitacora`, () =>
        HttpResponse.json({
          data: [
            {
              id: 'bit-1',
              fechaUtc: '2026-07-10T10:00:00Z',
              usuarioEmail: 'admin@test.local',
              accion: 'READ',
              severidad: 'Info',
              metadata: {
                token: 'raw-token',
                storageKey: 'private/file.jpg',
                signedUrl: 'https://cdn.test/a.jpg?sig=secret',
                visible: 'ok',
              },
            },
          ],
        }),
      ),
      http.get(`${getApiUrl()}/Bitacora/resumen`, () =>
        HttpResponse.json({ data: { signedUrl: 'https://cdn.test/b.jpg?sig=secret', total: 1 } }),
      ),
    );

    renderAt('/admin/bitacora', ['Admin']);

    expect(await screen.findByText('READ')).toBeInTheDocument();
    expect(screen.getByText(/visible/i)).toBeInTheDocument();
    expect(screen.queryByText(/raw-token/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/storageKey/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/private\/file/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/sig=secret/i)).not.toBeInTheDocument();
  });

  it('devtools sanitiza payload sensible antes de mostrarlo', async () => {
    server.use(
      http.get(`${getApiUrl()}/dev-tools/payloads/sensitive-metadata`, () =>
        HttpResponse.json({
          data: {
            token: 'raw-token',
            apiKey: 'raw-api-key',
            signedUrl: 'https://cdn.test/a.jpg?sig=secret',
            ok: true,
          },
        }),
      ),
    );

    renderAt('/admin/dev-tools', ['Admin']);
    await userEvent.click(await screen.findByRole('button', { name: 'Sensitive Metadata' }));

    expect(await screen.findByText(/ok/i)).toBeInTheDocument();
    expect(screen.queryByText(/raw-token/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/raw-api-key/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/sig=secret/i)).not.toBeInTheDocument();
  });

  it('admin layout expone menu admin y mantiene bitacora/devtools lazy', async () => {
    renderAt('/admin/reportes/ventas', ['Admin']);

    expect(await screen.findByRole('heading', { name: 'Reporte de ventas' })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Bitacora' }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: 'DevTools' }).length).toBeGreaterThan(0);
  });
});
