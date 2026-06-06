import { isAdminRole, isUserRole, normalizeRoles } from '@/config/roles';
import { getTokenPayload, isTokenExpired } from './jwt';
import { loginRequest, registerRequest } from './authApi';
import type { AuthSession, AuthUser, LoginCredentials, RegisterPayload, UserRole } from '@/types/auth';

const SESSION_KEY = 'gf.react.session';

function ensureKnownRoleFallback(roles: UserRole[]) {
  return roles.length > 0 && roles.some((role) => isAdminRole(role) || isUserRole(role)) ? roles : ['Invitado'];
}

function extractSession(response: unknown, email: string): AuthSession {
  const root = response && typeof response === 'object' ? (response as Record<string, unknown>) : {};
  const data = root.data && typeof root.data === 'object' ? (root.data as Record<string, unknown>) : root;
  const token = String(data.token ?? data.accessToken ?? data.jwt ?? '');

  if (!token) {
    throw new Error('La respuesta de autenticacion no incluye token.');
  }

  const claims = getTokenPayload(token) ?? {};
  const claimRoles =
    claims.role ??
    claims.roles ??
    claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

  const user: AuthUser = {
    id: String(data.userId ?? data.id ?? claims.sub ?? ''),
    email: String(data.email ?? claims.email ?? email),
    name: String(data.nombre ?? data.name ?? claims.name ?? ''),
    roles: ensureKnownRoleFallback(normalizeRoles(data.roles ?? data.role ?? claimRoles)),
  };

  return { token, user };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const response = await loginRequest(credentials);
    return extractSession(response, credentials.email);
  },

  async register(payload: RegisterPayload): Promise<AuthSession | null> {
    const response = await registerRequest(payload);
    const root = response && typeof response === 'object' ? (response as Record<string, unknown>) : {};
    const data = root.data && typeof root.data === 'object' ? (root.data as Record<string, unknown>) : root;
    const token = data.token ?? data.accessToken ?? data.jwt;

    if (typeof token === 'string' && token) {
      return extractSession(response, payload.email);
    }

    return null;
  },

  saveSession(session: AuthSession) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  },

  getSession(): AuthSession | null {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) {
      return null;
    }
    try {
      const parsed = JSON.parse(raw) as AuthSession;
      if (!parsed.token || !parsed.user?.email) {
        return null;
      }
      if (isTokenExpired(parsed.token)) {
        this.clearSession();
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  },

  clearSession() {
    sessionStorage.removeItem(SESSION_KEY);
  },

  isTokenExpired,
  getTokenPayload,
};
