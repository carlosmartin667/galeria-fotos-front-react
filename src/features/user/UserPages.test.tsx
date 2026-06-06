import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AuthProvider } from '@/app/providers/AuthProvider';
import { AppRouter } from '@/app/router/AppRouter';
import { routes } from '@/config/routes';
import { authService } from '@/services/auth/authService';
import { vi } from 'vitest';

function renderAt(path: string) {
  cleanup();
  vi.spyOn(authService, 'getSession').mockReturnValue({ token: 'token', user: { email: 'cliente@test.local', roles: ['Cliente'] } });
  window.history.pushState({}, 'user', path);
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  render(<QueryClientProvider client={qc}><AuthProvider><AppRouter /></AuthProvider></QueryClientProvider>);
}

describe('user pages', () => {
  it('lista eventos y muestra detalle', async () => {
    renderAt(routes.user.eventos);
    expect(await screen.findByText('Evento escolar')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('link', { name: /Evento escolar/i }));
    expect(await screen.findByRole('heading', { name: 'Evento escolar' })).toBeInTheDocument();
  });

  it('lista fotos, no muestra StorageKey y permite favorito', async () => {
    renderAt(routes.user.fotos);
    expect(await screen.findByText('Foto principal')).toBeInTheDocument();
    expect(screen.queryByText(/private-key/)).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Favorito' }));
  });

  it('carrito muestra totales, cupon y crear pedido', async () => {
    renderAt(routes.user.carrito);
    expect((await screen.findAllByText('$1000')).length).toBeGreaterThan(0);
    await userEvent.type(screen.getByLabelText('Cupon'), 'MALO');
    await userEvent.click(screen.getByRole('button', { name: 'Aplicar cupon' }));
    expect(await screen.findByText('Cupon invalido.')).toBeInTheDocument();
    expect(screen.queryByText('hidden')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Crear pedido' }));
    expect(await screen.findByText('Pedido creado.')).toBeInTheDocument();
  });

  it('pedidos lista y detalle con cupon/descuento', async () => {
    renderAt(routes.user.pedidos);
    expect(await screen.findByText(/Cupon DTO10/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('link', { name: /P-001/i }));
    expect(await screen.findByText(/Descuento \$100/)).toBeInTheDocument();
  });

  it('descargas no muestra URL firmada completa', async () => {
    renderAt(routes.user.descargaDetail('des-1'));
    expect(await screen.findByRole('link', { name: 'Abrir descarga' })).toBeInTheDocument();
    expect(screen.queryByText(/sig=secret/)).not.toBeInTheDocument();
  });

  it('historial no muestra storage ni notas internas', async () => {
    renderAt(routes.user.historial);
    expect(await screen.findByText('Pedido creado')).toBeInTheDocument();
    expect(screen.queryByText(/hidden-key/)).not.toBeInTheDocument();
    expect(screen.queryByText(/admin only/)).not.toBeInTheDocument();
  });

  it('notificaciones marca leida y todas', async () => {
    renderAt(routes.user.notificaciones);
    expect(await screen.findByText('Pedido actualizado')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Marcar leida' }));
    await userEvent.click(screen.getByRole('button', { name: 'Marcar todas' }));
  });
});
