import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '@/app/providers/AuthProvider';
import { authService } from '@/services/auth/authService';
import { RoleRoute } from './RoleRoute';

describe('RoleRoute', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(authService, 'getSession').mockReturnValue({
      token: 'token',
      user: { email: 'cliente@test.com', roles: ['Cliente'] },
    });
  });

  it('bloquea usuarios no admin', () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/admin/dashboard']}>
          <Routes>
            <Route element={<RoleRoute roles={['Admin']} />}>
              <Route path="/admin/dashboard" element={<div>Admin</div>} />
            </Route>
            <Route path="/access-denied" element={<div>Acceso denegado</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    );

    expect(screen.getByText('Acceso denegado')).toBeInTheDocument();
  });

  it('permite admin en rutas admin', () => {
    vi.spyOn(authService, 'getSession').mockReturnValue({
      token: 'token',
      user: { email: 'admin@test.com', roles: ['Admin'] },
    });

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/admin/dashboard']}>
          <Routes>
            <Route element={<RoleRoute roles={['Admin']} />}>
              <Route path="/admin/dashboard" element={<div>Admin</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    );

    expect(screen.getByText('Admin')).toBeInTheDocument();
  });
});
