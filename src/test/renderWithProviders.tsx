import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderOptions } from '@testing-library/react';
import { type ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '@/app/providers/AuthProvider';
import { authService } from '@/services/auth/authService';
import type { AuthSession } from '@/types/auth';

type AuthPreset = 'public' | 'user' | 'admin';

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  route?: string;
  auth?: AuthPreset | AuthSession;
  queryClient?: QueryClient;
}

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

function resolveSession(auth: RenderWithProvidersOptions['auth']): AuthSession | null {
  if (!auth || auth === 'public') {
    return null;
  }

  if (auth === 'admin') {
    return {
      token: 'test-admin-token',
      user: { email: 'admin@test.local', name: 'Admin Test', roles: ['Admin'] },
    };
  }

  if (auth === 'user') {
    return {
      token: 'test-user-token',
      user: { email: 'cliente@test.local', name: 'Cliente Test', roles: ['Cliente'] },
    };
  }

  return auth;
}

export function renderWithProviders(ui: ReactElement, options: RenderWithProvidersOptions = {}) {
  const { route = '/', auth = 'public', queryClient = createTestQueryClient(), ...renderOptions } = options;
  const session = resolveSession(auth);
  const originalGetSession = authService.getSession;

  authService.getSession = () => session;

  const result = render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </AuthProvider>
    </QueryClientProvider>,
    renderOptions,
  );

  authService.getSession = originalGetSession;

  return {
    ...result,
    queryClient,
  };
}
