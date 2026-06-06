import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '@/app/providers/AuthProvider';
import { AppRouter } from '@/app/router/AppRouter';
import { authService } from '@/services/auth/authService';

function renderAdminAt(path: string, roles = ['Admin']) {
  cleanup();
  vi.spyOn(authService, 'getSession').mockReturnValue({
    token: 'test-token',
    user: { email: 'admin@test.local', roles },
  });
  window.history.pushState({}, 'admin', path);
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

describe('admin R5', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('bloquea rutas admin a roles no admin sin limpiar sesion', async () => {
    renderAdminAt('/admin/dashboard', ['Cliente']);

    expect(await screen.findByRole('heading', { name: /acceso denegado/i })).toBeInTheDocument();
    expect(authService.getSession()?.user.roles).toContain('Cliente');
  });

  it('muestra navegacion admin completa', async () => {
    renderAdminAt('/admin/dashboard');

    expect(await screen.findByRole('heading', { name: /admin dashboard/i })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Eventos' }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: 'Cupones' }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: 'Reportes' }).length).toBeGreaterThan(0);
  });

  it('lista fotos admin sin exponer storageKey ni URL firmada', async () => {
    renderAdminAt('/admin/fotos');

    expect(await screen.findByText('Foto principal')).toBeInTheDocument();
    expect(screen.queryByText(/private-key/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/storageKey/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/sig=secret/i)).not.toBeInTheDocument();
  });

  it('valida formularios admin criticos', async () => {
    renderAdminAt('/admin/eventos/nuevo');

    await userEvent.click(await screen.findByRole('button', { name: 'Guardar' }));

    expect(await screen.findByText('Nombre requerido')).toBeInTheDocument();
  });

  it('permite revisar pedido admin e invocar cambio de estado', async () => {
    renderAdminAt('/admin/pedidos/ped-1');

    expect(await screen.findByText(/Pedido P-001/i)).toBeInTheDocument();
    expect(screen.getByText('Pendiente')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Cambiar estado' }));
  });

  it('muestra descarga admin sin URL firmada completa y permite regenerar', async () => {
    renderAdminAt('/admin/descargas/des-1');

    expect(await screen.findByRole('heading', { name: /Descarga foto.jpg/i })).toBeInTheDocument();
    expect(screen.queryByText(/signed.test/i)).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Regenerar' }));
  });

  it('muestra reportes y operaciones sin secretos', async () => {
    renderAdminAt('/admin/operaciones');

    expect(await screen.findByRole('heading', { name: 'Operaciones' })).toBeInTheDocument();
    expect(screen.getByText(/pendientes/i)).toBeInTheDocument();
    expect(screen.queryByText(/hidden-secret/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/secret/i)).not.toBeInTheDocument();
  });

  it('valida cupones y agenda', async () => {
    renderAdminAt('/admin/cupones');
    await userEvent.type(await screen.findByPlaceholderText('Codigo'), 'A');
    await userEvent.type(screen.getByRole('spinbutton'), '200');
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(await screen.findByText('Porcentaje 1-100')).toBeInTheDocument();

    renderAdminAt('/admin/agenda');
    await userEvent.type(await screen.findByPlaceholderText('Titulo'), 'Sesion');
    await userEvent.type(screen.getByPlaceholderText('Tipo'), 'Privada');
    await userEvent.type(screen.getByLabelText('Fecha inicio'), '2026-07-12T12:00');
    await userEvent.type(screen.getByLabelText('Fecha fin'), '2026-07-12T11:00');
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(await screen.findByText('La fecha fin debe ser posterior')).toBeInTheDocument();
  });
});
