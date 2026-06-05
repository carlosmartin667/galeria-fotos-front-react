import { apiClient } from '@/services/api/apiClient';
import type { AuthSession, AuthUser, LoginCredentials, UserRole } from '@/types/auth';

const SESSION_KEY = 'gf.react.session';

function decodeJwtPayload(token: string): Record<string, unknown> {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return {};
  }
}

function normalizeRoles(value: unknown): UserRole[] {
  if (Array.isArray(value)) {
    return value.map(String);
  }
  if (typeof value === 'string') {
    return value.split(',').map((role) => role.trim()).filter(Boolean);
  }
  return [];
}

function extractSession(response: unknown, email: string): AuthSession {
  const root = response && typeof response === 'object' ? (response as Record<string, unknown>) : {};
  const data = root.data && typeof root.data === 'object' ? (root.data as Record<string, unknown>) : root;
  const token = String(data.token ?? data.accessToken ?? data.jwt ?? '');

  if (!token) {
    throw new Error('La respuesta de autenticacion no incluye token.');
  }

  const claims = decodeJwtPayload(token);
  const claimRoles =
    claims.role ??
    claims.roles ??
    claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

  const user: AuthUser = {
    id: String(data.userId ?? data.id ?? claims.sub ?? ''),
    email: String(data.email ?? claims.email ?? email),
    name: String(data.nombre ?? data.name ?? claims.name ?? ''),
    roles: normalizeRoles(data.roles ?? data.role ?? claimRoles),
  };

  return { token, user };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const response = await apiClient.post('/Auth/login', credentials);
    return extractSession(response.data, credentials.email);
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
      return parsed.token && parsed.user?.email ? parsed : null;
    } catch {
      return null;
    }
  },

  clearSession() {
    sessionStorage.removeItem(SESSION_KEY);
  },
};
