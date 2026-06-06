import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '@/app/providers/AuthProvider';
import { routes } from '@/config/routes';
import { authService } from '@/services/auth/authService';
import { AppRouter } from './AppRouter';

function renderRouterAt(path: string) {
  window.history.pushState({}, 'Test route', path);
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </QueryClientProvider>,
  );
}

describe('AppRouter lazy routes', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renderiza login lazy', async () => {
    vi.spyOn(authService, 'getSession').mockReturnValue(null);

    renderRouterAt(routes.auth.login);

    expect(await screen.findByRole('heading', { name: 'Ingresar' })).toBeInTheDocument();
  });

  it('renderiza admin dashboard lazy con sesion admin', async () => {
    vi.spyOn(authService, 'getSession').mockReturnValue({
      token: 'token',
      user: { email: 'admin@test.local', roles: ['Admin'] },
    });

    renderRouterAt(routes.admin.dashboard);

    expect(await screen.findByRole('heading', { name: 'Admin Dashboard' })).toBeInTheDocument();
  });
});
