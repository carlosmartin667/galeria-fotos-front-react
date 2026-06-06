import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '@/app/providers/AuthProvider';
import { routes } from '@/config/routes';
import { authService } from '@/services/auth/authService';
import { PublicLayout } from '@/app/layouts/PublicLayout/PublicLayout';

function renderLayout() {
  render(
    <AuthProvider>
      <MemoryRouter>
        <PublicLayout />
      </MemoryRouter>
    </AuthProvider>,
  );
}

describe('PublicLayout', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('muestra links publicos y no links admin completos', () => {
    vi.spyOn(authService, 'getSession').mockReturnValue(null);
    renderLayout();
    expect(screen.getByRole('link', { name: 'Servicios' })).toHaveAttribute('href', routes.public.servicios);
    expect(screen.queryByRole('link', { name: 'Bitacora' })).not.toBeInTheDocument();
  });

  it('usuario ve Panel a dashboard', () => {
    vi.spyOn(authService, 'getSession').mockReturnValue({ token: 'token', user: { email: 'c@test.local', roles: ['Cliente'] } });
    renderLayout();
    expect(screen.getByRole('link', { name: 'Panel' })).toHaveAttribute('href', routes.user.dashboard);
  });

  it('admin ve Panel a admin dashboard', () => {
    vi.spyOn(authService, 'getSession').mockReturnValue({ token: 'token', user: { email: 'a@test.local', roles: ['Admin'] } });
    renderLayout();
    expect(screen.getByRole('link', { name: 'Panel' })).toHaveAttribute('href', routes.admin.dashboard);
  });
});
