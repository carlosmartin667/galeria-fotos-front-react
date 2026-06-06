import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { hasAnyRole as userHasAnyRole, isAdminRole } from '@/config/roles';
import { configureApiAuth } from '@/services/api/apiClient';
import { authService } from '@/services/auth/authService';
import type { AuthSession, LoginCredentials, UserRole } from '@/types/auth';
import type { RegisterPayload } from '@/types/auth';

interface AuthContextValue {
  session: AuthSession | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthSession>;
  register: (payload: RegisterPayload) => Promise<AuthSession | null>;
  logout: () => void;
  hasAnyRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function hasAdminRole(session: AuthSession | null) {
  return Boolean(session?.user.roles.some(isAdminRole));
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

  const register = useCallback(async (payload: RegisterPayload) => {
    const nextSession = await authService.register(payload);
    if (nextSession) {
      authService.saveSession(nextSession);
      setSession(nextSession);
    }
    return nextSession;
  }, []);

  const hasAnyRole = useCallback(
    (roles: UserRole[]) => userHasAnyRole(session?.user.roles, roles),
    [session],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isAuthenticated: Boolean(session),
      isAdmin: hasAdminRole(session),
      login,
      register,
      logout,
      hasAnyRole,
    }),
    [hasAnyRole, login, logout, register, session],
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
