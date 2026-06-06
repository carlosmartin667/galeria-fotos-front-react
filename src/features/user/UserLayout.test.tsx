import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '@/app/providers/AuthProvider';
import { UserLayout } from '@/app/layouts/UserLayout/UserLayout';
import { authService } from '@/services/auth/authService';

describe('UserLayout', () => {
  beforeEach(() => {
    vi.spyOn(authService, 'getSession').mockReturnValue({ token: 'token', user: { email: 'c@test.local', roles: ['Cliente'] } });
  });
  it('muestra links cliente y no links admin de gestion', () => {
    render(<AuthProvider><MemoryRouter><UserLayout /></MemoryRouter></AuthProvider>);
    expect(screen.getByRole('link', { name: 'Eventos' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Mis pedidos' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Bitacora' })).not.toBeInTheDocument();
  });
});
