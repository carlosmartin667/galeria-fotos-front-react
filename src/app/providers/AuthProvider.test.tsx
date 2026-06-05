import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider, useAuth } from './AuthProvider';
import { authService } from '@/services/auth/authService';

function AuthProbe() {
  const { isAuthenticated, login, logout, session } = useAuth();
  return (
    <div>
      <div data-testid="state">{isAuthenticated ? session?.user.email : 'anon'}</div>
      <button type="button" onClick={() => login({ email: 'admin@test.com', password: 'Admin123456' })}>
        login
      </button>
      <button type="button" onClick={logout}>
        logout
      </button>
    </div>
  );
}

describe('AuthProvider', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
    vi.spyOn(authService, 'getSession').mockReturnValue(null);
    vi.spyOn(authService, 'saveSession').mockImplementation(() => undefined);
    vi.spyOn(authService, 'clearSession').mockImplementation(() => undefined);
  });

  it('permite login y logout', async () => {
    vi.spyOn(authService, 'login').mockResolvedValue({
      token: 'token',
      user: { email: 'admin@test.com', roles: ['Admin'] },
    });

    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    );

    expect(screen.getByTestId('state')).toHaveTextContent('anon');
    await userEvent.click(screen.getByRole('button', { name: 'login' }));
    await waitFor(() => expect(screen.getByTestId('state')).toHaveTextContent('admin@test.com'));
    await userEvent.click(screen.getByRole('button', { name: 'logout' }));
    expect(screen.getByTestId('state')).toHaveTextContent('anon');
  });
});
