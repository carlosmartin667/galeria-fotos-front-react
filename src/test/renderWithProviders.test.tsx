import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useAuth } from '@/app/providers/AuthProvider';
import { renderWithProviders } from './renderWithProviders';

function Probe() {
  const { session, isAdmin, isAuthenticated } = useAuth();
  return (
    <div>
      <span>{isAuthenticated ? session?.user.email : 'publico'}</span>
      <span>{isAdmin ? 'admin' : 'no-admin'}</span>
    </div>
  );
}

describe('renderWithProviders', () => {
  it('renderiza contexto publico', () => {
    renderWithProviders(<Probe />);

    expect(screen.getByText('publico')).toBeInTheDocument();
  });

  it('renderiza contexto admin autenticado', () => {
    renderWithProviders(<Probe />, { auth: 'admin', route: '/admin/dashboard' });

    expect(screen.getByText('admin@test.local')).toBeInTheDocument();
    expect(screen.getByText('admin')).toBeInTheDocument();
  });
});
