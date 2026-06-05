import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { configureApiAuth } from '@/services/api/apiClient';
import { authService } from '@/services/auth/authService';
import type { AuthSession, LoginCredentials, UserRole } from '@/types/auth';

interface AuthContextValue {
  session: AuthSession | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthSession>;
  logout: () => void;
  hasAnyRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function hasAdminRole(session: AuthSession | null) {
  return Boolean(session?.user.roles.some((role) => role.toLowerCase() === 'admin'));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() => authService.getSession());

  const logout = useCallback(() => {
    authService.clearSession();
    setSession(null);
  }, []);

  useEffect(() => {
    configureApiAuth({
      getToken: () => authService.getSession()?.token ?? null,
      onUnauthorized: logout,
    });
  }, [logout]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const nextSession = await authService.login(credentials);
    authService.saveSession(nextSession);
    setSession(nextSession);
    return nextSession;
  }, []);

  const hasAnyRole = useCallback(
    (roles: UserRole[]) =>
      Boolean(
        session?.user.roles.some((userRole) =>
          roles.some((role) => role.toLowerCase() === userRole.toLowerCase()),
        ),
      ),
    [session],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isAuthenticated: Boolean(session),
      isAdmin: hasAdminRole(session),
      login,
      logout,
      hasAnyRole,
    }),
    [hasAnyRole, login, logout, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider.');
  }
  return context;
}
