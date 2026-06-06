import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { AuthProvider } from '@/app/providers/AuthProvider';
import { AppRouter } from '@/app/router/AppRouter';
import { routes } from '@/config/routes';

function renderRegister() {
  window.history.pushState({}, 'Register', routes.auth.register);
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });

  render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </QueryClientProvider>,
  );
}

describe('RegisterPage', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('valida campos requeridos', async () => {
    renderRegister();

    await userEvent.click(await screen.findByRole('button', { name: 'Crear cuenta' }));

    expect(await screen.findByText('Ingresa tu nombre.')).toBeInTheDocument();
    expect(screen.getByText('Ingresa un email valido.')).toBeInTheDocument();
  });

  it('valida confirmacion de password', async () => {
    renderRegister();

    await userEvent.type(await screen.findByLabelText('Nombre'), 'Cliente Test');
    await userEvent.type(screen.getByLabelText('Email'), 'nuevo@test.local');
    await userEvent.type(screen.getByLabelText('Contrasena'), 'Password123');
    await userEvent.type(screen.getByLabelText('Confirmar contrasena'), 'Password456');
    await userEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    expect(await screen.findByText('Las contrasenas no coinciden.')).toBeInTheDocument();
  });

  it('registra OK y redirige a login con mensaje', async () => {
    renderRegister();

    await userEvent.type(await screen.findByLabelText('Nombre'), 'Cliente Test');
    await userEvent.type(screen.getByLabelText('Email'), 'nuevo@test.local');
    await userEvent.type(screen.getByLabelText('Contrasena'), 'Password123');
    await userEvent.type(screen.getByLabelText('Confirmar contrasena'), 'Password123');
    await userEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    expect(await screen.findByRole('heading', { name: 'Ingresar' })).toBeInTheDocument();
    expect(screen.getByText('Cuenta creada. Ya podes iniciar sesion.')).toBeInTheDocument();
  });

  it('muestra error 400 seguro', async () => {
    renderRegister();

    await userEvent.type(await screen.findByLabelText('Nombre'), 'Cliente Test');
    await userEvent.type(screen.getByLabelText('Email'), 'existe@test.local');
    await userEvent.type(screen.getByLabelText('Contrasena'), 'Password123');
    await userEvent.type(screen.getByLabelText('Confirmar contrasena'), 'Password123');
    await userEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    expect(await screen.findByText('No pudimos crear la cuenta.')).toBeInTheDocument();
    expect(screen.queryByText(/hidden-password/)).not.toBeInTheDocument();
  });
});
