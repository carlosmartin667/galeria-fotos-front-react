import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { AuthProvider } from '@/app/providers/AuthProvider';
import { AppRouter } from '@/app/router/AppRouter';
import { routes } from '@/config/routes';

function renderAppAt(path: string) {
  window.history.pushState({}, 'Test route', path);
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });

  render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </QueryClientProvider>,
  );
}

async function submitLogin(email: string) {
  await userEvent.type(await screen.findByLabelText('Email'), email);
  await userEvent.type(screen.getByLabelText('Contrasena'), 'Password123');
  await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
}

describe('LoginPage', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('redirige admin a dashboard admin', async () => {
    renderAppAt(routes.auth.login);

    await submitLogin('admin@test.local');

    expect(await screen.findByRole('heading', { name: 'Admin Dashboard' })).toBeInTheDocument();
  });

  it('redirige usuario a dashboard usuario', async () => {
    renderAppAt(routes.auth.login);

    await submitLogin('cliente@test.local');

    expect(await screen.findByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
  });

  it('respeta returnUrl seguro', async () => {
    renderAppAt(`${routes.auth.login}?returnUrl=${encodeURIComponent(routes.user.profile)}`);

    await submitLogin('cliente@test.local');

    expect(await screen.findByRole('heading', { name: 'Mi perfil' })).toBeInTheDocument();
  });

  it('ignora returnUrl a login para evitar loop', async () => {
    renderAppAt(`${routes.auth.login}?returnUrl=${encodeURIComponent(routes.auth.login)}`);

    await submitLogin('cliente@test.local');

    expect(await screen.findByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
  });

  it('muestra error seguro con credenciales invalidas', async () => {
    renderAppAt(routes.auth.login);

    await submitLogin('nadie@test.local');

    expect(await screen.findByText('Credenciales invalidas.')).toBeInTheDocument();
    expect(screen.queryByText(/secret-token/)).not.toBeInTheDocument();
  });
});
